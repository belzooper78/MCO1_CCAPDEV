
import "dotenv/config";
import express from 'express';
import path from 'path';
import router from "./routes/indexRouter.js";
import { dirname } from "path";
import { fileURLToPath } from 'url';
import { connectToMongo, getDb } from "./db/conn.js";
import { renderFile } from 'ejs';

async function main(){
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const app = express();

    app.use(express.static(path.join(__dirname, 'public')));  

    // app.get('/', function (req, res, next) {
    //     res.render('index.html');
    // })

    // app.set('views', __dirname);
    // app.engine('html', renderFile);
    // app.set('view engine', 'html');

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
    
    
    // try{
    //     const db = getDb();
    // const showcase = db.collection('users');
    //     console.log("running...");
    // showcase.insertOne({
    //     firstname: 'Djikstra',
    //     Date_Joined: '05/09/2024',
    //     Num_posts: '10'
    // })} catch(err){
    //     console.error(err);
    // }
}
main();