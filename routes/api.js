var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const {view_Users, user_Sign_Up, view_User, update_User, delete_User} = require("../controllers/userController");
const {createComment, showOneComment, deleteComment, showAllComments, updateComment} = require("../controllers/commentController");
const {createAuthor, editAuthor, deleteAuthor, viewAuthor} = require("../controllers/authorController");
const {deletePost, editPost, getPost, getPosts, createPost} = require("../controllers/postController");
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
// //USER ROUTES
router.post("/user-login", passport.authenticate("user-local", {session : false}), (req, res)=>{
  const user = req.user;
  const token = jwt.sign({id : user.id, username : user.username, exp : Math.floor(Date.now()/1000) + (60*60*6)}, process.env.JWT_SECRET);
  return res.json({token, user});
});

router.get('/view-users', view_Users);

router.get('/view-user', authMiddleWare, view_User);

router.post('/update-user', authMiddleWare, update_User);

router.post('/delete-user', authMiddleWare, delete_User);

router.post('/user-sign-up', user_Sign_Up);

router.post("/user-logout", authMiddleWare, (req,res)=>{
  req.logout((err)=>{
    if(err){
      res.json({"message" : "Failed to Logout"})
    }
    res.status(200).json({"message" : "Logged Out successfully"})
  })
})

//COMMENT ROUTES
router.post("/create-comment", authMiddleWare, createComment);

router.get("/view-comment", showOneComment);

router.post("/delete-comment", authMiddleWare, deleteComment);

router.get("/view-comments", showAllComments);

router.post("/update-comment", authMiddleWare, updateComment);

//AUTHOR ROUTES
router.post("/login-author", passport.authenticate("author-local", {session : false}), (req, res)=>{
  const author = req.user;
  const token = jwt.sign({id : author.id, username : author.username}, process.env.JWT_SECRET);
  return res.json({token});
})

router.post("/register-author", createAuthor);

router.get("/view-author",authMiddleWare, viewAuthor);

router.post("/update-author/:id", authMiddleWare, editAuthor);

router.post("/delete-author/:id", authMiddleWare, deleteAuthor);

//POST ROUTES
router.get("/view-posts", getPosts);

router.get("/view-post/:id", getPost);

router.post("/create-post", authMiddleWare, createPost);

router.post("/edit-post/:id", authMiddleWare, editPost);

router.post("/delete-post/:id", authMiddleWare, deletePost);

module.exports = router;
