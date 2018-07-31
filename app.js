const C = require("./common");
const retrieve = require("./google.js");

// var id = require("./id_vasatn_/kunj");

var place = "vasantkunj";
var seedLatLngURL = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${place}&region=in&key=AIzaSyATA5BmRaFHFIOR2_OYEo-AlkwK1RwmHek`;

// requiring seed latlng from searching by text search
var seedPromise = () => {
  return new Promise((resolve, reject) => {
    C.req.get(seedLatLngURL, (err, res, body) => {
      if (JSON.parse(body).results != undefined) {
        var lat = JSON.parse(body).results[0].geometry.location.lat;
        var lng = JSON.parse(body).results[0].geometry.location.lng;

        var seed = [{ center: { latLng: `${lat},${lng}` } }];
        C.fs.writeFile(`./id/id_${place}.json`, JSON.stringify(seed), err => {
          console.log(lat, lng);
          err ? reject(err) : resolve(place);
        });
      } else {
        // console.log(Object.keys(body));
      }
    });
  });
};

//Retrieves the new places by using existing place latLng as seed
var raider = () => {
  console.log("Raider started");

  C.async.forever(
    next => {
      console.log("gih");

      let id = require(`./id/id_${place}.json`);
      C.async.forEachOf(id[0], (newPlace, key) => {
        console.log(key);
        if (newPlace.visited == false) {
          var newLatLng = `${newPlace.lat},${newPlace.lng}`;
          var method = "rankby=distance";
          retrieve(method, newLatLng, null, place);
          console.log(id[0][`${key}`].visited);

          id[0][`${key}`].visited = true;

          console.log(id[0][`${key}`].visited);
        }
      });
      setTimeout(() => {
        C.fs.writeFile(`./id/id_${place}.json`, JSON.stringify(id), err => {
          if (err) {
            console.log(err);
          } else {
            console.log("HI!!!");
            next();
          }
        });
      }, 8000);
    },
    err => {}
  );
};

// Retrieves the first 60 places for our stack
seedPromise().then(place => {
  let id = require(`./id/id_${place}.json`);
  latLng = id[0].center.latLng;
  method = "rankby=distance";
  console.log(7);

  retrieve(method, latLng, null, place);
  console.log("DANCE");
  setTimeout(() => {
    raider();
  }, 8000);
});
