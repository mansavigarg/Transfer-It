const express = require("express");
const { authMiddleware } = require("../middleware");
const { Account } = require("../db");
const { default: mongoose } = require("mongoose");

const router = express.Router();

// An endpoint for user to get their balance.

router.get("/balance", authMiddleware, async (req,res) => {
    const account = await Account.findOne({
        userID: req.userID
    });

    res.json({
        balance: account.balance
    })
})

// An endpoint for user to transfer money to another account

router.post("/transfer" , authMiddleware , async (req,res) => {
    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;

    // Fetch the accounts within the transaction
    const account = await Account.findOne({userID: req.userID}).session(session);

    if(!account || account.balance < amount){
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount = await Account.findOne({userID: to}).session(session);

    if(!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    // Perform the transfer
    await Account.updateOne({userID: req.userID}, {$inc:{balance: -amount}}).session(session);
    await Account.updateOne({userID: to}, {$inc:{balance: amount}} ).session(session);

    //commit the transaction
    await session.commitTransaction();
    res.json({
        message: "Transfer Successful"
    });
});



module.exports = router;