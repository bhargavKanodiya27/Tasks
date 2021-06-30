const express = require('express');
const users = require('../Models/user');
var router = express.Router();
const {
  addUser,
  updateUser,
  deleteUser,
  getUser,
  userLogin,
  userSocialLogin,
  userSocialSignUp,
  searchUser,
} = require('../controller/user_controller');
const showError = require('../controller/Error');

router.post('/login', userLogin); //normal login with email and password
router.post('/sociallogin', userSocialLogin); //social login  via facebook google
router.post('/socialsignup', userSocialSignUp); //social signup via facebook google
router.post('/addUser', addUser); //inserting new user in the database
router.post('/updateUser', updateUser); // updating values of user in database
router.post('/deleteUser', deleteUser); //deleting user's instance from database
router.get('/getUser/:sort', getUser); //fatch all users data from database by order
router.get('/search/:name', searchUser); //search any user by his/her name
router.get('*', showError);
module.exports = router;
