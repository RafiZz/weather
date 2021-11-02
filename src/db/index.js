import { City } from '../types/city'

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
    return City.fromObject(JSON.parse(json))
  }

  async setLocationCity (city) {
    const json = JSON.stringify(city.toObject())
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
    return arr.map(City.fromObject)
  }

  async setCities (cities) {
    const arr = cities.map(c => c.toObject())
    const json = JSON.stringify(arr)
    localStorage.setItem(CitiesLocalStorageDB._citiesKey, json)
  }

  async setCity (city) {
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
