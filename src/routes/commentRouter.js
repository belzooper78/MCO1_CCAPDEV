import { Router } from 'express';
import user_comments from '../db/user_comments.js';
import user_posts from '../db/user_post.js';
import tags from '../db/tags.js';

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
    console.log("POST request received for /comments");
    console.log(req.session.user.username)
    try {
        const post = await user_posts.findById(req.body.post);
        post.totalComments += 1;
        const newUser_Comment = new user_comments({
            username: req.session.user.username,
            post: req.body.post,
            content: req.body.content,
            totalVote: 0,
            totalReplies: 0,
            isEdited: false,
        });;
        await newUser_Comment.validate();
        await newUser_Comment.save();
        await post.save();
        
        // console.log(newUser_Comment);
        res.sendStatus(200);

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

userCommentRouter.put('/comments/:id/delete', async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await user_comments.findByIdAndUpdate(postId, 
      {username: "<deleted>", 
      content: "<deleted>"});

    if (!post) {
      return res.status(404).send('Post not found');
    }
    
    await post.save();
    res.sendStatus(200);

  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating post');
  }
});

userCommentRouter.put('/comments/:id/edit', async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await user_comments.findByIdAndUpdate(postId, 
      {content: req.body.content, isEdited: true});

    if (!post) {
      return res.status(404).send('Post not found');
    }
    
    await post.save();
    res.sendStatus(200);

  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating post');
  }
});

userCommentRouter.post("/replies", async (req, res) => {
  console.log("POST request received for /replies");
  console.log(req.session.user.username)
  try {
      const comment = await user_comments.findById(req.body.post);
      comment.totalReplies += 1;
      const newUser_Reply = new user_comments({
          username: req.session.user.username,
          post: req.body.post,
          content: req.body.content,
          totalVote: 0,
          totalReplies: 0,
          isEdited: false,
      });;
      await newUser_Reply.validate();
      await newUser_Reply.save();
      await comment.save();
      
      // console.log(newUser_Comment);
      res.sendStatus(200);

  } catch (err) {
      console.error(err);
      res.sendStatus(500);
  }
});

userCommentRouter.get('/comments/:id/replies', async (req, res) => {
  const user_comment = await user_comments.findById(req.params.id).lean().exec();
  const user_replyArray = await user_comments.find({post: req.params.id}).lean().exec();
  const isLoggedIn = req.session.user !== undefined;
  const frequentTopics = await tags.find({}).sort({totalUsed : -1}).limit(10).lean().exec();
  const newTopics = await tags.find({}).sort({timeCreated : -1}).limit(10).lean().exec();
  // console.log(user_commentsArray);
  
  res.render("postComment", {
              username: user_comment.username,
              title: user_comment.username + "'s Comment",
              content: user_comment.content,
              _id: req.params.id, 
              totalVote: user_comment.totalVote,
              totalComments: user_comment.totalReplies,
              isEdited: user_comment.isEdited,
              upvote: user_comment.upvote,
              downvote: user_comment.downvote,
              PostComments: user_replyArray,
              isLoggedIn: isLoggedIn,
              isReply: true,
              dateTime: user_comment.dateTime,
              frequentTopics: frequentTopics,
              newTopics: newTopics
          });
});

userCommentRouter.get('/posts/:id/comments', async (req, res) => {
    const user_post = await user_posts.findById(req.params.id).lean().exec();
    const user_commentsArray = await user_comments.find({post: req.params.id}).lean().exec();
    const isLoggedIn = req.session.user !== undefined;
    const frequentTopics = await tags.find({}).sort({totalUsed : -1}).limit(10).lean().exec();
    const newTopics = await tags.find({}).sort({timeCreated : -1}).limit(10).lean().exec();
    // console.log(user_commentsArray);
    
    res.render("postComment", {
                username: user_post.username,
                title: user_post.title,
                content: user_post.content,
                _id: req.params.id, 
                totalVote: user_post.totalVote,
                totalComments: user_post.totalComments,
                isEdited: user_post.isEdited,
                upvote: user_post.upvote,
                downvote: user_post.downvote,
                PostComments: user_commentsArray,
                isLoggedIn: isLoggedIn,
                isReply: false,
                dateTime: user_post.dateTime,
                frequentTopics: frequentTopics,
                newTopics: newTopics
            });
});

userCommentRouter.get('/replies/:id/parent', async (req, res) => {
  const user_reply = await user_comments.findById(req.params.id).lean().exec();
  const user_post = await user_comments.findById(user_reply.post).lean().exec();
  var isAReply = false;
  var parent = null;
  if(user_post){
    parent = user_post;
    isAReply = true;
  } else{
    parent = await user_posts.findById(user_reply.post).lean().exec();
    isAReply = false;
  }
  const user_commentsArray = await user_comments.find({post: user_reply.post}).lean().exec();
  const isLoggedIn = req.session.user !== undefined;
  // console.log(user_commentsArray);
  
  res.render("postComment", {
              username: parent.username,
              title: parent.title,
              content: parent.content,
              _id: user_reply.post, 
              totalVote: parent.totalVote,
              totalComments: parent.totalComments,
              isEdited: parent.isEdited,
              upvote: parent.upvote,
              downvote: parent.downvote,
              PostComments: user_commentsArray,
              isLoggedIn: isLoggedIn,
              isReply: isAReply,
              dateTime: parent.dateTime
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