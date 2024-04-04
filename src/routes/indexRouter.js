import { Router } from 'express';
import userPostRouter from './userPostRouter.js';
import userCommentRouter from './commentRouter.js';
import userRouter from './userRouter.js';
import user_comments from '../db/user_comments.js';
import user_posts from '../db/user_post.js';
import mongoose from 'mongoose';


const router = Router();
console.log("index");

router.get("/", (req, res) => {
    res.redirect("/home");
});

router.get("/homepage", (req, res) => {
    res.redirect("/home");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/signup", (req, res) => {
    res.render("signup");
});

router.get("/Tags",(req, res) => {
    res.render("Tags");
});

//both posts and comments uses this
router.post("/update", async (req, res) => {
    console.log("POST request received for /update");
    console.log("reading...",req.body);
    let obj = Object.assign({});
    if("title" in req.body){
        Object.assign(obj, {title: req.body.title});
    }
    if("content" in req.body){
        Object.assign(obj, {content: req.body.content});
    }
    if("upvote" in req.body){
        Object.assign(obj, {upvote: req.body.upvote});
    }
    if("downvote" in req.body){
        Object.assign(obj, {downvote: req.body.downvote});
    }
    if("isEdited" in req.body){
        Object.assign(obj, {isEdited: req.body.isEdited});
    }
    if("isUpvoted" in req.body){
        Object.assign(obj, {isUpvoted: req.body.isUpvoted});
    }
    if("isDownvoted" in req.body){
        Object.assign(obj, {isDownvoted: req.body.isDownvoted});
    }

    if("post" in req.body){
        try {
            const update = await user_posts.findOneAndUpdate({_id: req.body.post}, obj);
            await update.validate();
            await update.save();
            console.log("update");
            console.log(update);
            res.sendStatus(200);
    
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }
    else if("comment" in req.body){
        try {
            const update = await user_comments.findOneAndUpdate({_id: req.body.comment}, obj);
            await update.validate();
            await update.save();
            
            console.log(update);
            res.sendStatus(200);
    
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }
});

router.use(userPostRouter);
router.use(userCommentRouter);
router.use(userRouter)

export default router;