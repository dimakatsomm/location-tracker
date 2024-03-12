export interface INewUser {
  firstName: string;
  lastName: string;
  username: string;
  emailAddress: string;
  password: string;
}

export interface ILoginUser {
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
