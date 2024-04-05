import Router from "express";
import user_Account from '../db/user.js';
import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
import {Session} from 'express-session'
import multer from 'multer';

const userRouter = Router();

//https://medium.com/swlh/how-to-upload-image-using-multer-in-node-js-f3aeffb90657 multer

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/static/images/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage });

/*.fields([
    { name: 'profileImage', maxCount: 1 }, 
    { name: 'bgImage', maxCount: 1 } 

]);*/

//https://stackoverflow.com/questions/36096805/uploading-multiple-files-with-multer-but-from-different-fields
userRouter.post('/update-profile', 
upload.fields([{ 
    name: 'profileImage', maxCount: 1 
}, { 
    name: 'bgImage', maxCount: 1 
}]), async (req, res, next) => {
    try{
        const username = req.body.username;
        const pfp = req.files['profileImage'] ? req.files['profileImage'][0] : null; //null things
        const bgImage = req.files['bgImage'] ? req.files['bgImage'][0] : null;
        const desc = req.body.description;
        console.log("profile EDIT CHECK: "+username);

        const user = await user_Account.findOne({ username: username });
        if (!user) {
            res.sendStatus(400);
        } else{
            user.imageP = pfp?.path ?? user.imageP;
            user.imageB = bgImage?.path ?? user.imageB;
            user.desc = desc;
           
            await user.validate();
            await user.save();
            
            res.status(200);
        }
        
    }catch (err){
        console.log(err);
        res.sendStatus(500);
    }

   
  });
userRouter.post('/*login', async (req, res) => {
    try {
        console.log(req.body);
        const user = await user_Account.findOne({ username: req.body.username });
        if (!user) {
            // console.log(user);
            res.sendStatus(400);
        } else{
        const passIsValid = await bcrypt.compare(req.body.password, user.password);
        if (!passIsValid) {
            
            res.sendStatus(401);
        }

        if(user && passIsValid){
        req.session.user = {id: user._id.toString(), username: user.username};
        res.sendStatus(200);
            }
        }
        // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        // res.sendStatus(200).json({ token });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

userRouter.post('/*signup', async (req, res) => {
    console.log(req.body.password);
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    try {
        if (await user_Account.findOne({ username: req.body.username })) {
            //will check if this is actually the correct status
            res.sendStatus(401);
    } else{
        const user = new user_Account({username: req.body.username,
        password: hashedPass});
        await user.save();
        res.sendStatus(201);}
    } catch (err) {
        res.sendStatus(500);
    }
});

userRouter.get('/*logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500);
        }
        res.status(200);
        res.redirect("/home");
    });
});

export default userRouter;