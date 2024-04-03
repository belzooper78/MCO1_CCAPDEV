
import "dotenv/config";
import express from 'express';
import path from 'path';
import router from "./src/routes/indexRouter.js";
import bcrypt from 'bcrypt';
import session from "express-session";
import { dirname } from "path";
import { fileURLToPath } from 'url';
import { connectToMongo} from "./src/db/conn.js";
import exphbs from 'express-handlebars';
import user_posts from './src/db/user_post.js';

async function main(){
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const app = express();

    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false}
        //, maxAge: 24 * 60 * 60 * 1000 
    }));

    //Sagor, 2019: https://stackoverflow.com/questions/44883228/how-to-get-the-express-session-variable-in-all-the-handlebars-pages-right-now-i
    app.use(function (req, res, next) {
        res.locals.session = req.session;
        next();
    });

    app.use("/static", express.static(path.resolve(__dirname, './public')));  


    //https://stackoverflow.com/questions/10138518/handlebars-substring/25993386

    app.engine("hbs", exphbs.engine({extname:'hbs',
        helpers: {
            toDate: (date) => {
                return date.toUTCString(); 
            },
            trim: (input, end) => {
                return input.substring(0,end);
            },

            //https://handlebarsjs.com/guide/block-helpers.html#the-with-helper
            findElement: (array, element, options) => {
                if(array.includes(element))
                    return options.fn(this);
                else 
                    return options.inverse(this);
            },
            compare: (arg1, arg2, options) => {
                if(arg1.toString() === arg2.toString())
                    return options.fn(this);
                else 
                    return options.inverse(this);
            }, 
            isGreaterThan0: (value, options) => {
                if(value > 0)
                    return options.fn(this);
                else 
                    return options.inverse(this);
            }
        }}));
    app.set("view engine", "hbs");
    app.set("views","./views");

    app.get('/', (req, res) => {
        res.redirect('/home');
    });

    app.get('/home', async (req, res) => {
        console.log(req.session.user);
        const isLoggedIn = req.session.user !== undefined;
        const user_postsArray = await user_posts.find({}).lean().exec();
        res.render("index", {
            layout: false,
            title: "UserPosts",
            userPosts: user_postsArray,
            isLoggedIn: isLoggedIn
        });
    });

    app.use(express.json());

    app.use(router);

    
    
    try{
        await connectToMongo();
        console.log("Connected to MongoDB server");
        app.listen(process.env.SERVER_PORT, () => {
            console.log("Express app now listening...");
        });
    } catch(err){

        console.log("error occured:");
        console.error(err);
        process.exit();
    }

}
main();