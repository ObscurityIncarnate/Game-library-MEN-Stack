import express from "express";
import Games from "../models/games.js";
const router =  express.Router();

router.get("/", async(req,res)=>{
    try {
        const games  = await Games.find();
        res.render("games/index",{games});
    } catch (error) {
        
    }
    
});
router.get("/new", (req,res)=>{
    res.render("games/new");
});
router.get("/show/:gameId", async (req,res)=>{
    try {
        const gameId =  req.params.gameId;
        const game = await Games.findById(gameId);
        if(game){
            res.render("games/new");
        }else{
            throw new Error("Couldnt find the game you were looking for");
        }
        
    } catch (error) {
        res.status(404).send("Couldnt find the game you were looking for");   
    }
    
});

router.post("/", async(req,res)=> {
    console.log(req.body);
    try {
        req.body.reviews = [];
        await Games.create(req.body);
        res.redirect("/games");
        res.locals.message(`${req.body.name} has been successfully created`)
    } catch (error) {
        res.render("/games/new",{error: error.message})   
    }
    

    
})
export default router 