import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'

countries.registerLocale(enLocale)

export class CountriesHelper {
  static getCountryNameByCode (countryCode, lang = 'en') {
    return countries.getName(countryCode, lang)
  }
}
