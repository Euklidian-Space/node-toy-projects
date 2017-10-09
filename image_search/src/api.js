const GoogleImages = require('google-images');
const { API_KEY, search_id } = require("./config/keys");
const client = new GoogleImages(search_id, API_KEY);


function search(req) {
  return client.search(keywords)
    .then(images => {

    });
}

module.exports = {
  search
};