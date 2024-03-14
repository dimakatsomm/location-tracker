import { Request, Response } from 'express';
import { Inject, Service } from 'typedi';

import { ILocation } from '../database/types/location.type';
import { ICoordinates } from '../interfaces/location.interface';
import { LocationService } from '../services/location.service';
import { UserService } from '../services/user.service';
import { handleError } from '../utils/error.utils';

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
      if (!(await this.checkUserExists(req.auth.userId, res))) return;

      const coordinates = req.body as ICoordinates;
      const location: ILocation = await this.locationService.reverseGeocode(coordinates, req.auth.userId);

      return res.status(201).json({ status: true, data: location });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      handleError(res, e);
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
      if (!(await this.checkUserExists(req.auth.userId, res))) return;

      const locations: ILocation[] = await this.locationService.listLocationHistory(req.auth.userId);

      return res.status(201).json({ status: true, data: locations });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      handleError(res, e);
    }
  };

  /**
   * @method checkUserExists
   * @private
   * @async
   * @param {string} userId
   * @param {Response} res
   * @returns {Promise<boolean>}
   */
  private checkUserExists = async (userId: string, res: Response): Promise<boolean> => {
    const user = await this.userService.checkIfUserExists(userId);
    if (!user) {
      res.status(404).json({ status: false, data: { message: `User does not exist.` } });
      return false;
    }
    return true;
  };
}
