import { MasaBase } from "../../base";
import { checkLogin } from "./check-login";
import { getSession } from "./get-session";
import { login } from "./login";
import { logout } from "./logout";

export class MasaSession extends MasaBase {
  checkLogin = () => checkLogin(this.masa);
  sessionLogout = () => this.masa.client.session.logout();
  login = () => login(this.masa);
  logout = () => logout(this.masa);
  getSession = () => getSession(this.masa);
}
