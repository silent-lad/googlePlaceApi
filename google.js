const C = require("./common");

let method, latLng;
let seed = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latLng}&${method}&type=gym&key=AIzaSyAmXKb4SbPsIq-pKNNTCm0lSGtJtYcVeaw`;

// let id = require("./id_vasant_kunj.json");
// latLng = id[0].center.latLng;
// method = "rankby=distance";
// let cnt = 0;

let getPlaceId = (method, latLng, next_page_token, name) => {
  let request;
  if (next_page_token) {
    request = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${next_page_token}&key=AIzaSyAmXKb4SbPsIq-pKNNTCm0lSGtJtYcVeaw`;
  } else {
    request = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latLng}&${method}&type=gym&key=AIzaSyAmXKb4SbPsIq-pKNNTCm0lSGtJtYcVeaw`;
  }
  C.req.get(request, (err, res, body) => {
    if (body != undefined) {
      // JSON.parse(body);
      C.async.each(
        JSON.parse(res.body).results,
        (place, callback) => {
          // console.log(place);
          // console.log(key);
          // console.log(cnt++);
          if (
            C._
              .lowerCase(place.vicinity)
              .replace(" ", "")
              .indexOf(`vasantkunj`) != -1
          ) {
            let id = require(`./id/id_${name}.json`);
            if (id[0][`${place.name}`] == undefined) {
              id[0][`${place.name}`] = {
                name: `${place.place_id}`,
                lat: `${place.geometry.location.lat}`,
                lng: `${place.geometry.location.lng}`,
                visited: false
              };
            }
            C.fs.writeFile(`./id/id_${name}.json`, JSON.stringify(id), err => {
              if (err) {
                console.log(err);
              }
              callback();
            });
          } else {
            // console.log(Object.keys(id));
            callback();
          }
        },
        err => {
          if (err) {
            console.log(err);
          } else {
            console.log("nxt");
            if (JSON.parse(res.body).next_page_token) {
              setTimeout(() => {
                getPlaceId(
                  null,
                  null,
                  JSON.parse(res.body).next_page_token,
                  name
                );
              }, 2000);
            } else {
              return;
            }
          }
        }
      );
    } else {
      console.log(err);
    }
  });
};

// getPlaceId(method, latLng);

module.exports = getPlaceId;
