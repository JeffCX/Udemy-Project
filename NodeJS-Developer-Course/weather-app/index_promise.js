const request = require("request");
const yargs = require("yargs");
const axios = require("axios")
const geocode = require("./geocode/geocode.js")

const argv = yargs.options({
	a:{
		demand:true,
		alias:"address",
		describe:"adreess to fetch weathter for",
		string:true
	}
}).help().alias('help',"h").argv;

  var encodedAddress = encodeURIComponent(argv.address);
  var geocodeUrl =  `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`

//automatically get 
axios.get(geocodeUrl).then((response)=>{
	if(response.data.status =="ZERO_RESULTS"){
		throw new Error("fuck you")
	}
    
	var lat = response.data.results[0].geometry.location.lat
	var lng= response.data.results[0].geometry.location.lng
	var key= "9f12fe5fa04051ad520bca9d81a497ce"

	var weatherUrl = `https://api.darksky.net/forecast/${key}/${lat},${lng}`
	console.log(response.data.results[0].formatted_address)
	return axios.get(weatherUrl)
}).then((response)=>{
	var temperature = response.data.currently.temperature;
	var apprantTemperature = response.data.currently.apprantTemperature;
	console.log(`it is currently ${temperature}`)
}).catch((error)=>{
	if(error.code=="ENOTFOUND"){
		console.log("damn")
	}else{
		console.log(error.message)
	}
	
})

// https://api.darksky.net/forecast/[key]/[latitude],[longitude]
//apikey: 9f12fe5fa04051ad520bca9d81a497ce