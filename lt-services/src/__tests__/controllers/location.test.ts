import { LocationController } from '../../controllers/location.controller';
import { LocationService } from '../../services/location.service';
import { UserService } from '../../services/user.service';
import { Request, Response } from 'express';

describe('LocationController', () => {
  let locationController: LocationController;
  let locationService: LocationService;
  let userService: UserService;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;

  beforeEach(() => {
    locationService = new LocationService();
    userService = new UserService();
    locationController = new LocationController(locationService, userService);

    responseJson = jest.fn();
    mockResponse = {
      json: responseJson,
      status: jest.fn().mockReturnThis(),
    };

    mockRequest = {
      auth: { userId: 'testUserId' },
      body: {},
    };
  });

  describe('saveLocation', () => {
    it('should return 404 if user does not exist', async () => {
      jest.spyOn(userService, 'checkIfUserExists').mockResolvedValueOnce(null);

      await locationController.saveLocation(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ status: false, data: { message: `User does not exist.` } });
    });

    // Filled test case for successful location save
    it('should return 200 and location data if save is successful', async () => {
      jest.spyOn(userService, 'checkIfUserExists').mockResolvedValueOnce(true);
      const mockLocationData = { lat: 123, lon: 456 };
      jest.spyOn(locationService, 'saveLocation').mockResolvedValueOnce(mockLocationData);

      await locationController.saveLocation(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseJson).toHaveBeenCalledWith({ status: true, data: mockLocationData });
    });
  });

  describe('locationHistory', () => {
    it('should return 404 if user does not exist', async () => {
      jest.spyOn(userService, 'checkIfUserExists').mockResolvedValueOnce(null);

      await locationController.locationHistory(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ status: false, data: { message: `User does not exist.` } });
    });

    // Filled test case for error handling in locationHistory
    it('should return 500 if an unexpected error occurs', async () => {
      jest.spyOn(locationService, 'getLocationHistory').mockImplementationOnce(() => {
        throw new Error('Unexpected error');
      });

      await locationController.locationHistory(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ status: false, data: { message: `An unexpected error occurred.` } });
    });
  });
});