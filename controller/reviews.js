import express from "express";
import isAdmin from "../middleware/is_admin.js";
import isSignedIn from "../middleware/is_signed_in.js";
import Games from "../models/games.js";


const router = express.Router({mergeParams: true});

const errorRoute = (res, error)=>{
    res.render("error",
            {error: {
                message: `${error.message}`, 
                status: error.code? error.code: 500
            }}
        )  
}

router.post("/create", isSignedIn, async (req,res) => {
    try {
        const gameId =  req.params.gameId;
        const game = await Games.findById(gameId);
        if(game){
            req.body.userId =  req.session.user._id
            game.reviews.push(req.body);
            await game.save();
            req.session.message = "Successfully added Review";
            res.redirect(`/games/${gameId}`)
        }else{
            throw new Error("Couldnt find the game you were looking for ")
        }
       console.log(req.body)    
    } catch (error) {
        // res.redirect("games/690a5169af9d7a690d71ca61/")
        // res.render("error",
        //     {error: {
        //         message: `${error.message}`, 
        //         status: 500
        //     }}
        // )   
        errorRoute(res, error)
    }
});
router.delete("/:reviewId", isSignedIn, async (req,res) => {
     try {
        const gameId =  req.params.gameId;
        const game = await Games.findById(gameId);
        if(game){
            const deleteReview = game.reviews.find((review)=> review._id == req.params.reviewId);
            console.log(deleteReview)
            if(deleteReview){
                console.log(deleteReview.userId.equals(req.session.user._id) )
                if(deleteReview.userId.equals(req.session.user._id)){
                    deleteReview.deleteOne()
                    await game.save();
                    req.session.message = "Successfully deleted Review";
                    res.redirect(`/games/${gameId}`);
                }else{
                    const err =  new Error("You are unauthorized to make this request");
                    err.code = 403;
                    throw err;
                }   
            }else{
                const err = Error("Couldnt find the review you were looking for");
                err.code = 404;
                throw err;
            }
        }else{
            const err = Error("Couldnt find the game you were looking for ");
            err.code = 404;
            throw err;
        } 
    } catch (error) {
         errorRoute(res, error);
    }
})
export default router;