const axios = require("axios");
const Dev = require("../models/Dev");
const parseStringAsArray = require("../utils/parseStringAsArray");

// index, show, store, update, destroy

module.exports = {
  async index(req, res) {
    const devs = await Dev.find();
    return res.json(devs);
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const apiRes = await axios.get(
        `https://api.github.com/users/${github_username}`
      );

      const { name = login, avatar_url, bio } = apiRes.data;

      const techsArray = parseStringAsArray(techs);

      const location = {
        type: "Point",
        coordinates: [longitude, latitude]
      };

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      });
    }
    return res.json(dev);
  },

  async update(req, res) {
    const { name, bio, avatar_url, latitude, longitude, techs } = req.body;
    const techsArray = parseStringAsArray(techs);
    const location = {
      type: "Point",
      coordinates: [longitude, latitude]
    };
    const dev = await Dev.findByIdAndUpdate(
      req.params.id,
      {
        name,
        bio,
        avatar_url,
        location,
        techs: techsArray
      },
      { new: true }
    );
    return res.json(dev);
  },

  async destroy(req, res) {
    await Dev.findOneAndRemove(req.params.id);
    return res.status(200).send();
  }
};
