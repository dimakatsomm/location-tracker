import { ILocation } from 'database/types/location.type';
import { NextFunction, Request, Response } from 'express';
import { ICoordinates } from 'interfaces/location.interface';
import { LocationService } from 'services/location.service';
import { Inject, Service } from 'typedi';

@Service()
export class LocationController {
  // eslint-disable-next-line no-useless-constructor
  constructor(@Inject() private locationService: LocationService) {}

  /**
   * @method reverseGeocode
   * @instance
   * @async
   * @param {Request} req
   * @param {Response} res
   */
  reverseGeocode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const coordinates = req.body as ICoordinates;
      const location: ILocation = await this.locationService.reverseGeocode(coordinates, req.auth.userId);

      return res.status(200).json({ status: true, data: location });
    } catch (e) {
      console.error(e);
      next(e);
    }
  };
}
