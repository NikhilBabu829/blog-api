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
  const token = jwt.sign({id : user.id, username : user.username}, process.env.JWT_SECRET);
  return res.json({token});
});

router.get('/view-users', view_Users);

router.get('/view-user/:id', view_User);

router.post('/update-user/:id', authMiddleWare, update_User);

router.post('/delete-user/:id', authMiddleWare, delete_User);

router.post('/user-sign-up', user_Sign_Up);

//COMMENT ROUTES
router.post("/create-comment", authMiddleWare, createComment);

router.get("/view-comment/:id", showOneComment);

router.post("/delete-comment/:id", authMiddleWare, deleteComment);

router.get("/view-comments", showAllComments);

router.post("/update-comment/:id", authMiddleWare, updateComment);

//AUTHOR ROUTES

router.post("/login-author", passport.authenticate("author-local", {session : false}), (req, res)=>{
  const author = req.user;
  const token = jwt.sign({id : author.id, username : author.username}, process.env.JWT_SECRET);
  return res.json({token});
})

router.post("/register-author", createAuthor);

router.get("/view-author/:id", viewAuthor);

router.post("/update-author/:id", authMiddleWare, editAuthor);

router.post("/delete-author/:id", authMiddleWare, deleteAuthor);

//POST ROUTES
router.get("/view-posts", getPosts);

router.get("/view-post/:id", getPost);

router.post("/create-post", authMiddleWare, createPost);

router.post("/edit-post/:id", authMiddleWare, editPost);

router.post("/delete-post/:id", authMiddleWare, deletePost);

module.exports = router;
