const GoogleImages = require('google-images');
const { API_KEY, search_id } = require("./config/keys");
const client = new GoogleImages(search_id, API_KEY);


function search(req) {
  let { offset } = req.query;
  let { keywords } = req.params;
  return client.search(keywords)
    .then(images => {
      let n = images.length > offset ? offset : images.length;  
      return Promise.resolve(images.slice(0, n + 1));
    });
}

module.exports = {
  search
};