import { Router } from 'express';
import userPostRouter from './userPostRouter.js';

const router = Router();
console.log("index");

router.get("/", (req, res) => {
    res.redirect("/home");
});

router.get("/homepage", (req, res) => {
    res.redirect("/home");
});

router.use(userPostRouter);

export default router;