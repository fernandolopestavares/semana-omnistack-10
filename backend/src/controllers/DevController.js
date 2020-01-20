const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');
// index, show, store, update, destroy

module.exports = {
  //listing devs
  async index(request, response) {
    const devs = await Dev.find();

    return response.json(devs);
  },

  //new form devs
  async store (request, response) {
    const { github_username, techs, latitude, longitude } = request.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
      const { name = login, avatar_url, bio} = apiResponse.data
      const techsArrays = parseStringAsArray(techs);
  
      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      }
      //trim remove espaco antes e depois dpisde uma string
      //console.log(name, avatar_url, bio, github_username);
      //console.log(apiResponse.data);
      //console.log(request.body);
  
      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArrays,
        location,
      })


      //filtrar as conexoes que estao ha no maximo 10km de distancia
      // e que o novo dev tenha pelo menos uma das tecnologias filtradas

      const sendSocketMessageTo = findConnections(
          { latitude, longitude},
          techsArrays,
        )

        sendMessage(sendSocketMessageTo, 'new-dev', dev);
    }
    return response.json(dev);
  },

  //method update
  async update(request, response) {
    const { id } = request.params;
    const data = request.body;

    if (data.techs) {
      data.techs = parseStringAsArray(data.techs);
    }

    const dev = await Dev.findByIdAndUpdate(id, data, { new: true });

    return response.json(dev);
  },

  //method delete
  async destroy(request, response) {
    const { id } = request.params;

    await Dev.findByIdAndDelete(id);

    return response.json({ message: "user removed" });
  }

};
