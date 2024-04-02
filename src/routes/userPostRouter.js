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
        const newUser_Post = new user_posts({
            username: req.session.user.username,
            title: req.body.title,
            content: req.body.content,
            totalVote: 0,
            isEdited: false,
        });
        await newUser_Post.validate();
        await newUser_Post.save();
        
        // console.log(newUser_Post);
        res.sendStatus(200);

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

userPostRouter.put('/posts/:id/upvote', async (req, res) => {
    const postId = req.params.id;
    const userId = req.session.user.id;
  
    try {
      const post = await user_posts.findById(postId);
  
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
  
  userPostRouter.put('/posts/:id/downvote', async (req, res) => {
    const postId = req.params.id;
    const userId = req.session.user.id;
  
    try {
      const post = await user_posts.findById(postId);
  
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


export default userPostRouter;