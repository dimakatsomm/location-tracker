import { IUser } from "database/types/user.type"
import { IAppUser } from "interfaces/user.interface"

export const mapUserToAppUser = (user: IUser): IAppUser => {
    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        emailAddress: user.emailAddress,  
    }
}