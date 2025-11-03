import express from "express";
import Games from "../models/games.js";
import isAdmin from "../middleware/is_admin.js";
import isSignedIn from "../middleware/is_signed_in.js";
isSignedIn
const router =  express.Router();

router.get("/", async(req,res)=>{
    try {
        const games  = await Games.find();
        res.render("games/index",{games});
    } catch (error) {
        
    }
    
});
router.post("/", isSignedIn, isAdmin, async(req,res)=> {
    console.log(req.body);
    try {
        req.body.gallery =req.body.gallery.split(",")
        req.body.reviews = [];
        await Games.create(req.body);
        res.redirect("/games");
        res.locals.message(`${req.body.name} has been successfully created`)
    } catch (error) {
        res.render("/games/new",{error: error.message})   
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
            res.render("games/show");
        }else{
            throw new Error("Couldnt find the game you were looking for");
        }
        
    } catch (error) {
        res.status(404).send("Couldnt find the game you were looking for");   
    }
    
});
router.get("/:gameId/delete", isSignedIn, isAdmin, async (req,res) => {
    try {
        const gameId =  req.params.gameId;
        const game =  await Games.findById(gameId);
        if(game){
            await Games.findByIdAndDelete(gameId);
            req.loc.message = `Successfully deleted ${gameId}`;
            res.render("/games", {})
        }else{
            throw new Error("Couldnt find the game you were looking for")
        }
    } catch (error) {
        
    }
})


export default router 