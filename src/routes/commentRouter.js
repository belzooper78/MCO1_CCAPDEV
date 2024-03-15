import { Router } from 'express';
import user_posts from '../db/user_post.js';

const userCommentRouter = Router();

// userCommentRouter.get(("/postComments"), async (req, res) => {
//     console.log("GET");
//     const user_post = await user_posts.findById(req._id).lean().exec();
//     res.render("postComment", {
//         title: "UserPost",
//         userPosts: user_post
//     });
// });

// userCommentRouter.post("/postComments", async (req, res) => {
//     console.log("POST request received for /postComment");
//     try{
//     const user_post = await user_posts.findById(req.body._id).lean().exec();
//     // console.log(user_post);
//     res.send({
//         body: JSON.stringify({UserPost: user_post}), 
//         headers: {
//         'Content-Type': 'application/json'
//     }});
// } catch(err){
//         console.error(err);
//     }
// });


userCommentRouter.get('/postComment/:ID', async (req, res) => {
    const user_post = await user_posts.findById(req.params.ID).lean().exec();
    console.log(user_post);
    
    res.render("postComment", {
                title: user_post.title,
                content: user_post.content
            });
});

export default userCommentRouter;
