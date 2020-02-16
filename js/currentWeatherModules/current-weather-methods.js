import nodes from '../nodes.js';
import * as helpers from '../helpers.js';

/**
 * Sending JSON Request to OpenWeather API.
 * Getting JSON Object and sends to process function.
 * @param {string} searchType location of user.
 */
export function sendJSONRequestForCurrentWeather(searchType) {
  const url =`http://api.openweathermap.org/data/2.5/weather?` +
              searchType +
              `&units=metric&APPID=d1d6e0d5056d558cf959ec55246ea7cb`;

  helpers.sendJSONRequest(url, processJSONCurrentWeatherData);
}

/**
 * Sending XML Request to OpenWeather API. Getting JSON Object.
 * @param {string} searchType location of user.
 * @return {Promise} Success or failure of request.
 */
export async function sendXMLRequestForCurrentWeather(searchType) {
  const url = `http://api.openweathermap.org/data/2.5/weather?` +
               searchType +
               `&mode=xml&units=metric&APPID=d1d6e0d5056d558cf959ec55246ea7cb`;

  const response = await helpers.
      sendXMLRequest(url, processXMLCurrentWeatherData);
  return response;
}

/**
 * Unpacking values from data object and setting weather values.
 * @param {Object} dataObj Object of weather data(xml format).
 */
function processXMLCurrentWeatherData(dataObj) {
  if (dataObj.getElementsByTagName('current')[0]) {
    showCityAndCurrentWeatherInfo(dataObj);
    const otherCurrentWeatherInfo = collectOtherCurrentWeatherInfo(dataObj);

    helpers.setInfo(nodes.windNode, `${otherCurrentWeatherInfo.windType}, 
        ${otherCurrentWeatherInfo.windSpeed} m/s,
        ${otherCurrentWeatherInfo.windDirection} 
        (${otherCurrentWeatherInfo.windDegree})`);

    helpers.setInfo(nodes.pressureNode,
        `${otherCurrentWeatherInfo.pressureInfo} hpa`);

    helpers.setInfo(nodes.cloudsNode,
        `${otherCurrentWeatherInfo.cloudsInfo}`);

    helpers.setInfo(nodes.humidityNode,
        `${otherCurrentWeatherInfo.humidityInf}%`);

    helpers.setInfo(nodes.geoCoordsNode,
        `[${otherCurrentWeatherInfo.latInf}, 
          ${otherCurrentWeatherInfo.lonInf}]`);
  } else {
    hideWeatherBlock();
  }
}

/**
 * Sending data object to functions that are setting weather values.
 * @param {Object} dataObj Object of weather data(JSON Format).
 */
function processJSONCurrentWeatherData(dataObj) {
  setCurrentTime(dataObj);
  setCurrentWeatherSunTime(dataObj);
}

/**
 * Sets time of date.
 * @param {Object} dataObj Object of weather data.
 */
function setCurrentTime(dataObj) {
  const unixTime = Date.now();
  const timeZone = dataObj.timezone * 1000;
  const date = new Date((unixTime + timeZone));
  const dateStr = date.toUTCString();
  const dateArr = dateStr.split(' ');
  const hoursAndMinutes = dateArr[4].slice(0, -3);
  const month = dateArr[2];
  const day = dateArr[1];

  nodes.dateInfo.textContent = `${hoursAndMinutes} ${month} ${day}`;
}

/**
 * Sets sunset and sunrise time(hours and minutes).
 * @param {Object} dataObj Object of weather data.
 */
function setCurrentWeatherSunTime(dataObj) {
  const sunriseTime = dataObj.sys.sunrise;
  const sunsetTime = dataObj.sys.sunset;
  const timeZone = dataObj.timezone;
  const sunriseDate = new Date((timeZone + sunriseTime) * 1000);
  const sunsetDate = new Date((timeZone + sunsetTime) * 1000);
  const sunriseStr = sunriseDate.toUTCString();
  const sunsetStr = sunsetDate.toUTCString();
  const sunriseArr = sunriseStr.split(' ');
  const sunsetArr = sunsetStr.split(' ');
  const sunriseHoursAndMinutes = sunriseArr[4].slice(0, -3);
  const sunsetHoursAndMinutes = sunsetArr[4].slice(0, -3);

  nodes.sunriseNode.textContent = `${sunriseHoursAndMinutes}`;
  nodes.sunsetNode.textContent = `${sunsetHoursAndMinutes}`;
}

/**
 * Shows city information and current weather information.
 * @param {Object} dataObj Object of weather data.
 */
function showCityAndCurrentWeatherInfo(dataObj) {
  const xmlCityName = helpers.
      findXMLElementWithAttribute(dataObj, 'city', 'name');
  const xmlTempIcon = helpers.
      findXMLElementWithAttribute(dataObj, 'weather', 'icon');
  const xmlTempInfo = helpers.
      findXMLElementWithAttribute(dataObj, 'temperature', 'value');
  const xmlWeatherInfo = helpers.
      findXMLElementWithAttribute(dataObj, 'weather', 'value');

  nodes.cityInfo.textContent = `Weather in ${xmlCityName}`;
  nodes.tempIcon.src = 'http://openweathermap.org/img/wn/' + xmlTempIcon + '@2x.png';
  nodes.tempInfo.innerHTML = String(Math.floor(xmlTempInfo)) + '&#176;C';
  nodes.weatherInfo.innerHTML = xmlWeatherInfo;
}

/**
 * Collects simple weather values. For example: speed value, type of clouds.
 * @param {Object} dataObj Object of weather data.
 * @return {Object} otherCurrentWeatherInfo Object of collected data.
 */
function collectOtherCurrentWeatherInfo(dataObj) {
  const otherCurrentWeatherInfo = {
    windSpeed: helpers.
        findXMLElementWithAttribute(dataObj, 'speed', 'value'),
    windType: helpers.
        findXMLElementWithAttribute(dataObj, 'speed', 'name'),
    windDirection: helpers.
        findXMLElementWithAttribute(dataObj, 'direction', 'name'),
    windDegree: helpers.
        findXMLElementWithAttribute(dataObj, 'direction', 'value'),
    cloudsInfo: helpers.
        findXMLElementWithAttribute(dataObj, 'clouds', 'name'),
    pressureInfo: helpers.
        findXMLElementWithAttribute(dataObj, 'pressure', 'value'),
    humidityInf: helpers.
        findXMLElementWithAttribute(dataObj, 'humidity', 'value'),
    sunriseInf: helpers.
        findXMLElementWithAttribute(dataObj, 'sun', 'rise'),
    sunsetInf: helpers.
        findXMLElementWithAttribute(dataObj, 'sun', 'set'),
    lonInf: helpers.
        findXMLElementWithAttribute(dataObj, 'coord', 'lon'),
    latInf: helpers.
        findXMLElementWithAttribute(dataObj, 'coord', 'lat'),
  };
  return otherCurrentWeatherInfo;
}
