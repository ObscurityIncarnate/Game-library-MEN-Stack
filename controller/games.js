import express from "express";

const router =  express.Router();

router.get("/", (req,res)=>{
    res.render("games/index");
});
export default router 