const isAdmin =  (req, res, next)=>{
    console.log(req.session.user)
    if(!req.session.user.isAdmin){
        
       return res.render("error",
            {error: {
                message: "Forbidden! You do not have the permissions to access this resource", 
                status: 403
            }}
        )  
    }
    next();
}

export default isAdmin;