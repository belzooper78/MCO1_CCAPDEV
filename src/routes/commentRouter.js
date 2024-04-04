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
    console.log(req.session.user.username)
    try {
        const newUser_Comment = new user_comments({
            username: req.session.user.username,
            post: req.body.post,
            content: req.body.content,
            totalVote: 0,
            isEdited: false,
        });;
        await newUser_Comment.validate();
        await newUser_Comment.save();
        
        // console.log(newUser_Comment);
        res.sendStatus(200);

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});


userCommentRouter.get('/posts/:id/comments', async (req, res) => {
    const user_post = await user_posts.findById(req.params.id).populate('createdBy').lean().exec();
    const user_commentsArray = await user_comments.find({post: req.params.id}).lean().exec();
    const isLoggedIn = req.session.user !== undefined;
    // console.log(user_commentsArray);
    
    res.render("postComment", {
                username: user_post.username,
                title: user_post.title,
                content: user_post.content,
                _id: req.params.id, 
                totalVote: user_post.totalVote,
                isEdited: user_post.isEdited,
                upvote: user_post.upvote,
                downvote: user_post.downvote,
                PostComments: user_commentsArray,
                isLoggedIn: isLoggedIn
            });
});

userCommentRouter.put('/comments/:id/upvote', async (req, res) => {
    const commentId = req.params.id;
    const userId = req.session.user.id;
  
    try {
      const post = await user_comments.findById(commentId);
  
      if (!post) {
        return res.status(404).send('Post not found');
      }
  
      if (post.upvote.includes(userId)) {
        post.totalVote -= 1;
        post.upvote.pull(userId);
      } else if (!post.upvote.includes(userId)) {
        post.totalVote += 1;
        post.upvote.push(userId);
      }
  
      if (post.downvote.includes(userId)) {
        post.totalVote += 1;
        post.downvote.pull(userId);
      }
  
      
      await post.save();
  
      res.json({ totalVote: post.totalVote });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error upvoting post');
    }
  });
  
  userCommentRouter.put('/comments/:id/downvote', async (req, res) => {
    const commentId = req.params.id;
    const userId = req.session.user.id;
  
    try {
      const post = await user_comments.findById(commentId);
  
      if (!post) {
        return res.status(404).send('Post not found');
      }
  
      if (post.downvote.includes(userId)) {
        post.totalVote += 1;
        post.downvote.pull(userId);
      } else if (!post.downvote.includes(userId)){
        post.totalVote -= 1;
        post.downvote.push(userId);
      }
  
      if (post.upvote.includes(userId)) {
        post.totalVote -= 1;
        post.upvote.pull(userId);
      }
  
      
      await post.save();
  
      res.json({ totalVote: post.totalVote, upvote: post.upvote, downvote: post.downvote });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error downvoting post');
    }
  });

export default userCommentRouter;