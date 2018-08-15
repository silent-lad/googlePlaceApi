const C = require("./common");
const retrieve = require("./google.js");

// var id = require("./id_vasatn_/kunj");

var key = require("./api_key.json");

var place = "vasantkunj";
var seedLatLngURL = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${place}&region=in&key=${
  key.key
}`;

// requiring seed latlng from searching by text search
var seedPromise = () => {
  return new Promise((resolve, reject) => {
    C.req.get(seedLatLngURL, (err, res, body) => {
      if (JSON.parse(body).results != undefined) {
        var lat = JSON.parse(body).results[0].geometry.location.lat;
        var lng = JSON.parse(body).results[0].geometry.location.lng;

        var seed = [{ center: { latLng: `${lat},${lng}` } }];
        C.fs.writeFile(`./id_vasant_kunj.json`, JSON.stringify(seed), err => {
          console.log(lat, lng);
          err ? reject(err) : resolve(place);
        });
      } else {
        // console.log(Object.keys(body));
      }
    });
  });
};

// async function retrieveSlow(method, newLatLng, newPlace) {
//   await retrieve(method, newLatLng, null);
//   newPlace.visited = true;
// }

var prevLatlng = ["28.5273352,77.1515453"];
//Retrieves the new places by using existing place latLng as seed
var raider = () => {
  console.log("Raider started");

  C.async.forever(next => {
    let id = require(`./id_vasant_kunj.json`);
    C.async.eachSeries(
      id[0],
      (newPlace, callback) => {
        if (newPlace.visited == false) {
          var lat = newPlace.lat;
          var lng = newPlace.lng;
          var newLatLng = `${lat.slice(0, 6)},${lng.slice(0, 6)}`;
          if (prevLatlng.indexOf(newLatLng) != -1) {
            console.log("SAME THA YAAR");
            newPlace.visited = true;
            callback();
          } else {
            prevLatlng.push(newLatLng);
            console.log(newLatLng);

            // console.log(newPlace);

            var method = "rankby=distance";
            console.log("calling retrieve");
            retrieve(method, newLatLng).then(() => {
              console.log("Promise Resolved");
              newPlace.visited = true;
              console.log("retrieved");
              callback();
            });
          }
        } else {
          console.log("visited");
          callback();
        }
      },
      err => {
        C.fs.writeFile(`./id_vasant_kunj.json`, JSON.stringify(id), err => {
          if (err) {
            console.log(err);
            next();
          } else {
            console.log("HI!!!");
            next();
          }
        });
      },
      err => {
        console.log(err);
      }
    );
  });
};

// Retrieves the first 60 places for our stack
// seedPromise().then(place => {
//   let id = require(`./id_vasant_kunj.json`);
//   latLng = id[0].center.latLng;
//   method = "rankby=prominence";
//   console.log(7);
//   console.log(method, latLng, null, place);

//   retrieve(method, latLng, null, place);
//   console.log("DANCE");
//   setTimeout(() => {
//     raider();
//   }, 8000);
// });

var list = require("./id_vasant_kunj.json");
// list.forEach(place => {});

C.async.eachSeries(list[0], place => {
  if (place.visited == true) {
    // console.log(typeof place.lat);
    var lat = place.lat;
    var lng = place.lng;

    prevLatlng.push(`${lat.slice(0, 6)},${lng.slice(0, 6)}`);
  }
});
// console.log(prevLatlng);
setTimeout(() => {
  console.log(prevLatlng);

  raider();
}, 2000);
// raider();
