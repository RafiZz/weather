import { Duration } from 'luxon'
import { CountriesHelper } from '../utils/countryHelper'

export class City {
  constructor ({
    name,
    countryCode,
    weather,
    temp,
    humidity,
    updatedAtMillis
  }) {
    if ([name, countryCode, weather, temp, humidity, updatedAtMillis].includes(undefined)) {
      throw new Error('Invalid city data')
    }
    this.name = name
    this.countryCode = countryCode
    this.weather = weather
    this.temp = temp
    this.humidity = humidity
    this.updatedAtMillis = updatedAtMillis
  }

  get country () {
    return CountriesHelper.getCountryNameByCode(this.countryCode.toUpperCase())
  }

  static _formatUpdatedAt ({ updated, now }) {
    const sortedUnits = ['years', 'months', 'weeks', 'days', 'hours', 'minutes']
    const dur = Duration.fromMillis(now - updated)
    const durByUnits = dur.shiftTo(...sortedUnits).toObject()
    const greatestNonzeroUnit = sortedUnits.find(u => Math.floor(durByUnits[u]) !== 0)
    if (!greatestNonzeroUnit) {
      return 'now'
    }
    const value = Math.floor(durByUnits[greatestNonzeroUnit])
    return `${value} ${greatestNonzeroUnit} ago`
  }

  formatUpdatedAt (dateAtMillis) {
    return City._formatUpdatedAt({ updated: this.updatedAtMillis, now: dateAtMillis })
  }

  toObject () {
    return {
      name: this.name,
      countryCode: this.countryCode,
      weather: this.weather,
      temp: this.temp,
      humidity: this.humidity,
      updatedAtMillis: this.updatedAtMillis
    }
  }

  static fromObject (obj) {
    return new City(obj)
  }
}
