
import "dotenv/config";
import express from 'express';
import path from 'path';
import router from "./src/routes/indexRouter.js";
import { dirname } from "path";
import { fileURLToPath } from 'url';
import { connectToMongo} from "./src/db/conn.js";
import exphbs from 'express-handlebars';
import user_posts from './src/db/user_post.js';
import bodyParser from "body-parser";
import collection from "./src/login/loginConfig.js";
import bcrypt from 'bcrypt';
import Handlebars from 'handlebars';

let username = null;
function setUsername(user) {
    username = user; 
}
function getUsername() {
    return username; 
}

export{getUsername};

async function main(){
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const app = express();
   
    app.use("/static", express.static(path.join(__dirname + "/public")));  

    app.use(bodyParser.urlencoded({ extended: false }));
    //https://stackoverflow.com/questions/10138518/handlebars-substring/25993386


    Handlebars.registerHelper('limit', function (arr, limit) {
        if (!Array.isArray(arr)) { return []; }
        return arr.slice(0, limit);
    });
    //https://stackoverflow.com/questions/10377700/limit-results-of-each-in-handlebars-js


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

    //replacing session save for now
   
    app.get('/home', async (req, res) => {
        const user_postsArray = await user_posts.find({}).lean().exec();
       // let currentUser = req.session && req.session.username ? req.session.username : null;
        //let currentUser = req.session.username ? JSON.parse(req.session.username) : null;
        let currentUser = getUsername();
        res.render("index", {
            layout: false,
            title: "UserPosts",
            userPosts: user_postsArray,
            currentUser: currentUser
            
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
    app.get("/logout", (req, res) => {
         setUsername(null); //clears session for now ||not sure how to session handle properly yet

         res.redirect('/home');
    })
    app.get('/userprofile', async (req, res) => {
        let currentUser = getUsername();
        let userName = req.query.name;
        console.log('Username:', userName);
        const user_postsArray = await user_posts.find({}).lean().exec();
        res.render('userprofile', { 
            layout: false,
            title: "UserPosts",
            userPosts: user_postsArray,
            currentUser: currentUser, 
            userName: userName 
        });
    });

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
                return;
            }
    
            //compare hash pass with plain text
            let isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
            if(isPasswordMatch){
               
                username = {
                    id:check._id,
                    name: check.name,
                    image: check.image
                };
                setUsername(username);
               // req.session.username = JSON.stringify(username); //store data to session dont know how yet
                res.redirect("/home"); //instead of render index so that we can see posts
                
            }
            else {
                return res.send("Wrong Password");
            }
            
        }
        catch(err) {
           console.log(err)
           
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