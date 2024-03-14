import { Request, Response } from 'express';
import { Inject, Service } from 'typedi';

import { ILocation } from '../database/types/location.type';
import { ICoordinates } from '../interfaces/location.interface';
import { LocationService } from '../services/location.service';
import { UserService } from '../services/user.service';

@Service()
export class LocationController {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @Inject() private locationService: LocationService,
    @Inject() private userService: UserService,
  ) {}

  /**
   * @method saveLocation
   * @instance
   * @async
   * @param {Request} req
   * @param {Response} res
   */
  saveLocation = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.checkIfUserExists(req.auth.userId);
      if (!user) {
        return res.status(404).json({ status: false, data: { message: `User does not exist.` } });
      }

      const coordinates = req.body as ICoordinates;
      const location: ILocation = await this.locationService.reverseGeocode(coordinates, user.id);

      return res.status(201).json({ status: true, data: location });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error(e);
      return res.status(500).json({ status: false, data: { message: e.data?.message || e.message, error: e } });
    }
  };

  /**
   * @method listLocationHistory
   * @instance
   * @async
   * @param {Request} req
   * @param {Response} res
   */
  locationHistory = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.checkIfUserExists(req.auth.userId);
      if (!user) {
        return res.status(404).json({ status: false, data: { message: `User does not exist.` } });
      }

      const locations: ILocation[] = await this.locationService.listLocationHistory(user.id);

      return res.status(201).json({ status: true, data: locations });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error(e);
      return res.status(500).json({ status: false, data: { message: e.data?.message || e.message, error: e } });
    }
  };
}
