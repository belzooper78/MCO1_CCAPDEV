import { Router } from 'express';
import { Types } from 'mongoose';
import user_posts from '../db/user_post.js';
import user_Account from '../db/user.js';

const userPostRouter = Router();


userPostRouter.get(("/userPosts" || "/home"), async (req, res) => {
    console.log("GET");
    const user_postsArray = await user_posts.find({}).populate('createdBy').lean().exec();

   // const pfpData = this.createdBy.imageP.data.toString('base64');
    //const contentType = this.createdBy.imageP.contentType;
    //await user_postsArray.populate('createdBy').execPopulate();
    
    res.render("index", {
        title: "UserPosts",
        userPosts: user_postsArray,
       // pfpData: pfpData,
       // contentType: contentType   
    });
    
});
// console.log("userpost");

userPostRouter.post("/userPosts", async (req, res) => {
    console.log("POST request received for /home");
    // console.log(req.body)
    try {
        //const newUser_Post = new user_posts(req.body);
        const user = req.session.user;
        const userId= new Types.ObjectId(user);
        const datenow = new Date();
        const currentDATE = datenow.getDate()+"/"+datenow.getMonth()+"/"+datenow.getFullYear();
        
        
       
        const newUser_Post = new user_posts({
            ...req.body,
            createdBy: userId,
            createdOn: currentDATE});
        
            
        await newUser_Post.validate();
        await newUser_Post.save();
        
        //await user_postsArray.find({createdBy : userId }).populate('createdBy').execPopulate();


        //await newUser_Post.populate('createdBy');
        //console.log(JSON.stringify(createdBy.username)+": TESTING");

        
        // console.log(newUser_Post);
        res.sendStatus(200);
        

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});


export default userPostRouter;