var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const {view_Users, user_Sign_Up, view_User, update_User, delete_User} = require("../controllers/userController");
const {createComment} = require("../controllers/commentController");
const passport = require("passport");

function authMiddleWare(req, res, next){
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(" ")[1];
  if(token == null) return res.sendStatus(401)
  jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
    if(err) return res.sendStatus(403)
    req.user = user;
    next();
  })
}

//USER ROUTES
router.post("/user-login", passport.authenticate("local", {session : false}), (req, res)=>{
  const user = req.user;
  const token = jwt.sign({id : user.id, username : user.username}, process.env.JWT_SECRET);
  return res.json({token});
});

router.get('/view-users', view_Users);

router.post('/view-user/:id', view_User);

router.post('/update-user/:id', update_User);

router.post('/delete-user/:id', delete_User);

router.post('/user-sign-up', user_Sign_Up);

//COMMENT ROUTES
router.post("/create-comment", authMiddleWare, createComment);

module.exports = router;
