import { Router } from 'express';
import user_posts from '../db/user_post.js';
import { getUsername } from '../../server.js';
import collection from '../login/loginConfig.js'
import mongoose from 'mongoose'
const userPostRouter = Router();

userPostRouter.get(("/userPosts" || "/home"), async (req, res) => {
    console.log("GET");
    const user_postsArray = await user_posts.find({}).lean().exec();
    res.render("index", {
        title: "UserPosts",
        userPosts: user_postsArray
    });
});
console.log("userpost");

userPostRouter.post("/userPosts", async (req, res) => {
    console.log("POST request received for /home");
    //console.log(req.body);
    try {
        
        const userid =getUsername().id;
        const user_name = getUsername().name;
        
        //const objectid = new mongoose.Types.ObjectId(userid);
        //const userdetails = await user_posts.findById( userid).populate('createdBy').exec();
       // console.log("details: "+userdetails);
       // console.log("userid: "+userid);
       // console.log("user_name: "+user_name);
        const newUser_Post = new user_posts({
            title: req.body.title,
            content: req.body.content,
            createdBy: userid
        });
        await newUser_Post.validate();
        await newUser_Post.save();
        
        console.log(newUser_Post);
        res.sendStatus(200);

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

export default userPostRouter;