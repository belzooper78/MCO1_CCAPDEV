import { Router } from 'express';
import user_comments from '../db/user_comments.js';
import user_posts from '../db/user_post.js';

const userCommentRouter = Router();


// userCommentRouter.get(("/comments"), async (req, res) => {
//     console.log("GET");
//     const user_commentsArray = await user_comments.find({post: req.body}).lean().exec();
//     res.render("postComment", {
//         title: "PostComments",
//         postComments: user_commentsArray
//     });
// });

userCommentRouter.post("/comments", async (req, res) => {
    console.log("POST request received for /postComment");
    // console.log(req.body)
    try {
        const newUser_Comment = new user_comments(req.body);
        await newUser_Comment.validate();
        await newUser_Comment.save();
        
        // console.log(newUser_Comment);
        res.sendStatus(200);

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});


userCommentRouter.get('/postComment/:ID', async (req, res) => {
    const user_post = await user_posts.findById(req.params.ID).lean().exec();
    const user_commentsArray = await user_comments.find({post: req.params.ID}).lean().exec();
    // console.log(user_commentsArray);
    
    res.render("postComment", {
                title: user_post.title,
                content: user_post.content,
                _id: req.params.ID, 
                upvote: user_post.upvote,
                downvote: user_post.downvote,
                isEdited: user_post.isEdited,
                isUpvoted: user_post.isUpvoted,
                isDownvoted: user_post.isDownvoted,
                PostComments: user_commentsArray
            });
});

export default userCommentRouter;