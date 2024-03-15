import { Router } from 'express';
import user_posts from '../db/user_post.js';

const userPostRouter = Router();


userPostRouter.get(("/userPosts" || "/home"), async (req, res) => {
    console.log("GET");
    const user_postsArray = await user_posts.find({}).lean().exec();
    res.render("index", {
        title: "UserPosts",
        userPosts: user_postsArray
    });
});
// console.log("userpost");

userPostRouter.post("/userPosts", async (req, res) => {
    console.log("POST request received for /home");
    // console.log(req.body)
    try {
        const newUser_Post = new user_posts(req.body);
        await newUser_Post.validate();
        await newUser_Post.save();
        
        // console.log(newUser_Post);
        res.sendStatus(200);

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

export default userPostRouter;