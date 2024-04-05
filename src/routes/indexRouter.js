import { Router } from 'express';
import userPostRouter from './userPostRouter.js';
import userCommentRouter from './commentRouter.js';
import userRouter from './userRouter.js';
import tagRouter from './tagRouter.js';
import user_posts from '../db/user_post.js';
import tags from '../db/tags.js';

const router = Router();
console.log("index");

router.get('/', (req, res) => {
    res.redirect('/home');
});


router.get('/home', async (req, res) => {
    console.log(req.session.user);
    const isLoggedIn = req.session.user !== undefined;
    var user_postsArray = null;
    if(isLoggedIn){
    user_postsArray = await user_posts.find({}).sort({dateTime : -1}).lean().exec();
    } else {
    user_postsArray = await user_posts.find({}).sort({dateTime : -1}).limit(15).lean().exec();
    }
    const frequentTopics = await tags.find({}).sort({totalUsed : -1}).limit(10).lean().exec();
    const newTopics = await tags.find({}).sort({timeCreated : -1}).limit(10).lean().exec();

    res.render("index", {
        layout: false,
        title: "UserPosts",
        userPosts: user_postsArray,
        isLoggedIn: isLoggedIn,
        frequentTopics: frequentTopics,
        newTopics: newTopics
    });

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

//https://www.mongodb.com/docs/manual/reference/operator/query/or/
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
//https://expressjs.com/en/api.html
router.get("/posts", async (req, res) => {
    const isLoggedIn = req.session.user !== undefined;
    var query_Str = ""
    if (req.query.search == undefined)
        query_Str = decodeURIComponent("");
    else
        query_Str = decodeURIComponent(req.query.search) || "";
    const words_Array = query_Str.split(/\s+/);
    const regex_Array = words_Array.map((word) => new RegExp('\\b' + word + '\\b', "i"));
    const sortPost = req.query.sort || 1;
    var sortOption = {dateTime : -1};
    var isPopular = false;
    var isLatest = true;
    switch(sortPost){
        case "1":
            sortOption = {dateTime: -1};
            isPopular = false;
            isLatest = true;
        break;
        case "2":
            sortOption = {totalVote: -1};
            isPopular = true;
            isLatest = false;
        break;
    }       

    var user_postsArray = null;
    if(isLoggedIn){
    user_postsArray = await user_posts.find({
        $or: [
          { title: { $regex: regex_Array } },
          { content: { $regex: regex_Array } },
        ],
      }).sort(sortOption).lean().exec();
    } 
    
    else {
    user_postsArray = await user_posts.find({
        $or: [
          { title: regex_Array },
          { content: regex_Array },
        ],
      }).sort(sortOption).limit(15).lean().exec();
    }



    const frequentTopics = await tags.find({}).sort({totalUsed : -1}).limit(10).lean().exec();
    const newTopics = await tags.find({}).sort({timeCreated : -1}).limit(10).lean().exec();

    res.render("index", {
        userPosts: user_postsArray,
        isLoggedIn: isLoggedIn,
        frequentTopics: frequentTopics,
        newTopics: newTopics,
        isPopular: isPopular,
        isLatest: isLatest
    });
});

router.use(tagRouter);
router.use(userPostRouter);
router.use(userCommentRouter);
router.use(userRouter);


export default router;