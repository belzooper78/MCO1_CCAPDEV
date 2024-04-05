import { Router } from 'express';
import user_posts from '../db/user_post.js';
import tags from '../db/tags.js';

const userPostRouter = Router();


userPostRouter.get(("/userPosts" || "/home"), async (req, res) => {
    console.log("GET");
    const user_postsArray = await user_posts.find({}).populate('createdBy').lean().exec();
    res.render("index", {
        title: "UserPosts",
        userPosts: user_postsArray
    });
});
// console.log("userpost");

userPostRouter.post("/userPosts", async (req, res) => {
    console.log("POST request received for /home");
    // console.log(req.body)

    var postTags = req.body.content.match(/#\w+/g) || [];
    const low_postTags = postTags.map(tag => tag.toLowerCase());

    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
    postTags = [...new Set(low_postTags)];

    try {
      const user = req.session.user;
      const userId= new Types.ObjectId(user);
      const datenow = new Date();
      const currentDATE = datenow.getDate()+"/"+datenow.getMonth()+"/"+datenow.getFullYear();

        const newUser_Post = new user_posts({
            username: req.session.user.username,
            title: req.body.title,
            content: req.body.content,
            totalVote: 0,
            totalComments: 0,
            isEdited: false,
            tags: postTags,
            createdBy: userId,
            createdOn: currentDATE
        });
        await newUser_Post.validate();
        await newUser_Post.save();

        for(const tag of postTags){
          const update_Tags = await tags.findOneAndUpdate({tagName: tag}, {$inc: { totalUsed: 1 }}, 
            { upsert: true, new: true, setDefaultsOnInsert: true });
            await update_Tags.save();
        }


        
        // console.log(newUser_Post);
        res.sendStatus(200);

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});



userPostRouter.put('/posts/:id/delete', async (req, res) => {
  const postId = req.params.id;

  const prevPost = await user_posts.findById(postId);
  const prevTags = prevPost.tags;

  try {

    if (!prevPost) {
      return res.sendStatus(404);
    }

    for(const tag of prevTags){
      const update_Tags = await tags.findOneAndUpdate({tagName: tag}, {$inc: { totalUsed: -1 }}, 
        { new: true });

        if(update_Tags.totalUsed === 0){
          await tags.findOneAndDelete({_id: update_Tags._id});
        }
        else{
          await update_Tags.save();
        }
    }

    const post = await user_posts.findByIdAndUpdate(postId, 
      {username: "<deleted>",
      content: "<deleted>", 
        tags: []});

    await post.save();
    res.sendStatus(200);

  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating post');
  }
});

userPostRouter.put('/posts/:id/edit', async (req, res) => {
  const postId = req.params.id;

  const prevPost = await user_posts.findById(postId);
  const prevTags = prevPost.tags;
  var postTags = req.body.content.match(/#\w+/g) || [];
  postTags = req.body.content.match(/#\w+/g) || [];
  const low_postTags = postTags.map(tag => tag.toLowerCase());
  postTags = [...new Set(low_postTags)];

  try {

    if (!prevPost) {
      return res.sendStatus(404);
    }

    //editing may remove tags, hence lowering the usage count
    for(const tag of prevTags){
      const update_Tags = await tags.findOneAndUpdate({tagName: tag}, {$inc: { totalUsed: -1 }}, 
        { new: true });

        if(update_Tags.totalUsed === 0){
          await tags.findOneAndDelete({_id: update_Tags._id});
        }

        else{
          await update_Tags.save();
        }
    }

    const post = await user_posts.findByIdAndUpdate(postId, 
      {content: req.body.content, 
        tags: postTags,
        isEdited: true});

    

      for(const tag of postTags){
        const update_Tags = await tags.findOneAndUpdate({tagName: tag}, {$inc: { totalUsed: 1 }}, 
          { upsert: true, new: true, setDefaultsOnInsert: true });
          await update_Tags.save();
      }
    
    await post.save();
    res.sendStatus(200);

  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating post');
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