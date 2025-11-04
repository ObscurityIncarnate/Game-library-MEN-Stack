const passErrorToView = (req, res, next)=>{
        res.locals.error = req.session.error;
        req.session.error = null;
    next();
}

export default passErrorToView;