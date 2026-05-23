const express = require("express");
const { authMiddleware } = require("../middleware");
const { Account, Transaction, User } = require("../db");
const { default: mongoose } = require("mongoose");

const router = express.Router();

// An endpoint for user to get their balance.

router.get("/balance", authMiddleware, async (req,res) => {
    try {
        const account = await Account.findOne({
            userID: req.userID
        });

        if (!account) {
            return res.status(404).json({
                message: "Account not found"
            });
        }

        res.json({
            balance: account.balance
        });
    } catch (error) {
        console.error("Get balance error:", error);
        res.status(500).json({
            message: "Error fetching balance",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
})

// An endpoint for user to transfer money to another account

router.post("/transfer", authMiddleware, async (req, res) => {
    const { amount, to } = req.body;
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
    }
    if (!to || !mongoose.isValidObjectId(to)) {
        return res.status(400).json({ message: "Invalid account" });
    }

    // Prevent self-transfer
    if (req.userID.toString() === to.toString()) {
        return res.status(400).json({ message: "Cannot transfer money to yourself" });
    }

    let attempt = 0;
    const maxRetries = 3;

    while (attempt < maxRetries) {
        const session = await mongoose.startSession();
        try {
            await session.withTransaction(async () => {
                const fromAccount = await Account.findOne({ userID: req.userID }).session(session).exec();
                if (!fromAccount || fromAccount.balance < numericAmount) {
                    const err = new Error("Insufficient balance");
                    err.status = 400;
                    throw err;
                }

                const toAccount = await Account.findOne({ userID: to }).session(session).exec();
                if (!toAccount) {
                    const err = new Error("Invalid account");
                    err.status = 400;
                    throw err;
                }

                await Account.updateOne(
                    { userID: req.userID },
                    { $inc: { balance: -numericAmount } }
                )
                    .session(session)
                    .exec();




                // // 🔴 ======================================================
                // // THE TRAP: INJECT THIS CODE BLOCK HERE
                // // ======================================================
                // console.log("\n\n=======================================");
                // console.log("💰 STEP 1 COMPLETE: Money deducted from Sender.");
                // console.log("⏸️  PAUSING FOR 20 SECONDS...");
                // console.log("⚡️ KILL YOUR SERVER TERMINAL NOW (Ctrl + C) TO TEST ATOMICITY!");
                // console.log("=======================================\n\n");
                
                // // This freezes the code here for 20 seconds
                // await new Promise(resolve => setTimeout(resolve, 20000));
                // // ======================================================




                await Account.updateOne(
                    { userID: to },
                    { $inc: { balance: numericAmount } }
                )
                    .session(session)
                    .exec();

                // Create transaction record
                await Transaction.create([{
                    from: req.userID,
                    to: to,
                    amount: numericAmount
                }], { session });
            }, {
                writeConcern: { w: "majority" }
            });

            session.endSession();
            return res.json({ message: "Transfer Successful" });
        } catch (error) {
            session.endSession();
            const isTransient =
                error?.errorResponse?.errorLabels?.includes("TransientTransactionError") ||
                error?.codeName === "WriteConflict" ||
                error?.code === 112;

            if (isTransient && attempt < maxRetries - 1) {
                attempt += 1;
                continue;
            }

            if (error.status) {
                return res.status(error.status).json({ message: error.message });
            }

            console.error("Transfer error:", error);
            return res.status(500).json({
                message: "Internal server error",
                error: process.env.NODE_ENV === "development" ? error.message : undefined
            });
        }
    }
    
    // If we've exhausted all retries without success
    return res.status(500).json({
        message: "Transfer failed after multiple attempts. Please try again."
    });
});

// An endpoint to get transaction history
router.get("/transactions", authMiddleware, async (req, res) => {
    try {
        const transactions = await Transaction.find({
            $or: [
                { from: req.userID },
                { to: req.userID }
            ]
        })
        .populate('from', 'firstName lastName')
        .populate('to', 'firstName lastName')
        .sort({ timestamp: -1 })
        .limit(50); // Limit to last 50 transactions

        const formattedTransactions = transactions.map(txn => ({
            id: txn._id,
            from: {
                id: txn.from._id,
                name: `${txn.from.firstName} ${txn.from.lastName}`
            },
            to: {
                id: txn.to._id,
                name: `${txn.to.firstName} ${txn.to.lastName}`
            },
            amount: txn.amount,
            timestamp: txn.timestamp,
            type: txn.from._id.toString() === req.userID.toString() ? 'sent' : 'received'
        }));

        res.json({
            transactions: formattedTransactions
        });
    } catch (error) {
        console.error("Get transactions error:", error);
        res.status(500).json({
            message: "Error fetching transactions",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});



module.exports = router;