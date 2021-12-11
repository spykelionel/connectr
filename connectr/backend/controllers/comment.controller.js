const multer = require("multer");
const Comment = require("../models/Comment");
const Post = require("../models/Post");

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, `./uploads`);
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "&" + file.originalname);
  },
});

const uploads = multer({ storage });

function findValidComment() {}

module.exports = {
  naiveWare: function (req, res, next) {
    next();
  },
  // make this property valid if Comment credentials are valid and role? is valid
  upload: uploads.single("attachment"),

  isValid: async (req, res, next) => {
    // bug, doesn't even read form data

    console.log(await req.body);
    Comment?.exists({ email: req.body.email })
      .then((result) => {
        if (result) {
          console.log("Comment exist");
          res.status(409).json({
            info: {
              message: "Comment exists",
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
    Post?.exists({ _id: req.body.post })
      .then(async (result) => {
        if (!result) {
          try {
            const comment = new Comment({
                ...req.body,
                attachment: req?.file?.path ?? 'none',
            });
            await comment
                .save()
                .then((result) => { return res.status(201).send(result); })
                .catch((err) => { return res.status(501).send(err); });
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
    await Comment.find({})
      .lean()
      .then((result) => res.status(200).send(result))
      .catch((err) => res.status(503).send(err));
  },
  getImg: async (req, res, next) => {
    await Comment.findOne({ profileurl: req.params.img })
      .lean()
      .then((result) => res.status(200).send(result))
      .catch((err) => res.status(503).send(err));
  },

  getOne: async (req, res) => {
    try {
      await Comment.findOne({ _id: req.params.id })
        .lean()
        .then((result) => {
          if (result) {
            return res.status(200).json({ ...result });
          }
          return res.status(404).json({
            message: "Comment Not found",
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
        info: "Server Error. Error getting the Comment",
      });
    }
  },

  deleteOne: async (req, res) => {
    await Comment.deleteOne({ _id: req.params.id })
      .then((result) => {
        if (result) {
          res.status(200).send(result);
        }
        res.status(404).json({
          message: "Comment Not found",
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
    await Comment.deleteMany({})
      .then((result) =>
        res.status(200).send({ ...result, info: "deleted all Comments" })
      )
      .catch((err) =>
        res.status(404).json({
          ...err,
          message: "Not found",
        })
      );
  },

  update: async (req, res) => {
    Comment?.exists({ _id: req.params.id })
      .then(async (result) => {
        if (result) {
          try {
            await Comment.updateOne(
              { _id: req.params.id },
              {
                $set: req.body,
              }
            )
              .then((result) =>
                res.status(201).send({
                  ...result,
                  info: "successfully updated Comment",
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
  //   login: require('../auth/auth').login
};
