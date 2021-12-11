const multer = require("multer");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, `./uploads`);
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "_" + file.originalname);
  },
});

const uploads = multer({ storage });

function findValidUser() {}

module.exports = {
  naiveWare: function (req, res, next) {
    next();
  },
  // make this property valid if user credentials are valid and role? is valid
  upload: uploads.single("profileurl"),

  isValid: async (req, res, next) => {
    // bug, doesn't even read form data

    console.log(await req.body);
    User?.exists({ email: req.body.email })
      .then((result) => {
        if (result) {
          console.log("user exist");
          res.status(409).json({
            info: {
              message: "User exists",
            },
          });
        } else {
          console.log("moving to next mfunction");
          next();
        }
        // return result;
      })
      .catch((err) => console.log(err));
  },

  create: async (req, res) => {
    User?.exists({ email: req.body.email })
      .then(async (result) => {
        if (!result) {
          try {
            bcrypt.hash(req.body.password, 10, async (err, hash) => {
              if (err) {
                console.log(req.body);
                return res.status(500).json({
                  status: err.name,
                  message: err.message,
                });
              }
              const user = new User({
                ...req.body,
                password: hash,
                profileurl: req?.file?.path ?? "default_avatar_url",
              });
              await user
                .save()
                .then((result) => {
                  return res.status(201).send(result);
                })
                .catch((err) => {
                  return res.status(501).send(err);
                });
            });

            console.log({ ...req.body, password: "....0.A$..(3>." });
            console.log("File: ->", req?.file ?? "No file parsed");
          } catch (error) {
            console.log(error);
          }
        } else {
          res.status(409).json({
            message: "Resource Exist",
          });
        }
      })
      .catch((err) => console.error(err));
  },

  getAll: async (req, res, next) => {
    await User.find({})
      .lean()
      .select(
        "_id name email contact gender password profileurl isAdmin roleId"
      )
      .then((result) => res.status(200).send(result))
      .catch((err) => res.status(503).send(err));
  },
  getImg: async (req, res, next) => {
    await User.findOne({ profileurl: req.params.img })
      .lean()
      .then((result) => res.status(200).send(result))
      .catch((err) => res.status(503).send(err));
  },

  getOne: async (req, res) => {
    try {
      await User.findOne({ _id: req.params.id })
        .lean()
        .then((result) => {
          if (result) {
            return res.status(200).json({ ...result });
          }
          return res.status(404).json({
            message: "User Not found",
          });
        })
        .catch((err) => {
          return res.status(501).json({
            ...err,
            info: "Server Error",
          });
        });
    } catch (error) {
      new Error(error);
      res.status(501).json({
        ...error,
        info: "Server Error. Error getting the user",
      });
    }
  },

  deleteOne: async (req, res) => {
    await User.deleteOne({ _id: req.params.id })
      .then((result) => {
        if (result) {
          res.status(200).send(result);
        }
        res.status(404).json({
          message: "User Not found",
        });
      })
      .catch((err) =>
        res.status(501).json({
          ...err,
          message: "Not found",
        })
      );
  },

  deleteAll: async (req, res) => {
    await User.deleteMany({})
      .then((result) =>
        res.status(200).send({ ...result, info: "deleted all Users" })
      )
      .catch((err) =>
        res.status(404).json({
          ...err,
          message: "Not found",
        })
      );
  },

  update: async (req, res) => {
    User?.exists({ _id: req.params.id })
      .then(async (result) => {
        if (result) {
          try {
            await User.updateOne(
              { _id: req.params.id },
              {
                $set: req.body,
              }
            )
              .then((result) =>
                res.status(201).send({
                  ...result,
                  info: "successfully updated User",
                })
              )
              .catch((err) => res.status(409).send(err));
          } catch (error) {
            console.log(error);
          }
        } else {
          res.status(404).json({
            info: { message: "Resource Doesn't Exist", valid: false },
          });
        }
      })
      .catch((err) => console.error(err));
  },
  login: require("../auth/auth").login,
};
