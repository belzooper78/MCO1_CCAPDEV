import express from 'express';
import path from 'path';
import bcrypt from 'bcrypt';
import collection from "./loginConfig.js";

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'hbs');

app.use(express.static("public"));

app.get("/login", (req, res) => {
    res.render("login");
})

app.get("/signup", (req, res) => {
    res.render("signup");
})


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
        }

        //compare hash pass with plain text
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if(isPasswordMatch){
            res.render("index");
        }
        else {
            req.send("Wrong Password");
        }
    }
    catch {
        res.send("Wrong Credentials");
    }

});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
})