export class LocationHelper {
  static async getLocationCoords () {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by this browser.')
    }
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          })
        },
        (error) => {
          let msg
          switch (error.code) {
            case error.PERMISSION_DENIED:
              msg = 'User denied the request for Geolocation.'
              break
            case error.POSITION_UNAVAILABLE:
              msg = 'Location information is unavailable.'
              break
            case error.TIMEOUT:
              msg = 'The request to get user location timed out.'
              break
            case error.UNKNOWN_ERROR:
              msg = 'An unknown error occurred.'
              break
          }
          reject(new Error(msg))
        }
      )
    })
  }
}
