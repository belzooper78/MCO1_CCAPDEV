
import "dotenv/config";
import express from 'express';
import path from 'path';
import router from "./src/routes/indexRouter.js";
import session from "express-session";
import { dirname } from "path";
import { fileURLToPath } from 'url';
import { connectToMongo} from "./src/db/conn.js";
import exphbs from 'express-handlebars';


async function main(){
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const app = express();

    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000}
        //, maxAge: 24 * 60 * 60 * 1000 
    }));

    //Sagor, 2019: https://stackoverflow.com/questions/44883228/how-to-get-the-express-session-variable-in-all-the-handlebars-pages-right-now-i
    app.use(function (req, res, next) {
        res.locals.session = req.session;
        next();
    });

    app.use("/static", express.static(path.resolve(__dirname, './public')));  

    app.use(express.json());

    app.use(router);



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