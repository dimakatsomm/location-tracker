import { ILocation } from 'database/types/location.type';
import { IUser } from 'database/types/user.type';
import { NextFunction, Request, Response } from 'express';
import { IUserRequest } from 'interfaces/auth.interface';
import { ICoordinates } from 'interfaces/location.interface';
import { LocationService } from 'services/location.service';
import { UserService } from 'services/user.service';
import { Inject, Service } from 'typedi';

@Service()
export class LocationController {
  // eslint-disable-next-line no-useless-constructor
  constructor(@Inject() private locationService: LocationService, @Inject() private userService: UserService) {}

  /**
   * @method reverseGeocode
   * @instance
   * @async
   * @param {IUserRequest} req
   * @param {Response} res
   */
  saveLocation = async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
      const user: IUser = await this.userService.checkIfUserExists(req.auth.userId);
      if (!!!user) {
        return res.status(404).json({ status: false, data : { message: `User does not exist.` }});
      }

      const coordinates = req.body as ICoordinates;
      const location: ILocation = await this.locationService.reverseGeocode(coordinates, user.id);

      return res.status(201).json({ status: true, data: location });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ status: false, data: e });
    }
  };

  /**
   * @method listLocationHistory
   * @instance
   * @async
   * @param {IUserRequest} req
   * @param {Response} res
   */
  locationHistory = async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
      const user: IUser = await this.userService.checkIfUserExists(req.auth.userId);
      if (!!!user) {
        return res.status(404).json({ status: false, data : { message: `User does not exist.` }});
      }

      const locations: ILocation[] = await this.locationService.listLocationHistory(user.id);

      return res.status(201).json({ status: true, data: locations });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ status: false, data: e });
    }
  };
}
