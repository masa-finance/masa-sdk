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
