import express from "express";
import Games from "../models/games.js";
import isAdmin from "../middleware/is_admin.js";
import isSignedIn from "../middleware/is_signed_in.js";
import { cloudinary, uploadBuffer } from "../config/cloudinary.js";
import multer from "multer";

const router =  express.Router();
const upload = multer({storage: multer.memoryStorage()});
const uploadMiddleware = upload.fields([{name: "gameIcon", maxCount: 1}, {name:"backgroundImage", maxCount: 1}, {name: "gallery", maxCount: 8}]);
router.get("/", async(req,res)=>{
    try {
        const games  = await Games.find();
        res.render("games/index",{games});
    } catch (error) {
        console.log(error)
        res.render("error",{error: {
                message: "Something went wrong. Please try again later", 
                status: 500
            }})   
    }
    
});
router.post("/", isSignedIn, isAdmin, uploadMiddleware, async(req,res)=> {
    console.log(req.body);
    try {
        console.log(req.files)
        // let gameIconUrl;
        // let gameBackgroundUrl;
        // let galleryUrl;
        if(req.files.gameIcon){
            const  uploadResult = await uploadBuffer(req.files.gameIcon[0].buffer)
            console.log(uploadResult)
            req.body.gameIcon= uploadResult.secure_url;
        }
        if(req.files.backgroundImage){
            const  uploadResult = await uploadBuffer(req.files.backgroundImage[0].buffer)
            console.log(uploadResult)
            req.body.gameBackgroundUrl = uploadResult.secure_url;
        }
        if(req.files.gallery && req.files.gallery.length > 0){
            const uploadResponses =  await Promise.all(req.files.gallery.map(imageFile => uploadBuffer(imageFile.buffer)));
            console.log(uploadResponses)
            req.body.gallery=uploadResponses.map(response => response.secure_url);
        }
        // req.body.gameIcon = gameIconUrl;
        // req.body.gameBackgroundUrl = gameBackgroundUrl;
        // req.body.gallery =galleryUrl;
        console.log(req.body);
        console.log(typeof req.body.gallery)
        await Games.create(req.body);
        req.session.message = `${req.body.name} has been successfully created`;
        res.redirect("/games");
        
    } catch (error) {
        console.log(error)
        res.render("error",
            {error: {
                message: "Something went wrong. Please try again later", 
                status: 500
            }}
        )   
    }
})
router.get("/new",isSignedIn, isAdmin, (req,res)=>{
    res.render("games/new");
});
router.get("/:gameId", isSignedIn, async (req,res)=>{
    try {
        const gameId =  req.params.gameId;
        const game = await Games.findById(gameId);
        if(game){
            console.log(game)
            res.render("games/show", {game});
        }else{
            throw new Error("Couldnt find the game you were looking for");
        }
    } catch (error) { 
        console.log(error);
        res.render("error",
            {error: {
                message: error.message, 
                status: 404
            }}
        );    
    }
    
});
router.post("/:gameId/delete", isSignedIn, isAdmin, async (req,res) => {
    try {
        const gameId =  req.params.gameId;
        const game =  await Games.findById(gameId);
        if(game){
            await Games.findByIdAndDelete(gameId);
            req.session.message = `Successfully deleted ${game.name}`;
            res.redirect("/games")
        }else{
            throw new Error("Couldnt find the game you were looking for")
        }
    } catch (error) {
        console.log(error);
        req.session.error = `Failed to delete ${req.body.name}.`
        res.redirect("/games");
    }
})

router.get("/:gameId/edit", isSignedIn, isAdmin, async (req, res) => {
    try {
        const gameId  = req.params.gameId;
        const game= await Games.findById(gameId);
        if(game){
            res.render("games/edit",{game});
        }else{
            throw new Error("Couldnt find the game you were looking for")
        }
    } catch (error) {
        console.log(error);
        res.render("error",
            {error: {
                message: error.message, 
                status: 404
            }}
        )    
    }
})
router.post("/:gameId/edit", isSignedIn, isAdmin, async (req,res) => {
    
    try {
        const gameId =  req.params.gameId;
        console.log(req.body);
        req.body.gallery  = req.body.gallery.split(",");
        await Games.findByIdAndUpdate(gameId, req.body);
        req.session.message = `Successfully Updated ${req.body.name}`;
        res.redirect("/games")
    } catch (error) {
        req.session.error = `Failed to update ${req.body.name}.`
        res.redirect("/games")
    }
    
})
export default router 