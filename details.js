const C = require("./common.js");

let seed = require("./id/id_vasantkunj.json");

let placeIdArr = Object.keys(seed[0]);

// console.log(placeIdArr);

C.async.each(seed[0], id => {
  let URL = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${
    id.name
  }&key=AIzaSyCi1-aFgFjvtCVDCveIzygv8iMHjgxAFlQ`;

  C.req.get(URL, (err, res, body) => {
    finalBody = JSON.parse(body);
    console.log(finalBody.result.id);

    // console.log(finalBody.adr_address);
    // console.log(finalBody.name);
    // console.log(JSON.parse(body));
  });
});
