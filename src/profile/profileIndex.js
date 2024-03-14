import express from 'express';
import path from 'path';
import collection from "./loginConfig.js";

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'hbs');

app.use(express.static("public"));




//username will be on the slash like facebook ex: facebook.com/nicoto(sagemode)
app.post("/:username", async (req, res) => {
    const username =  req.params.username;
    try {
        
        const check = await collection.findOne({username});
        if (!check) {
            res.send("User does not exist");
        }else {
            res.send("User exists")
            //messages related to user
            
        }
       
      
    }
    catch {
        res.send("User does not exist");
    }

});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
})