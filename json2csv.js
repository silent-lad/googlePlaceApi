var data = require("./details/vasantkunj_details.json");
const C = require("./common");
// console.log(data);

C.async.eachOf(Object.keys(data), item => {
  C.fs.appendFile(
    "./maincsv.csv",
    `"${item}","${data[`${item}`].placeId}","${data[`${item}`].address}","${
      data[`${item}`].sublocal2
    }","${data[`${item}`].sublocal3}","${data[`${item}`].postal}","${
      data[`${item}`].lat
    }","${data[`${item}`].lng}","${data[`${item}`].type}","${
      data[`${item}`].plus_code_compound
    }","${data[`${item}`].plus_code_global}","${data[`${item}`].website}","${
      data[`${item}`].phone_no
    }","${data[`${item}`].no_of_reviews}","${data[`${item}`].rating}"\n`,
    err => {
      console.log(err);
    }
  );
});

console.log(data[`${1588}`].placeId);
