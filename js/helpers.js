import nodes from './nodes.js';

/**
 * Finds a certain xml element with certain attributes.
 * @param {Object} xmlObj XML Object.
 * @param {String} tag XML tag.
 * @param {String} attr XML attribute.
 * @return {String} Atrribute value;
 */
export function findXMLElementWithAttribute(xmlObj, tag, attr) {
  return xmlObj.getElementsByTagName(tag)[0].getAttribute(attr);
}

/**
 * Sets textContent to certain node.
 * @param {Object} node DOM node.
 * @param {String} string value for textContent.
 */
export function setInfo(node, string) {
  node.textContent = string;
}

/**
 * Gets location of user.
 * @param {Function} callback Function that starts when location.
 */
export function getLocation(callback) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      callback(position.coords.latitude, position.coords.longitude);
    });
  }
}

/**
 * Sending JSON Request to OpenWeather API.
 * Getting JSON Object and sends to process function.
 * @param {string} url URL adress.
 * @param {Function} callback callback function.
 */
export async function sendJSONRequest(url, callback) {
  try {
    const response = await fetch(url);
    if (response.status === 404) {
      throw new Error('Error while sending json request');
    }
    const JSONResponse = await response.json();
    callback(JSONResponse);
  } catch (e) {
    console.error(e);
  }
}

/**
 * Sending XML Request to OpenWeather API.
 * Getting XML and sends to process function.
 * @param {string} url URL adress.
 * @param {Function} callback callback function.
 * @return {Promise} returns success or failure of request.
 */
export async function sendXMLRequest(url, callback) {
  try {
    const response = await fetch(url);
    if (response.status === 404) {
      throw new Error('Error while sending xml request');
    }
    const responseText = await response.text();
    const responseXML = await (new window.DOMParser()).
        parseFromString(responseText, 'text/xml');
    callback(responseXML);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

/**
 * Hides blocks of weather.
 * @param {string} searchType location of user.
 */
export function hideWeatherBlock() {
  nodes.currentWeather.style.display = 'none';
  nodes.dailyWeatherNode.style.display = 'none';
  nodes.cityError.style.display = 'block';
}


/**
 * Shows blocks of weather.
 * @param {string} searchType location of user.
 */
export function showWeatherBlock() {
  if (nodes.cityError.style.display === 'block' &&
  nodes.dailyWeatherNode.style.display === 'block') {
    nodes.cityError.style.display = 'none';
    nodes.dailyWeatherNode.style.display = 'none';
  }
  nodes.currentWeather.style.display = 'flex';
  nodes.dailyWeatherNode.style.display = 'block';
  nodes.cityError.style.display = 'none';
}
