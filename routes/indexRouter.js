import { Router } from 'express';
import userpostRouter from './userpostRouter.js';

const router = Router();
console.log("index");


// router.get("/", (req, res) => {
//     res.render("index.html");
// });

router.use(userpostRouter);

export default router;