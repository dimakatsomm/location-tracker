export interface INewUser {
  firstName: string;
  lastName: string;
  username: string;
  emailAddress: string;
  password: string;
}

export interface ICredentials {
  username?: string;
  emailAddress?: string;
  password: string;
}

export interface IAppUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  emailAddress: string;
}

export interface IVerifyUser {
  id: string;
  emailAddress: string;
  firstName: string;
  lastName: string;
}
