import { Router } from 'express';
import userPostRouter from './userPostRouter.js';
import userCommentRouter from './commentRouter.js';

const router = Router();
console.log("index");

router.get("/", (req, res) => {
    res.redirect("/home");
});

router.get("/homepage", (req, res) => {
    res.redirect("/home");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.use(userPostRouter);
router.use(userCommentRouter);

export default router;
