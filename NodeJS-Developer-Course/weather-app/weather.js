const request = require("request")

const getWeather = (key,latitude,longitude) =>{
	request({
		  url: `https://api.darksky.net/forecast/${key}/${latitude},${longitude}`,
		  json: true
		}, (error, response, body) => {
		  if (error) {
		    callback('Unable to connect to Forecast.io server.');
		  } else if (response.statusCode === 400) {
		    callback('Unable to fetch weather.');
		  } else if (response.statusCode === 200) {
		    callback(undefined,{
		    	temparture:body.currently.temperature
		    });
		  }
		});
}


module.exports.getWeather= getWeather;