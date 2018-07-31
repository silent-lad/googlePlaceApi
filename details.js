const C = require("./common.js");

let seed = require("./id/id_vasantkunj.json");

let placeIdArr = Object.keys(seed[0]);
let details = require(`./details/vasantkunj_details.json`);

// console.log(placeIdArr);
let cnt = 0;

C.async.eachOf(seed[0], (id, key) => {
  let URL = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${
    id.name
  }&key=AIzaSyCi1-aFgFjvtCVDCveIzygv8iMHjgxAFlQ`;
  cnt++;
  setTimeout(() => {
    {
      C.req.get(URL, (err, res, body) => {
        // console.log(body);
        try {
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
            plus_code_compound:
              typeof finalBody.result.plus_code === "undefined"
                ? ""
                : finalBody.result.plus_code.compound_code,
            plus_code_global:
              typeof finalBody.result.plus_code === "undefined"
                ? ""
                : finalBody.result.plus_code.global_code,
            website:
              typeof finalBody.result.website === "undefined"
                ? ""
                : finalBody.result.website,
            phone_no:
              typeof finalBody.result.formatted_phone_number === "undefined"
                ? ""
                : finalBody.result.formatted_phone_number,
            no_of_reviews:
              typeof finalBody.result.reviews === "undefined"
                ? 0
                : finalBody.result.reviews.length,
            rating:
              typeof finalBody.result.rating === "undefined"
                ? 0
                : finalBody.result.rating
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
          //   console.log(id);
        }
        // finalBody = JSON.parse(body);

        // console.log(finalBody.adr_address);
        // console.log(finalBody.name);
        // console.log(JSON.parse(body));
      });
    }
  }, cnt * 100);
});
