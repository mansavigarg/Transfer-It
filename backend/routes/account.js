const express = require("express");
const { authMiddleware } = require("../middleware");
const { Account } = require("../db");
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

                await Account.updateOne(
                    { userID: to },
                    { $inc: { balance: numericAmount } }
                )
                    .session(session)
                    .exec();
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



module.exports = router;