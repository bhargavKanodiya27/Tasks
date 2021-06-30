require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('./../models/user');
const errorFunction = require('./errorFunction');
const { tokenVerification } = require('./jwtTokens');
const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.SECRET_KEY);

const authentication = async (req, res, next) => {
  const tokenEncrypted = req.cookies['access-token'];

  if (!tokenEncrypted)
    return res.status(401).json(errorFunction(true, 'Unauthorized'));
  try {
    const token = await cryptr.decrypt(tokenEncrypted);
    const decoded = await tokenVerification(token);
    const user = await User.findByPk(decoded.id);

    if (user === null)
      return res.status(403).json(errorFunction(true, 'User not Found'));
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json(errorFunction(true, 'Something Went Wrong', err));
  }
  next();
};

module.exports = authentication;
