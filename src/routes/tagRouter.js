import { Router } from 'express';
import tags_db from '../db/tags.js';

const tagRouter = Router();

tagRouter.get('/tagList', async (req, res) => {
    const isLoggedIn = req.session.user !== undefined;
    const tags_Array = await tags_db.find({}).sort({totalUsed : -1}).lean().exec();

    res.render("tags", {
        tags: tags_Array,
        isLoggedIn: isLoggedIn
    });

});

export default tagRouter;