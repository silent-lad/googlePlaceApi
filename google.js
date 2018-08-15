const C = require("./common");

let method, latLng;

let id = require("./id_vasant_kunj.json");
latLng = id[0].center.latLng;
method = "rankby=distance";
let cnt = 0;
let name = "vasantkunj";

var api_key = require("./api_key.json");

let worker = (method, latLng, next_page_token, resolve) => {
  // console.log(resolve);

  let request;
  if (next_page_token != null) {
    request = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${next_page_token}&key=${
      api_key.key
    }`;
  } else {
    request = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latLng}&${method}&key=${
      api_key.key
    }`;
  }

  C.req.get(request, (err, res, body) => {
    C.async.eachSeries(
      JSON.parse(body).results,
      (place, callback) => {
        if (C._.lowerCase(place.vicinity).indexOf("vasant kunj") != -1) {
          let id = require(`./id_vasant_kunj.json`);
          if (Object.keys(id[0]).indexOf(place.name) == -1) {
            console.log("new place");

            id[0][`${place.name}`] = {
              name: `${place.place_id}`,
              lat: `${place.geometry.location.lat}`,
              lng: `${place.geometry.location.lng}`,
              visited: false
            };
          }
          C.fs.writeFile(`./id_vasant_kunj.json`, JSON.stringify(id), () => {
            callback();
          });
        } else {
          // console.log("Not in vicinity");
          callback();
        }
      },
      () => {
        setTimeout(() => {
          if (JSON.parse(body).next_page_token) {
            // console.log("it has next page");
            worker(null, null, JSON.parse(body).next_page_token, resolve);
          } else {
            resolve();
          }
        }, 2000);
      }
    );
  });
};

let getPlaceId = (method, latLng, next_page_token) => {
  // console.log("I'M CALLED");

  return new Promise((resolve, reject) => {
    let request;
    if (next_page_token != null) {
      request = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${next_page_token}&key=${
        api_key.key
      }`;
    } else {
      request = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latLng}&${method}&key=${
        api_key.key
      }`;
    }

    C.req.get(request, (err, res, body) => {
      C.async.eachSeries(
        JSON.parse(body).results,
        (place, callback) => {
          // console.log(place.name);

          if (C._.lowerCase(place.vicinity).indexOf("vasant kunj") != -1) {
            let id = require(`./id_vasant_kunj.json`);
            if (Object.keys(id[0]).indexOf(place.name) == -1) {
              console.log("new place");
              id[0][`${place.name}`] = {
                name: `${place.place_id}`,
                lat: `${place.geometry.location.lat}`,
                lng: `${place.geometry.location.lng}`,
                visited: false
              };
            }
            C.fs.writeFile(`./id_vasant_kunj.json`, JSON.stringify(id), () => {
              callback();
            });
          } else {
            // console.log("Not in vicinity");
            callback();
          }
        },
        () => {
          setTimeout(() => {
            if (JSON.parse(body).next_page_token) {
              // console.log("it has next page");
              // getPlaceId(null, null, JSON.parse(body).next_page_token);

              worker(null, null, JSON.parse(body).next_page_token, resolve);
            }
            // console.log("HI");
            // resolve();
          }, 2000);
        }
      );
    });
  });
};

// var me = getPlaceId(method, latLng, null)
//   .catch(function() {
//     console.log("catch");
//   })
//   .then(function() {
//     console.log("Promise resolved");
//   });

// setInterval(() => {
//   console.log(me);
// }, 2000);

module.exports = getPlaceId;
