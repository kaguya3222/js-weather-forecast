/**
 * This file provides variables with DOM nodes values.
 */


export default {
      mainForm: document.getElementsByClassName('search-bar')[0],
      cityField: document.getElementsByClassName('search-field')[0],
      cityInfo: document.getElementsByClassName('city-info')[0],
      cityError: document.getElementsByClassName('search-error')[0],
      currentWeather : document.getElementsByClassName('current-weather')[0],
      weatherInfo : document.getElementsByClassName('weather-info')[0],
      tempIcon : document.getElementsByClassName('temp-icon')[0],
      tempInfo : document.getElementsByClassName('temp-info')[0],
      dateInfo : document.getElementsByClassName('date-info')[0],
      windNode : document.getElementById('js-wind'),
      cloudsNode : document.getElementById('js-clouds'),
      pressureNode : document.getElementById('js-pressure'),
      humidityNode : document.getElementById('js-humidity'),
      sunriseNode : document.getElementById('js-sunrise'),
      sunsetNode : document.getElementById('js-sunset'),
      geoCoordsNode : document.getElementById('js-geo'),
      dailyWeatherNode : document.getElementsByClassName('day-weather-wrapper')[0],
      timeTexts : document.getElementsByClassName('time-text'),
      dayWeatherIcon : document.getElementsByClassName('day-temp-icon'),
      dayWeatherTimeTitle : document.getElementsByClassName('date-title'),
      dayWeatherTempValueNode : document.
      getElementsByClassName('three-hour-temp-value'),
      dayWeatherTempDescNode : document.
      getElementsByClassName('three-hour-temp-desc'),
      dayWeatherOtherInfo : document.
      getElementsByClassName('three-hour-other-info-values'),
      checkLocationButton : document.getElementById('js-getLocation'),
      dailyWeatherWrapper : document.
      getElementsByClassName('three-hour-wrapper')
}
