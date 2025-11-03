const isAdmin =  (req, res, next)=>{
    console.log(req.session.user)
    if(!req.session.user.isAdmin){
       return res.status(403).send("Forbidden, You do not have the permissions to access this resource")
    }
    next();
}

export default isAdmin;