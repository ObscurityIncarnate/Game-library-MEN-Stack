import express from "express";

const router =  express.Router();

router.get("/", (req,res)=>{
    res.render("profiles/index");
});
export default router 