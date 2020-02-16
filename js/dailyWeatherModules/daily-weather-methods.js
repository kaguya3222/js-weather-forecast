import nodes from '../nodes.js';
import * as helpers from '../helpers.js';
import {dayWeatherBlockData} from '../html-components.js';

/**
 * Sending JSON Request to OpenWeather API. Getting JSON Object.
 * @param {string} searchType location of user.
 */
export function sendJSONRequestForDailyWeather(searchType) {
  const url = `http://api.openweathermap.org/data/2.5/forecast?` +
              searchType +
              `&units=metric&APPID=d1d6e0d5056d558cf959ec55246ea7cb`;

  helpers.sendJSONRequest(url, processJSONDailyWeatherData);
}


/**
 * Sending object with weather data to setting functions.
 * @param {Object} dataObj Weather Data Object.
 */
function processJSONDailyWeatherData(dataObj) {
  processDataForDailyWeatherWrapper(dataObj);
  setDailyTime(dataObj);
  setDailyWeatherValues(dataObj);
}

/**
 * Setting location time.
 * @param {Object} dataObj Weather Data Object.
 */
function setDailyTime(dataObj) {
  let daysInWeekCounter = 0;

  for (let i = 0; i < nodes.timeTexts.length; i++) {
    const timezone = dataObj.city.timezone;
    const weatherDate = new Date((dataObj.list[i].dt + timezone) * 1000);
    const weatherDateStr = weatherDate.toUTCString();
    const weatherDateArr = weatherDateStr.split(' ');
    const weatherHours = weatherDateArr[4].slice(0, -3);

    nodes.timeTexts[i].textContent = weatherHours;
  }

  for (let i = 0; i < nodes.dayWeatherTimeTitle.length; i++) {
    const weatherTimeTitleArr = dataObj.list[daysInWeekCounter].
        dt_txt.split(' ');
    const weatherTimeTitleStr = new Date(weatherTimeTitleArr[0]);
    const weatherDateTitle = weatherTimeTitleStr.toDateString();

    nodes.dayWeatherTimeTitle[i].textContent = weatherDateTitle;
    daysInWeekCounter += 8;
  }
}

/**
 * Setting weather values. Wind speed, for example.
 * @param {Object} dataObj Weather Data Object.
 */
function setDailyWeatherValues(dataObj) {
  for (let i = 0; i < nodes.dayWeatherIcon.length; i++) {
    const weatherIconId = dataObj.list[i].weather[0].icon;
    const weatherTemperatureValue = `${dataObj.list[i].main.temp}&#176;`;
    const weatherDescription = `${dataObj.list[i].main.temp}&#176;`;
    const weatherWindData = `${dataObj.list[i].wind.speed}, 
                             m/s clouds:${dataObj.list[i].clouds.all}%, 
                             ${dataObj.list[i].main.pressure}hpa`;

    nodes.dayWeatherIcon[i].src = 'http://openweathermap.org/img/wn/' +
                                       weatherIconId +
                                       '@2x.png';

    nodes.dayWeatherTempValueNode[i].innerHTML = weatherTemperatureValue;
    nodes.dayWeatherTempDescNode[i].innerHTML = weatherDescription;
    nodes.dayWeatherOtherInfo[i].textContent = weatherWindData;
  }
}

/**
 * Creates html blocks with weather data.
 * @param {Object} dataObj Weather Data Object.
 */
function processDataForDailyWeatherWrapper(dataObj) {
  let dailyWeatherBlockCounter = 0;
  let dateCounter = 0;
  const timezone = dataObj.city.timezone;

  blockLoop: for (let i = 0; i < nodes.dailyWeatherWrapper.length; i++) {
    nodes.dailyWeatherWrapper[i].innerHTML = '';
    dailyWeatherBlockCounter = 0;
    while (dailyWeatherBlockCounter !== 8 && dateCounter < 39) {
      let nextDayStr = '';
      const dateTime = dataObj.list[dateCounter].dt;
      const nextDateTime = dataObj.list[dateCounter + 1].dt;
      const currentDayDate = new Date((dateTime + timezone) * 1000);
      const nextDayDate = new Date((nextDateTime + timezone) * 1000);
      const currentDayDateStr = currentDayDate.toUTCString();
      const nextDayDateStr = nextDayDate.toUTCString();
      const currentDayStr = currentDayDateStr[5] + currentDayDateStr[6];

      if (dateCounter < dataObj.list.length) {
        nextDayStr = nextDayDateStr[5] + nextDayDateStr[6];
      }

      if (currentDayStr !== nextDayStr) {
        pushDailyWeatherWrapper(i);
        dateCounter++;
        continue blockLoop;
      }

      pushDailyWeatherWrapper(i);
      dailyWeatherBlockCounter++;
      dateCounter++;
    }
  }
}

/**
 * Adding new day block to weather wrapper block.
 * @param {number} index Number of day.
 */
function pushDailyWeatherWrapper(index) {
  nodes.dailyWeatherWrapper[index].innerHTML += dayWeatherBlockData;
}
