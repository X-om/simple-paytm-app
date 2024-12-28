const express = require('express');
const authMiddleware = require('../middleware');
const { User, Account } = require('../db');
const { default: mongoose } = require('mongoose');
const zod = require('zod');

const router = express.Router();


router.get('/balance',authMiddleware,async (req,res)=>{
    const userId = req.userId;
    const balance = await Account.findOne({userId}, {balance : 1});

    res.json({
        balance
    });
})



const transferSchema = zod.object({
    to: zod.string()
        .min(24, { message: 'Please enter a valid ObjectId' })
        .max(24, { message: 'Please enter a valid ObjectId' })
        .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid ObjectId format' }),
    amount: zod.number()
        .min(1, { message: 'Cannot send less than 1 INR' })
        .max(10000, { message: 'Cannot send more than 10,000 INR' })
});


router.post('/transfer', authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        const response = transferSchema.safeParse(req.body);
        if (!response.success) {
            const errors = response.error.errors.map(err => ({
                path: err.path,
                message: err.message,
            }));
            await session.abortTransaction(); 
            return res.status(400).json({ status: "failed", errors }); 
        }

        const { to, amount } = req.body;

        const account = await Account.findOne({ userId: req.userId }).session(session);
        if (!account || account.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({
                status: "failed",
                message: 'Insufficient balance',
            });
        }

        const toAccount = await Account.findOne({ userId: to }).session(session);
        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({
                status: "failed",
                message: 'Invalid account',
            });
        }

        await Account.updateOne(
            { userId: req.userId },
            { $inc: { balance: -amount } }
        ).session(session);

        await Account.updateOne(
            { userId: to },
            { $inc: { balance: amount } }
        ).session(session);

        await session.commitTransaction();
        return res.status(200).json({
            status: "success",
            message: 'Transfer successful',
        });
    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        console.error("Transfer error:", error);
        return res.status(500).json({
            status: "failed",
            message: 'An error occurred during the transfer',
        });
    } finally {
        session.endSession();
    }
});



module.exports = router;