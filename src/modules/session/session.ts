import type { ISession, LogoutResult } from "../../interface";
import { MasaBase } from "../../masa-base";
import { checkLogin } from "./check-login";
import { getSession } from "./get-session";
import { login, LoginResult } from "./login";
import { logout } from "./logout";

export class MasaSession extends MasaBase {
  public checkLogin = (): Promise<boolean> => checkLogin(this.masa);
  public sessionLogout = (): Promise<LogoutResult | undefined> =>
    this.masa.client.session.logout();
  public login = (): Promise<LoginResult> => login(this.masa);
  public logout = (): Promise<
    | {
        status: string;
      }
    | undefined
  > => logout(this.masa);
  public getSession = (): Promise<ISession | undefined> =>
    getSession(this.masa);
}
