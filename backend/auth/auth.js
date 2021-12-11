const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

exports.login = async (req, res) => {
  const client = req.body;
  await User.findOne({ email: client.email }).then((user) => {
    console.log(client);
    if (user) {
      console.log(user);
      // check password
      bcrypt.compare(client.password, user.password, (error, result) => {
        if (error) {
          return res.status(401).json({
            message: "Auth failed",
            value: error,
          });
        }
        const token = jwt.sign({
            active_user: user.email,
            id: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        }, )
        res.status(200).json({
          message: "Auth Successful",
          token,
          ACK: result,
        });
      });
    }
  });
};
