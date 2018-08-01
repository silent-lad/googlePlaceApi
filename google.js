const C = require("./common");

let method, latLng;

let id = require("./id_vasant_kunj.json");
latLng = id[0].center.latLng;
method = "rankby=distance";
let cnt = 0;
let name = "vasantkunj";

let getPlaceId = (method, latLng, next_page_token, name) => {
  let request;
  if (next_page_token != null) {
    request = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${next_page_token}&key=AIzaSyAmXKb4SbPsIq-pKNNTCm0lSGtJtYcVeaw`;
  } else {
    request = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latLng}&${method}&key=AIzaSyAmXKb4SbPsIq-pKNNTCm0lSGtJtYcVeaw`;
  }

  C.req.get(request, (err, res, body) => {
    // console.log(JSON.parse(body).next_page_token.slice(0,3), "nextPageToken");
    try {
      let locationList = JSON.parse(body).results;
      C.async.each(
        locationList,
        (place, callback) => {
          if (C._.lowerCase(place.vicinity).indexOf("vasant kunj") != -1) {
            let id = require(`./id_vasant_kunj.json`);

            id[0][`${place.name}`] = {
              name: `${place.place_id}`,
              lat: `${place.geometry.location.lat}`,
              lng: `${place.geometry.location.lng}`,
              visited: false
            };
            console.log("place inserted in object", place.name);

            C.fs.writeFile(`./id_vasant_kunj.json`, JSON.stringify(id), () => {
              console.log("Wriiten on file");
              callback();
            });
          } else {
            console.log("Not in vicinity");
            callback();
          }
        },
        () => {
          if (JSON.parse(body).next_page_token) {
            console.log("it has next page");
            getPlaceId(
              null,
              null,
              JSON.parse(body).next_page_token,
              "vasantkunj"
            );
          } else {
            console.log("Everything over");
            return;
          }
        }
      );
    } catch (e) {
      // let locationList = {};
      return;
    }
  });
};

// getPlaceId(method, latLng, null, name);
module.exports = getPlaceId;
