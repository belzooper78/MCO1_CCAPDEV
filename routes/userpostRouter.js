import { Router } from 'express';
import { getDb } from '../db/conn.js';

const userpostRouter = Router();
const db = getDb();
const user_posts = db.collection("user_posts");

userpostRouter.get("http://127.0.0.1:3000/index.html", async (req, res) => {
    console.log("GET");
    const user_postsArray = await user_posts.find({}).toArray();
    res.render("users", {
        title: "Users",
        users: user_postsArray
    });
});
console.log("userpost");

userpostRouter.post("http://127.0.0.1:3000/index.html", async (req, res) => {
    console.log("POST request received for /user_posts");
    console.log(req.body);
    try {
        const result = await user_posts.insertOne(req.body);

        console.log(result);
        res.sendStatus(200);

    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

export default userpostRouter;