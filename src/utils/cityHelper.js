import { Duration } from 'luxon'
import { CountriesHelper } from './countryHelper'

export class CityHelper {
  static validateCityObject ({
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
  }

  static getCountryByCode (countryCode) {
    return CountriesHelper.getCountryNameByCode(countryCode.toUpperCase())
  }

  static formatUpdatedAt ({ updated, now }) {
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
}
