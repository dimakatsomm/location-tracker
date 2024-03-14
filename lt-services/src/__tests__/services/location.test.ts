import { Test, TestingModule } from '@nestjs/testing';
import { LocationService } from '../../services/location.service';
import NodeGeocoder from 'node-geocoder';
import { Location } from '../../database/models/location.model';
import { mockDeep, mockReset } from 'jest-mock-extended';
import { Service } from 'typedi';

const mockGeocoder = mockDeep<NodeGeocoder>();
const mockLocationModel = mockDeep<typeof Location>();

jest.mock('node-geocoder', () => {
  return jest.fn(() => mockGeocoder);
});

jest.mock('../../database/models/location.model', () => {
  return {
    Location: mockLocationModel,
  };
});

describe('LocationService', () => {
  let service: LocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocationService],
    }).compile();

    service = module.get<LocationService>(LocationService);
    mockReset(mockGeocoder);
    mockReset(mockLocationModel);
  });

  describe('reverseGeocode', () => {
    it('should successfully reverse geocode coordinates', async () => {
      const coordinates = { lat: 1, lon: 2 };
      const userId = 'testUserId';
      const expectedLocation = {
        userId,
        latitude: 1,
        longitude: 2,
        country: 'TestCountry',
        countryCode: 'TC',
        city: 'TestCity',
        zipCode: '12345',
        street: '1 Test Street',
      };

      mockGeocoder.reverse.mockResolvedValue([
        {
          latitude: 1,
          longitude: 2,
          country: 'TestCountry',
          countryCode: 'TC',
          city: 'TestCity',
          zipcode: '12345',
          streetNumber: '1',
          streetName: 'Test Street',
        },
      ]);

      mockLocationModel.create.mockResolvedValue(expectedLocation);

      const result = await service.reverseGeocode(coordinates, userId);

      expect(result).toEqual(expectedLocation);
      expect(mockGeocoder.reverse).toHaveBeenCalledWith(coordinates);
      expect(mockLocationModel.create).toHaveBeenCalledWith(expectedLocation);
    });

    // Example test for error handling in reverseGeocode
    it('should handle errors gracefully', async () => {
      const coordinates = { lat: 1, lon: 2 };
      mockGeocoder.reverse.mockRejectedValue(new Error('Geocoding failed'));
      await expect(service.reverseGeocode(coordinates, 'testUserId')).rejects.toThrow('Geocoding failed');
    });

    // Additional tests for error handling and no location found scenarios can be added here.
  });

  describe('listLocationHistory', () => {
    it('should return location history for a given user ID', async () => {
      const userId = 'testUserId';
      const expectedLocations = [
        {
          userId,
          latitude: 1,
          longitude: 2,
          country: 'TestCountry',
          // Additional fields...
        },
        // Additional locations...
      ];

      mockLocationModel.find.mockResolvedValue(expectedLocations);

      const result = await service.listLocationHistory(userId);

      expect(result).toEqual(expectedLocations);
      expect(mockLocationModel.find).toHaveBeenCalledWith({ userId });
    });

    // Example test for no location found in listLocationHistory
    it('should return an empty array if no locations are found', async () => {
      const userId = 'testUserId';
      mockLocationModel.find.mockResolvedValue([]);
      const result = await service.listLocationHistory(userId);
      expect(result).toEqual([]);
    });
  });
});