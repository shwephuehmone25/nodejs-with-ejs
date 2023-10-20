exports.getLoginPage = (req, res) =>{
    res.render("auth/login", { title: "Login"});
}

exports.postLoginPage = (req, res) =>{
 //res.setHeader("Set-Cookie", "isLogIn=true");
 res.session.isLogIn = true,
 res.redirect("/");
}

exports.logout = (req,res) => {
    req.session.destroy(_=>{
        res.redirect("/");
    })
}