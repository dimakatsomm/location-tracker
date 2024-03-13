import { Service } from 'typedi';
import NodeGeocoder from 'node-geocoder';
import * as C from '../constants';
import { ICoordinates } from '../interfaces/location.interface';
import { Location } from '../database/models/location.model';
import { ILocation } from '../database/types/location.type';

const options: NodeGeocoder.Options = {
  provider: 'opencage',

  // Optional depending on the providers
  apiKey: C.NODE_GEOCODER_API_KEY, // for Mapquest, OpenCage, APlace, Google Premier
  formatter: null, // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

@Service()
export class LocationService {
  /**
   * @method reverseGeocode
   * @async
   * @param {ICoordinates} coordinates
   * @returns {Promise<void>}
   */
  async reverseGeocode(coordinates: ICoordinates, userId: string): Promise<ILocation> {
    const location: NodeGeocoder.Entry[] = await geocoder.reverse(coordinates);

    if (!location?.length) {
      throw new Error(`No location has been found with coordinates, latitude: ${coordinates.lat} and longitude: ${coordinates.lat}`);
    }

    return Location.create({
      userId,
      latitude: location[0].latitude,
      longitude: location[0].longitude,
      country: location[0].country,
      countryCode: location[0].countryCode,
      city: location[0].city,
      zipCode: location[0].zipcode,
      street: `${location[0].streetNumber} ${location[0].streetName}`,
    });
  }

  /**
   * @method listLocationHistory
   * @async
   * @param {string} userId
   * @returns {Promise<void>}
   */
  async listLocationHistory(userId: string): Promise<ILocation[]> {
    return Location.find({ userId });
  }
}
