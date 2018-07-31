const C = require('./common');

let method,latLng;

let id = require("./id_vasant_kunj.json");
latLng = id[0].center.latLng;
method = "rankby=distance";
let cnt = 0;
let name = "vasantkunj";

let getPlaceId = (method, latLng, next_page_token, name)=>{
	let request
	if(next_page_token != null){
		request = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${next_page_token}&key=AIzaSyAmXKb4SbPsIq-pKNNTCm0lSGtJtYcVeaw`;
	} else {
		request = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latLng}&${method}&key=AIzaSyAmXKb4SbPsIq-pKNNTCm0lSGtJtYcVeaw`;
	}

	C.req.get(request,(err,res,body)=>{
		// console.log(JSON.parse(body).next_page_token.slice(0,3), "nextPageToken");
		C.async.each(JSON.parse(body).results,
			(place,callback)=>{
				if(C._.lowerCase(place.vicinity).indexOf("vasant kunj") != -1){
					let id = require(`./id_vasant_kunj.json`);
					
						id[0][`${place.name}`] = 
						{
                			name: `${place.place_id}`,
               				lat: `${place.geometry.location.lat}`,
                			lng: `${place.geometry.location.lng}`,
                			visited: false
              			};
              			console.log('place inserted in object',place.name);
					
					C.fs.writeFile(`./id_vasant_kunj.json`,JSON.stringify(id),()=>{
						console.log("Wriiten on file");
						callback();
					})
				} else{
					console.log("Not in vicinity");
					callback();
				}
			},()=>{
				if(JSON.parse(body).next_page_token){
					console.log("it has next page");
					getPlaceId(
                		null,
               			null,
                		JSON.parse(body).next_page_token,
                		"vasantkunj"
              		);
				}else{
					console.log("Everything over");
					return;
				}
			})
	})
};

getPlaceId(method, latLng, null, name);
// getPlaceId(null,null,"CvQD4wEAAITiCLi9hphAc6tXl4gpI8ySq2cfVV6_yFW7QlrksDJcA9rgZ7LyuKPwbT0xOjzrKNjM4DPS25YKaNwwZGAREos29zXms16KQVUC0OkRlC4fJxBTFT8z5bVRFnwFIuKZ3N6W-eg8q_3fe1_1PHVId6m-R2Stj5GoQp9eB3lVUF8fg8WwL6DIHHwlG9dTgHzuBWLNn6EP91ZpUsHsOMzNLXlnY_mblcIPazHgyJydG9weUBc-J569yl_jdMwKv9jW-1X-J73xcfYOlzqt5or1iLiulNnQvGBtHb4EpKj1K7weE5GeENCFRDR6Du3AVja8LOyKIQG6ahdvj1OtNqYuXCgRYcPLAD4QeLRkiEPu0lTe9dxxkb8g98IAZf0irHPIC52MuqYx2xI4eZuArB_O3KZIwPLJ8AM3zlnNLTI2wo6Ah-pAOdf0i3AEd2zKMH0K0TCZQKY0i33xtUBraOYgKCZYSav_vdamVHTfvBEgvEBqQaDrg3yOpfLq2gNGoPxI2AA0_7hnkGjU5SONfTpyjT_zByxz4lYkmK9cQwW7QG7lAmbqTRNbQBy5OAoZ2hzSjEJVGynw9kA3JILDYdJ0diJ2c-1EbvuR1ckeVLDIbTAuSSqai5BxiqXI_of430Ud_U7XVJiI6rrhMr1GiO2Chi8SELR4M8OrHYpx61bwqBIRNx8aFOZ1qEWPD674HdxH6ueQ6A8031IX","vasantkunj")
