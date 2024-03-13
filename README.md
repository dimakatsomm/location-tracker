### Class Diagram (Mermaid)

```mermaid
classDiagram
    class NotificationService {
        +sendVerificationEmail(IVerifyUser, string): Promise~void~
        +sendForgotPasswordEmail(IAppUser, string): Promise~void~
    }
    class UserService {
        +register(INewUser): Promise~IVerifyUser~
        +getUserWithUsernameOrEmail(ICredentials): Promise~IUser|null~
        +checkIfUserExists(string): Promise~IUser|null~
        +checkIfUserExistsByEmail(string): Promise~IUser|null~
        +validateUser(string, string): Promise~IUser|null~
        +verifyUserAccount(string): Promise~void~
        +updatePassword(string, string): Promise~void~
    }
    class LocationService {
        +reverseGeocode(ICoordinates, string): Promise~ILocation~
        +listLocationHistory(string): Promise~ILocation[]~
    }
    class LocationController {
        -locationService: LocationService
        -userService: UserService
        +saveLocation(Request, Response)
        +locationHistory(Request, Response)
    }
    class AuthController {
        -userService: UserService
        -notificationService: NotificationService
        +register(Request, Response)
        +verify(Request, Response)
        +resendVerification(Request, Response)
        +login(Request, Response)
        +forgotPassword(Request, Response)
        +resetPassword(Request, Response)
    }
    class User {
        -_id: UUID
        -firstName: String
        -lastName: String
        -emailAddress: String
        -username: String
        -password: String
        -verified: Boolean
    }
    class Location {
        -_id: UUID
        -_userId: UUID
        -latitude: Number
        -longitude: Number
        -country: String
        -countryCode: String
        -city: String
        -zipCode: String
        -street: String
    }
    class Language {
        -_id: String
        -name: String
    }
    class Currency {
        -_id: String
        -name: String
        -symbol: String
    }
    class Country {
        -_id: String
        -name: String
        -capital: String
        -region: String
        -currencyCode: String
        -languageCode: String
        -flag: String
        -diallingCode: String
        -isoCode: String
    }

    UserService --> User : uses
    LocationService --> Location : uses
    NotificationService --> User : uses
    AuthController --> UserService : depends
    AuthController --> NotificationService : depends
    LocationController --> LocationService : depends
    LocationController --> UserService : depends
```

### README (Markdown)

# lt-services/src Package Overview

## Services

- **NotificationService**: Handles sending verification and password reset emails.
- **UserService**: Manages user registration, authentication, and user data retrieval.
- **LocationService**: Provides functionality for geocoding and managing user location history.

## Controllers

- **LocationController**: Exposes endpoints for saving user locations and retrieving location history.
- **AuthController**: Handles user authentication, including registration, login, verification, and password resets.

## Models

- **User**: Represents user data within the system.
- **Location**: Represents a user's location data.
- **Language**: Represents supported languages.
- **Currency**: Represents supported currencies.
- **Country**: Represents supported countries.

## Use Cases

- User registration, login, and account verification.
- Password reset and account recovery.
- Saving user locations and retrieving location history.
