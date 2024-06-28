var express = require('express');
var router = express.Router();
const {view_Users, user_Sign_Up, view_User, update_User, delete_User, login_User} = require("../controllers/userController");
const passport = require("passport");

/* GET home page. */
router.post("/user-login", passport.authenticate("local", {successRedirect : "/api/view-users", failureRedirect : "/api/view-user/6679ac99e93f9662bb87b1ad"}));

router.get('/view-users', view_Users);

router.post('/user-sign-up', user_Sign_Up);

router.post('/view-user/:id', view_User);

router.post('/update-user/:id', update_User);
router.post('/delete-user/:id', delete_User);

module.exports = router;
