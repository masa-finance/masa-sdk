import { checkLogin } from "./check-login";
import { login } from "./login";
import { logout } from "./logout";
import { getSession } from "./get-session";
import { MasaBase } from "../helpers/masa-base";
import Masa from "../masa";

export class MasaSession extends MasaBase {
  constructor(masa: Masa) {
    super(masa);
  }

  checkLogin = () => checkLogin(this.masa);
  sessionLogout = () => this.masa.client.session.logout();
  login = () => login(this.masa);
  logout = () => logout(this.masa);
  getSession = () => getSession(this.masa);
}
