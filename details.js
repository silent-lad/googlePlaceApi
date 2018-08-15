const C = require("./common.js");

let seed = require("./id_vasant_kunj.json");

let placeIdArr = Object.keys(seed[0]);
let details = require(`./details/vasantkunj_details.json`);

var api_key = require("./api_key.json");

// console.log(placeIdArr);
let cnt = 0;

var check = data => {
  return typeof data === "undefined" ? " " : data;
};

C.async.eachOf(seed[0], (id, key) => {
  let URL = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${
    id.name
  }&key=${api_key.key}`;
  cnt++;
  setTimeout(() => {
    {
      C.req.get(URL, (err, res, body) => {
        // console.log(body);
        try {
          console.log("done");

          var sublocal3, sublocal2, postal;
          finalBody = JSON.parse(body);
          finalBody.result.address_components.forEach(comp => {
            if (comp.types.indexOf("sublocality_level_3") != -1) {
              sublocal3 = comp.long_name;
            } else if (comp.types.indexOf("sublocality_level_2") != -1) {
              sublocal2 = comp.long_name;
            } else if (comp.types.indexOf("postal_code") != -1) {
              postal = comp.long_name;
            }
          });
          //   console.log(finalBody.result.id);
          details[`${finalBody.result.name}`] = {
            cnt,
            placeId: finalBody.result.place_id,
            address: finalBody.result.formatted_address,
            sublocal2,
            sublocal3,
            postal,
            // addressComponent: finalBody.result.address_components,
            lat: finalBody.result.geometry.location.lat,
            lng: finalBody.result.geometry.location.lng,
            type: finalBody.result.types[0],
            plus_code_compound:
              typeof finalBody.result.plus_code === "undefined"
                ? ""
                : finalBody.result.plus_code.compound_code,
            plus_code_global:
              typeof finalBody.result.plus_code === "undefined"
                ? ""
                : finalBody.result.plus_code.global_code,
            website: check(finalBody.result.website),
            phone_no: check(finalBody.result.formatted_phone_number),
            no_of_reviews:
              typeof finalBody.result.reviews === "undefined"
                ? ""
                : finalBody.result.reviews.length,
            rating: check(finalBody.result.rating)
          };
          C.fs.writeFile(
            `./details/vasantkunj_details.json`,
            JSON.stringify(details),
            () => {
              console.log("Done 1");
            }
          );
        } catch (e) {
          console.log(e);
        }
      });
    }
  }, cnt * 100);
});
