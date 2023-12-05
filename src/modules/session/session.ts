import { ISession, LogoutResult } from "../../interface";
import { MasaBase } from "../../masa-base";
import { checkLogin } from "./check-login";
import { getSession } from "./get-session";
import { login, LoginResult } from "./login";
import { logout } from "./logout";

export class MasaSession extends MasaBase {
  checkLogin = (): Promise<boolean> => checkLogin(this.masa);
  sessionLogout = (): Promise<LogoutResult | undefined> =>
    this.masa.client.session.logout();
  login = (): Promise<LoginResult> => login(this.masa);
  logout = (): Promise<
    | {
        status: string;
      }
    | undefined
  > => logout(this.masa);
  getSession = (): Promise<ISession | undefined> => getSession(this.masa);
}
