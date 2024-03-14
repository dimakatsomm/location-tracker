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

    // Add more tests for different scenarios, including successful save and error handling
  });

  describe('locationHistory', () => {
    it('should return 404 if user does not exist', async () => {
      jest.spyOn(userService, 'checkIfUserExists').mockResolvedValueOnce(null);

      await locationController.locationHistory(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ status: false, data: { message: `User does not exist.` } });
    });

    // Add more tests for different scenarios, including successful listing and error handling
  });
});
