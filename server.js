
import "dotenv/config";
import express from 'express';
import path from 'path';
import router from "./src/routes/indexRouter.js";
import { dirname } from "path";
import { fileURLToPath } from 'url';
import { connectToMongo} from "./src/db/conn.js";
import exphbs from 'express-handlebars';
import user_posts from './src/db/user_post.js';

async function main(){
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const app = express();

    app.use("/static", express.static(path.join(__dirname + "/public")));  


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
        const user_postsArray = await user_posts.find({}).lean().exec();
        res.render("index", {
            layout: false,
            title: "UserPosts",
            userPosts: user_postsArray
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