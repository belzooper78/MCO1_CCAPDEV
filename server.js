
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
    //LOGIN ROUTES
    app.get('/login', (req, res) => {
        res.render("login", {
            layout: false,
            title: "Login"
        });
    });
    app.get("/signup", (req, res) => {
        res.render("signup");
    })
    
    
    // register user
    app.post("/signup", async (req, res) => {
        const data = {
            name: req.body.username,
            password: req.body.password,
            email: req.body.email
        }
        const existingUserByName = await collection.findOne({ name: data.name });
        if (existingUserByName) {
            return res.send("User with this username already exists. Choose a different username.");
        }
        const existingUserByEmail = await collection.findOne({ email: data.email });
        if (existingUserByEmail) {
            return res.send("User with this email already exists. Choose a different email.");
        }
    
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds); //password hash
    
        data.password = hashedPassword;
    
        // If no user with the same username or email exists, insert the new user data into the DB
        const userData = await collection.insertMany(data);
        console.log(userData);
    
        res.send("User signed up successfully!");
    });
    
    
    //login user
    app.post("/login", async (req, res) => {
        try {
            const check = await collection.findOne({name: req.body.username});
            if (!check) {
                res.send("User does not exist");
            }
    
            //compare hash pass with plain text
            const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
            if(isPasswordMatch){
                res.render("index");
            }
            else {
                req.send("Wrong Password");
            }
        }
        catch {
            res.send("Wrong Credentials");
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