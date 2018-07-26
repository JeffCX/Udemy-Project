const request = require("request");
const yargs = require("yargs");
const geocode = require("./geocode/geocode.js")

const argv = yargs.options({
	a:{
		demand:true,
		alias:"address",
		describe:"adreess to fetch weathter for",
		string:true
	}
}).help().alias('help',"h").argv;


const key = "9f12fe5fa04051ad520bca9d81a497ce"
console.log(argv.address)
geocode.geocodeAddress(argv.address,(erroMessage,result)=>{

	if(erroMessage){
		console.log(erroMessage)
	}else{
		const address_infos = JSON.parse(JSON.stringify(result,undefined,2))
		const latitude = address_infos.latitude.toString()
		const longitude = address_infos.longitude.toString()
		geocode.getWeather(key,latitude,longitude,(erroMessage,result)=>{
		if(erroMessage){
			console.log(erroMessage)
		}else{
			const data = JSON.parse(JSON.stringify(result,undefined,2))
			console.log(data)
		}
})

		
	}
})



// https://api.darksky.net/forecast/[key]/[latitude],[longitude]
//apikey: 9f12fe5fa04051ad520bca9d81a497ce