import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import morgan from "morgan";
import "dotenv/config"
import MongoStore from "connect-mongo";
import authrouter from "./controller/auth.js";
import users from "./models/users.js";
import passUserToRoutes from "./middleware/pass_user_to_view.js";
import passErrorToView from "./middleware/pass_error_to_view.js";
const app = express();



// Middleware
app.use(morgan("dev"))
app.use(express.urlencoded());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
}));

app.use(passUserToRoutes);
app.use(passErrorToView);
const connect = ()=>{
    try {
        mongoose.connect(process.env.MONGODB_URI);
        console.log("🔒Connection to Database Establised");
    } catch (error) {
        console.log("🚨Failed to connect to Database🚨");
    }
}
connect();
app.get("/", (req, res)=>{
    res.render("index")
})
app.use("/auth", authrouter);
//server startup

app.listen(3000,()=>{
    console.log("Server running on port 3000")
})