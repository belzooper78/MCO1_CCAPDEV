import Router from "express";
import user_Account from '../db/user.js';
import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
import {Session} from 'express-session'

const userRouter = Router();

userRouter.post('/login', async (req, res) => {
    try {
        console.log(req.body);
        const user = await user_Account.findOne({ username: req.body.username });
        if (!user) {
            // console.log(user);
            res.sendStatus(400);
        } else{
        const passIsValid = await bcrypt.compare(req.body.password, user.password);
        if (!passIsValid) {
            
            res.sendStatus(401);
        }

        if(user && passIsValid){
        req.session.user = {id: user._id.toString()};
        res.sendStatus(200);
            }
        }
        // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        // res.sendStatus(200).json({ token });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

userRouter.post('/signup', async (req, res) => {
    console.log(req.body.password);
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    try {
        if (await user_Account.findOne({ username: req.body.username })) {
            //will check if this is actually the correct status
            res.sendStatus(401);
    } else{
        const user = new user_Account({username: req.body.username,
        password: hashedPass});
        await user.save();
        res.sendStatus(201);}
    } catch (err) {
        res.sendStatus(500);
    }
});

userRouter.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500);
        }
        res.status(200);
    });
});

export default userRouter;