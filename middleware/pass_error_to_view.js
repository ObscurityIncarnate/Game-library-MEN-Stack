const passErrorToView = (req, res, next)=>{
     if(req.session.error){
        res.locals.error = req.session.error;
        req.session.error = null;
     }
    next();
}

export default passErrorToView;