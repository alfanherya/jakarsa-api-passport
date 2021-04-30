const express = require("express");
const app = express();
const db = require ("./config/db.config");
const User = require("./models/User");
const passport = require("passport");
const passportJWT = require("passport-jwt");

const jwt = require("jsonwebtoken");

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = "Provit99";

let strategy = new JwtStrategy(jwtOptions, (jwt_payload, next) => {
    let user = getUser({id: jwt_payload.id})

    if(user){
        next(null, user);
    }else{
        next(null, user);
    }
});

passport.use(strategy);

const getUser = async obj => {
    return await User.findOne({
        where: obj
    });
};





app.use(express.urlencoded({ extended: true}));

db.authenticate().then(() => console.log("database berhasil terkoneksi"));


/**
 * Router untuk membuat url api nya berdasarkan method GET, POST, DELETE atau PUT
 */
app.get("/", (req, res) => res.send("node bisa di buka di rest api"));

app.post("/login", async(req, res) => {
    try {
        const {email, password} = req.body

        if (email && password){
            let user = await getUser({email: email});

            if(!user){
                res.status(401).json({ message: "email belum terdaftar"});
            }

            if(user.password === password){
                let payload = { id: user.id}

                let token = jwt.sign(payload, jwtOptions.secretOrKey)

                res.json({msg: "oke", token: token})
            } else {
                res.status(401).json({msg: "password salah"})
            }
        }
    } catch (err) {
        console.error(err.msg);
        res.status(500).send("Server error");
    }
})

app.get("/protected", passport.authenticate("jwt", {session: false}), (req, res) => {
    try {
        res.send("Selamat sekarang kamu bisa mengakses router ini dengan passport js")
    } catch (err) {
        console.error(err.msg);
        res.status(500).send("Server Error");
    }

})


app.post("/register", async (req, res) => {
    try {
        const {email, password} = req.body

        const newUser = new User({
            email, password
        })

        await newUser.save();

        res.json(newUser);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
})

app.listen(3000, () => console.log("port berjalan di 4500"));