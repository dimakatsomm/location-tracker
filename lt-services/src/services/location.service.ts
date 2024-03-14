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
    const location = await geocoder.reverse(coordinates);
    this.validateLocation(location, coordinates);
    return this.createLocationInstance(location[0], userId);
  }

  /**
   * @method reverseGeocode
   * @private
   * @param {ICoordinates} coordinates
   * @returns {Promise<void>}
   */
  private validateLocation(location: NodeGeocoder.Entry[], coordinates: ICoordinates): void {
    if (!location?.length) {
      throw new Error(`No location has been found with coordinates, latitude: ${coordinates.lat} and longitude: ${coordinates.lat}`);
    }
  }

  /**
   * @method createLocationInstance
   * @private
   * @param {NodeGeocoder.Entry} locationData
   * @param {string} userId
   * @returns {ILocation}
   */
  private createLocationInstance(locationData: NodeGeocoder.Entry, userId: string): Promise<ILocation> {
    return Location.create({
      userId,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      country: locationData.country,
      countryCode: locationData.countryCode,
      city: locationData.city,
      zipCode: locationData.zipcode,
      street: `${locationData.streetNumber} ${locationData.streetName}`,
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
