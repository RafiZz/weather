import { CityHelper } from '../utils/cityHelper'

class CitiesLocalStorageDB {
  static _locationCityKey = 'locationCity'
  static _citiesKey = 'cities'

  async initialize () {
    return Promise.resolve()
  }

  async getLocationCity () {
    const json = localStorage.getItem(CitiesLocalStorageDB._locationCityKey)
    if (!json) {
      return null
    }
    const data = JSON.parse(json)
    CityHelper.validateCityObject(data)
    return data
  }

  async setLocationCity (city) {
    CityHelper.validateCityObject(city)
    const json = JSON.stringify(city)
    localStorage.setItem(CitiesLocalStorageDB._locationCityKey, json)
  }

  async deleteLocationCity () {
    localStorage.removeItem(CitiesLocalStorageDB._locationCityKey)
  }

  async getCities () {
    const json = localStorage.getItem(CitiesLocalStorageDB._citiesKey)
    if (!json) {
      return []
    }
    const arr = JSON.parse(json)
    arr.forEach(c => CityHelper.validateCityObject(c))
    return arr
  }

  async setCities (cities) {
    cities.forEach(c => CityHelper.validateCityObject(c))
    const json = JSON.stringify(cities)
    localStorage.setItem(CitiesLocalStorageDB._citiesKey, json)
  }

  async setCity (city) {
    CityHelper.validateCityObject(city)
    const cities = await this.getCities()
    const cityIndex = cities.findIndex(c => c.name === city.name)
    if (cityIndex) {
      cities[cityIndex] = city
    } else {
      cities.push(city)
    }
    this.setCities(cities)
  }

  async deleteCity (city) {
    const cities = await this.getCities()
    await this.setCities(cities.filter(c => c.name !== city.name))
  }
}

export const db = new CitiesLocalStorageDB()
