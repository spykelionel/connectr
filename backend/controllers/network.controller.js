const multer = require("multer");
const Network = require("../models/Network");

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, `./uploads`);
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "&" + file.originalname);
  },
});

const uploads = multer({ storage });

function findValidNetwork() {}

module.exports = {
  naiveWare: function (req, res, next) {
    next();
  },
  // make this property valid if Network credentials are valid and role? is valid
  upload: uploads.single("profileurl"),

  isValid: async (req, res, next) => {
    // bug, doesn't even read form data

    console.log(await req.body);
    Network?.exists({ email: req.body.email })
      .then((result) => {
        if (result) {
          console.log("Network exist");
          res.status(409).json({
            info: {
              message: "Network exists",
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
      const network = new Network({
        ...req.body,
        attachment: req?.file?.path ?? undefined,
      });
      await network
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
    await Network.find({})
      .lean()
      .then((result) => res.status(200).send(result))
      .catch((err) => res.status(503).send(err));
  },
  getImg: async (req, res, next) => {
    await Network.findOne({ profileurl: req.params.img })
      .lean()
      .then((result) => res.status(200).send(result))
      .catch((err) => res.status(503).send(err));
  },

  getOne: async (req, res) => {
    try {
      await Network.findOne({ _id: req.params.id })
        .lean()
        .then((result) => {
          if (result) {
            return res.status(200).json({ ...result });
          }
          return res.status(404).json({
            message: "Network Not found",
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
        info: "Server Error. Error getting the Network path",
      });
    }
  },

  deleteOne: async (req, res) => {
    await Network.deleteOne({ _id: req.params.id })
      .then((result) => {
        if (result) {
          res.status(200).send(result);
        }
        res.status(404).json({
          message: "Network Not found",
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
    await Network.deleteMany({})
      .then((result) =>
        res.status(200).send({ ...result, info: "deleted all Networks" })
      )
      .catch((err) =>
        res.status(404).json({
          ...err,
          message: "Not found",
        })
      );
  },

  update: async (req, res) => {
    Network?.exists({ _id: req.params.id })
      .then(async (result) => {
        if (result) {
          try {
            await Network.updateOne(
              { _id: req.params.id },
              {
                $set: req.body,
              }
            )
              .then((result) =>
                res.status(201).send({
                  ...result,
                  info: "successfully updated Network",
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
