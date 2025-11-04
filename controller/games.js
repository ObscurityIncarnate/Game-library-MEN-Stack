import express from "express";
import Games from "../models/games.js";
import isAdmin from "../middleware/is_admin.js";
import isSignedIn from "../middleware/is_signed_in.js";

const router =  express.Router();

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
router.post("/", isSignedIn, isAdmin, async(req,res)=> {
    console.log(req.body);
    try {
        req.body.gallery =req.body.gallery.split(",")
        console.log(req.body.gallery);
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