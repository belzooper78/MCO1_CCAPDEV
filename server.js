
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
import user_Account from './src/db/user.js';

async function main(){
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const app = express();

    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
    }));

    app.use("/static", express.static(path.resolve(__dirname, './public')));  


    //https://stackoverflow.com/questions/10138518/handlebars-substring/25993386

    app.engine("hbs", exphbs.engine({extname:'hbs',
        helpers: {
            toDate: (date) => {
                return date.toUTCString(); 
            },
            trim: (input, end) => {
                return input.substring(0,end);
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

        const userId = req.session.user;
        console.log("user Id: "+JSON.stringify(userId));
        const stringed = JSON.stringify(userId);
        const userIdobject = userId !== undefined ? JSON.parse(stringed): console.log("userId is undefined");
        const newUserId = userId !== undefined ? userIdobject.id: console.log("^^^");

        const currentUserOG = await user_Account.findById(newUserId);
        //console.log("username: "+currentUser.username);

        
        try{
            let currentUser = {};
            if(currentUserOG) {
                currentUser={
                    username: currentUserOG.username,
                    imageP: currentUserOG.imageP,
                    imageB: currentUserOG.imageB
                }
                console.log(currentUser.username);
            }
        
            const user_postsArray = await user_posts.find({}).populate('createdBy').lean().exec();
          
            res.render("index", {
                layout: false,
                title: "UserPosts",
                userPosts: user_postsArray,
                isLoggedIn: isLoggedIn,
               
            });
        }catch{

        }

       
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