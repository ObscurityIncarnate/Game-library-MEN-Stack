import express from "express";
import users from "../models/users.js";
import bcrypt from "bcrypt"
import isSignedOut from "../middleware/is_signed_out.js";
import isSignedIn from "../middleware/is_signed_in.js";
const router = express.Router();

router.get("/sign-in",isSignedOut, async (req, res)=>{
    res.render("auth/sign-in");
});
router.post("/sign-in",isSignedOut, async (req, res)=>{
    
    try {
        const username = req.body.username
        const user = await users.findOne({username: username});
        if(!user){
            throw new Error("Invalid Username");
        };
        if(!bcrypt.compareSync(req.body.password, user.password )){
            throw new Error("Invalid Password");
        };

        req.session.user = {
            _id: user._id,
            username: user.username
        }

        req.session.save(()=>{
            res.redirect("/")
        })
    } catch (error) {
        res.render("auth/sign-in", {error: error.message})  ;
    }
});
router.get("/sign-up", isSignedOut, (req, res)=>{
    res.render("auth/sign-up");
});
router.post("/sign-up", isSignedOut, async(req, res)=>{
    try {
        const email = req.body.email;
        const password =  req.body.password;
        const username =  req.body.username;
        if(await users.findOne({email: email})){
            throw new Error("Email Already taken");
        }
        if(await users.findOne({username: username})){ 
            throw new Error("Username Already taken");
        }
        if(password !== req.body["confirm-password"]){ 
            throw new Error("Passwords do not match");
        }

        req.body.password = await bcrypt.hash(password, 12);
        console.log(req.body)
        await users.create(req.body)
        res.redirect("/")
        console.log("User created Successfully")
    } catch (error) {
        res.render("auth/sign-up", {error: error.message})  ;
    }
});

router.get("/sign-out", isSignedIn, (req, res)=>{
    req.session.destroy(()=>{
        res.redirect("/")
    })
    
});
export default router