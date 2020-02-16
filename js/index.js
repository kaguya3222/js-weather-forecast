import * as helpers from './helpers.js';
import * as currentWeather
  from './currentWeatherModules/current-weather-methods.js';
import * as dailyWeather from './dailyWeatherModules/daily-weather-methods.js';
import nodes from './nodes.js';

main();

/**
 * Gets location of user.
 * @param {Function} callback Function that starts when location.
 */
function main() {
  findWeatherByLocation();
  findWeatherByCity();
}

/**
 * Sets click event by click 'Check my location' Button.
 * After clicking, sending location to request functions.
 * @param {Function} callback Function that starts when location.
 */
function findWeatherByLocation() {
  let location = '';
  let response;
  nodes.checkLocationButton.addEventListener('click', () => {
    helpers.getLocation(async function callback(lat, lon) {
      location = `lat=${lat}&lon=${lon}`;
      response = await currentWeather.sendXMLRequestForCurrentWeather(location);
      if (response === true) {
        helpers.showWeatherBlock();
        sendJSONRequests(location);
      } else {
        helpers.hideWeatherBlock();
      }
    });
  });
}

/**
 * After sending form, sending city name to request functions.
 * @param {Object} dataObj Weather Data Object.
 */
function findWeatherByCity() {
  let location = '';
  nodes.mainForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    location = `q=${nodes.cityField.value}`;
    const response = await currentWeather.
    sendXMLRequestForCurrentWeather(location);
    if (response === true) {
      helpers.showWeatherBlock();
      sendJSONRequests(location);
    } else {
      helpers.hideWeatherBlock();
    }
    return false;
  });
}

/**
 * Sends JSON requests with given location.
 * @param {String} location Location of user.
 */
function sendJSONRequests(location) {
  currentWeather.sendJSONRequestForCurrentWeather(location);
  dailyWeather.sendJSONRequestForDailyWeather(location);
}

