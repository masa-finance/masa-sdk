import { checkLogin } from "./check-login";
import { login } from "./login";
import { logout } from "./logout";
import { getSession } from "./get-session";
import { MasaBase } from "../helpers/masa-base";

export class MasaSession extends MasaBase {
  checkLogin = () => checkLogin(this.masa);
  sessionLogout = () => this.masa.client.session.logout();
  login = () => login(this.masa);
  logout = () => logout(this.masa);
  getSession = () => getSession(this.masa);
}
