var CryptoJS = require('crypto-js');
const dotenv = require('dotenv');
dotenv.config();
const Sequelize = require('sequelize');
const sequelize = require('./../connection');
const validator = require('./user_validator');
var auth = require('../middleware/auth');
const config = require('config');
const secret = process.env.SECRET;
const User = require('../Models/user');
const { imageUpload } = require('../../utils/imageupload');
const addUser = async (req, res, next) => {
  try {
    let email = req.body.email;
    let name = req.body.name;
    let age = req.body.age;
    let password = req.body.password;
    let profilePhoto = await imageUpload(req.body.profile_image, 'user');
    try {
      const val_check = await validator.validateAsync({
        email,
        name,
        age,
        password,
        profilePhoto,
      });
    } catch (err) {
      return res.send(err.details[0].message);
    }
    var check = await User.findOne({ email });
    if (check) {
      var error = {
        is_error: true,
        message: 'This User Already Exists.',
      };
      return res.status(500).send(error);
    } else {
      var user = User.create({ email, name, age, password });
      if (user) {
        var finaldata = {
          is_error: false,
          message: 'User Data created',
        };
        return res.status(200).send(finaldata);
      }
    }
  } catch (err) {
    if (err) {
      var error = {
        is_error: true,
        message: err.message,
      };
      return res.status(500).send(error);
    }
  }
};

const updateUser = async (req, res, next) => {
  try {
    let email = req.body.email;
    let name = req.body.name;
    let age = req.body.age;
    let password = req.body.password;
    let profilePhoto = await imageUpload(req.body.profile_image, 'user');
    try {
      const val_check = await validator.validateAsync({
        email,
        name,
        age,
        password,
      });
    } catch (err) {
      return res.send(err.details[0].message);
    }
    var check = await User.findOne({ email });
    if (check) {
      data.name = name;
      data.age = age;
      data.profilePhoto = profilePhoto;
      data.save();
      var finaldata = {
        is_error: false,
        message: 'User Data Updated',
      };
      return res.status(200).send(finaldata);
    } else {
      var user = User.create({ email, name, age, password, profilePhoto });
      var finaldata = {
        is_error: false,
        message: 'Existing data not found!  Created New Instance',
      };
      return res.status(200).send(finaldata);
    }
  } catch (err) {
    if (err) {
      var error = {
        is_error: true,
        message: err.message,
      };
      return res.status(500).send(error);
    }
  }
};
const deleteUser = async (req, res, next) => {
  try {
    let email = req.body.email;
    let password = req.body.password;
    try {
      const val_check = await validator.validateAsync({
        email,
        password,
      });
    } catch (err) {
      return res.send(err.details[0].message);
    }
    var check = await User.findOne({ email, password });
    if (check) {
      check.destroy();
      var finaldata = {
        is_error: false,
        message: 'User Data Deleted',
      };
      return res.status(200).send(finaldata);
    } else {
      var error = {
        is_error: true,
        message:
          'User not Found or you may not have access to delete this User',
      };
      return res.status(403).send(error);
    }
  } catch (err) {
    if (err) {
      var error = {
        is_error: true,
        message: err.message,
      };
      return res.status(500).send(error);
    }
  }
};
const getUser = async (req, res, next) => {
  try {
    var sortBy = req.params.sort;
    if (sortBy === 'name' || sortBy === 'age') {
      var check = await User.findAll({ order: [sortBy, 'ASC'] });
      if (check) {
        var finaldata = {
          data: check,
          is_error: false,
          message: 'User Data Fetched',
        };
        return res.status(200).send(finaldata);
      }
    } else {
      var error = {
        is_error: true,
        message: 'Enter valid parameter to sort...!',
      };
      return res.status(500).send(error);
    }
  } catch (err) {
    if (err) {
      var error = {
        is_error: true,
        message: err.message,
      };
      return res.status(500).send(error);
    }
  }
};
const searchUser = async (req, res, next) => {
  try {
    let name = req.params.name;
    var users = await User.findAll({ name });
    if (users) {
      var sendData = {
        data: users,
        is_error: false,
      };
      return rea.status(200).send(sendData);
    } else if (users.length === 0 || users === null) {
      var sendData = {
        message: 'no data found',
        is_error: false,
      };
      return rea.status(404).send(sendData);
    }
  } catch (err) {
    if (err) {
      var error = {
        is_error: true,
        message: err.message,
      };
      return res.status(500).send(error);
    }
  }
};
const userLogin = async (req, res, next) => {
  try {
    let email = req.body.email;
    let password = req.body.password;
    try {
      const val_check = await validator.validateAsync({ email, password });
    } catch (err) {
      return res.send(err.details[0].message);
    }
    var user = await User.findOne({ email, password });
    if (user) {
      var ciphertext = CryptoJS.AES.encrypt(
        JSON.stringify(token),
        secret
      ).toString();
      var senddata = {
        message: 'User Logged in successfully',
        token: ciphertext,
        data: user,
        is_error: false,
      };
      return res.status(202).send(senddata);
    } else {
      var error = {
        message: 'wrong email or password please check and try again',
        is_error: true,
      };
      return res.status(404).send(error);
    }
  } catch (err) {
    if (err) {
      var error = {
        is_error: true,
        message: err.message,
      };
      return res.status(500).send(error);
    }
  }
};
const userSocialLogin = async (req, res, next) => {
  try {
    let email = req.body.email;
    let socialId = req.body.socialId;
    try {
      const val_check = await validator.validateAsync({ email });
    } catch (err) {
      return res.send(err.details[0].message);
    }
    var user = await User.findOne({ email, socialId });
    if (user) {
      var ciphertext = CryptoJS.AES.encrypt(
        JSON.stringify(token),
        secret
      ).toString();
      var senddata = {
        message: 'User Logged in successfully',
        token: ciphertext,
        data: user,
        is_error: false,
      };
      return res.status(202).send(senddata);
    } else {
      var error = {
        message: "user doesn't exist or something went wrong please try again",
        is_error: true,
      };
      return res.status(404).send(error);
    }
  } catch (err) {
    if (err) {
      var error = {
        is_error: true,
        message: err.message,
      };
      return res.status(500).send(error);
    }
  }
};
const userSocialSignUp = async (req, res, next) => {
  try {
    let email = req.body.email;
    let socialId = req.body.socialId;
    try {
      const val_check = await validator.validateAsync({ email });
    } catch (err) {
      return res.send(err.details[0].message);
    }
    var check = await User.findOne({ $or: [{ email }, { socialId }] });
    if (check) {
      var error = {
        is_error: true,
        message: 'This User Already Exists.',
      };
      return res.status(500).send(error);
    } else {
      var user = User.create({ email, name, age, password, socialId });
      if (user) {
        var finaldata = {
          is_error: false,
          message: 'User Data created',
        };
        return res.status(201).send(finaldata);
      }
    }
  } catch (err) {
    if (err) {
      var error = {
        is_error: true,
        message: err.message,
      };
      return res.status(500).send(error);
    }
  }
};
module.exports = {
  addUser,
  updateUser,
  deleteUser,
  getUser,
  userLogin,
  userSocialLogin,
  userSocialSignUp,
  searchUser,
};
