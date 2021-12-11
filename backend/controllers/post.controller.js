const multer = require("multer");
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

function findValidPost() {}

module.exports = {
  naiveWare: function (req, res, next) {
    next();
  },
  // make this property valid if Post credentials are valid and role? is valid
  upload: uploads.single("attachment"),

  isValid: async (req, res, next) => {
    // bug, doesn't even read form data

    console.log(await req.body);
    Post?.exists({ email: req.body.email })
      .then((result) => {
        if (result) {
          console.log("Post exist");
          res.status(409).json({
            info: {
              message: "Post exists",
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
    try {
      const post = new Post({
        ...req.body,
        attachment: req?.file?.path ?? undefined,
      });
      await post
        .save()
        .then((result) => {
          return res.status(201).send(result);
        })
        .catch((err) => {
          return res.status(501).send(err);
        });
    } catch (error) {
      console.log(error);
      return res.status(501).send(error);
    }
  },

  getAll: async (req, res, next) => {
    await Post.find({})
      .lean()
      .then((result) => res.status(200).send(result))
      .catch((err) => res.status(503).send(err));
  },
  getImg: async (req, res, next) => {
    await Post.findOne({ profileurl: req.params.img })
      .lean()
      .then((result) => res.status(200).send(result))
      .catch((err) => res.status(503).send(err));
  },

  getOne: async (req, res) => {
    try {
      await Post.findOne({ _id: req.params.id })
        .lean()
        .then((result) => {
          if (result) {
            return res.status(200).json({ ...result });
          }
          return res.status(404).json({
            message: "Post Not found",
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
        info: "Server Error. Error getting the Post",
      });
    }
  },

  deleteOne: async (req, res) => {
    await Post.deleteOne({ _id: req.params.id })
      .then((result) => {
        if (result) {
          res.status(200).send(result);
        }
        res.status(404).json({
          message: "Post Not found",
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
    await Post.deleteMany({})
      .then((result) =>
        res.status(200).send({ ...result, info: "deleted all posts" })
      )
      .catch((err) =>
        res.status(404).json({
          ...err,
          message: "Not found",
        })
      );
  },

  update: async (req, res) => {
    Post?.exists({ _id: req.params.id })
      .then(async (result) => {
        if (result) {
          try {
            await Post.updateOne(
              { _id: req.params.id },
              {
                $set: req.body,
              }
            )
              .then((result) =>
                res.status(201).send({
                  ...result,
                  info: "successfully updated Post",
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
