export const isSession = (session: unknown): session is ISession =>
  !!session &&
  (session as ISession).user !== undefined &&
  (session as ISession).cookie !== undefined;

export interface ISession {
  cookie: {
    originalMaxAge: number;
    expires: string;
    secure: boolean;
    httpOnly: boolean;
    domain: string;
    path: string;
    sameSite: string;
  };
  challenge: string;
  user: {
    userId: string;
    address: string;
  };
}

export interface User {
  id: string;
  availableRoles?: string[];
  productsOfInterest?: string[];
  activeRole?: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified?: boolean;
  lastLoginDate?: string;
  countryId?: string;
  country?: {
    bankApproved?: boolean;
    phoneCode?: string;
    iso2?: string;
    iso3?: string;
    abbreviation?: string;
    name?: string;
    version?: number;
  };
  dateOfBirth?: string;
  phone?: string;
  pngmeId?: string;
  pngmePermsAllowed?: boolean;
  dataFarmingAllowed?: boolean;
}

export interface SessionUser {
  userId: string;
  address: string;
}

export interface ChallengeResult {
  challenge: string;
  expires: string;
}

export interface ChallengeResultWithCookie extends ChallengeResult {
  cookie?: string;
}

export interface LogoutResult {
  status: string;
}
