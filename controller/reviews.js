import express from "express";
import isAdmin from "../middleware/is_admin.js";
import isSignedIn from "../middleware/is_signed_in.js";
import Games from "../models/games.js";


const router = express.Router({mergeParams: true});
router.get("/", (req,res)=>{
    console.log("here")
})
router.post("/create", isSignedIn, async (req,res) => {
    try {
        const gameId =  req.params.gameId;
        const game = await Games.findById(gameId);
        if(game){
            req.body.userId =  req.session.user._id
            game.reviews.push(req.body);
            game.save(res.redirect(`/games/${gameId}`))
        }else{
            throw new Error("Couldnt find the game you were looking for ")
        }
       console.log(req.body)    
    } catch (error) {
        // res.redirect("games/690a5169af9d7a690d71ca61/")
        res.render("error",
            {error: {
                message: `${error.message}`, 
                status: 500
            }}
        )   
    }
});
router.delete("/:reviewId", isSignedIn, async (req,res) => {
     try {
        console.log("here")
        const gameId =  req.params.gameId;
        const game = await Games.findById(gameId);
        if(game){
            const deleteIndex = game.reviews.findIndex((review)=> review._id == req.params.reviewId);
            if(deleteIndex){
                const review = game.reviews[deleteIndex];
                console.log(review)
            }else{
                throw new Error("Couldnt find the review you were looking for")
            }
            
        }else{
            throw new Error("Couldnt find the game you were looking for ")
        } 
    } catch (error) {
        // res.redirect("games/690a5169af9d7a690d71ca61/")
        res.render("error",
            {error: {
                message: `${error.message}`, 
                status: 500
            }}
        )   
    }
})
export default router;