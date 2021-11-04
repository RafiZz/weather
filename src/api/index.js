import axios from 'axios'
import { DateTime } from 'luxon'

class OpenWeatherMapAPI {
  static baseURL = 'http://api.openweathermap.org/data/2.5/weather'

  constructor (httpClient) {
    this.client = httpClient
  }

  static get _defaultParams () {
    return {
      units: 'metric',
      lang: 'en',
      APPID: process.env.VUE_APP_OWM_KEY
    }
  }

  static _normalizeResponseData (responseData) {
    return {
      name: responseData.name,
      countryCode: responseData.sys.country,
      weather: responseData.weather[0].main,
      temp: Math.round(responseData.main.temp),
      humidity: responseData.main.humidity,
      updatedAtMillis: DateTime.now().toMillis()
    }
  }

  _request (params) {
    return this.client.request(params)
  }

  _logError (err) {
    console.log(err)
  }

  async fetchWeatherByCityName (cityName) {
    const params = {
      ...OpenWeatherMapAPI._defaultParams,
      q: cityName
    }
    try {
      const response = await this._request({
        url: OpenWeatherMapAPI.baseURL,
        method: 'get',
        params
      })
      return OpenWeatherMapAPI._normalizeResponseData(response.data)
    } catch (e) {
      this._logError(e)
      throw e
    }
  }

  async fetchWeatherByCoords ({ lat, lon }) {
    const params = {
      ...OpenWeatherMapAPI._defaultParams,
      lat,
      lon
    }
    try {
      const response = await this._request({
        url: OpenWeatherMapAPI.baseURL,
        method: 'get',
        params
      })
      return OpenWeatherMapAPI._normalizeResponseData(response.data)
    } catch (e) {
      this._logError(e)
      throw e
    }
  }
}

export const api = new OpenWeatherMapAPI(axios.create())
