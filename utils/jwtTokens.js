const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.SECRET_KEY;
const sevenDays = 7 * 24 * 60 * 60 * 1000;

const tokenGeneration = async (tokenQuery) => {
     try {
          const token = await jwt.sign(tokenQuery, secretKey, {
               expiresIn: sevenDays,
          });
          return token;
     } catch (error) {
          throw new Error(error);
     }
};

const tokenVerification = async (token) => {
     try {
          const data = await jwt.verify(token, secretKey);
          if (!data) {
               return undefined;
          } else {
               return data;
          }
     } catch (error) {
          throw new Error(error);
     }
};

module.exports = { tokenGeneration, tokenVerification };