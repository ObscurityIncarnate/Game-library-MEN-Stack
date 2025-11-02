const passMessageToView = (req, res, next)=>{
    res.locals.message = "";
    next();
}

export default passMessageToView;