const { fetchEndpoints } = require("../models/api.models.js");

exports.getEndpoints = (req, res, next) => {
  fetchEndpoints().then((endpoints) => {
    res.status(200).send({ endpoints });
  })
  .catch((err) => {
      next(err);
  });
};
