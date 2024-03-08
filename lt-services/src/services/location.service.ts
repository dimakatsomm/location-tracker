import { Service } from 'typedi';
import NodeGeocoder from 'node-geocoder';
import { ICoordinates, IFormattedCoordinates } from 'interfaces/location.interface';
import { Location } from 'database/models/location.model';

const options = {
  provider: 'google',

  // Optional depending on the providers
  fetch: '',
  apiKey: 'YOUR_API_KEY', // for Mapquest, OpenCage, APlace, Google Premier
  formatter: null, // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

@Service()
export class LocationService {
  private async reverseGeocode(coordinates: ICoordinates) {
    const location = await geocoder.reverse(coordinates);

    if (!location?.length) {
      throw new Error(`No location has been found with coordinates, latitude: ${coordinates.lat} and longitude: ${coordinates.lat}`);
    }


  }

  private async checkIfLocationExists(coordinates: IFormattedCoordinates) {
    
  }
}
