import { checkLogin } from "./check-login";
import { login } from "./login";
import { logout } from "./logout";
import { getSession } from "./get-session";
import Masa from "../masa";
import { checkAllowlist } from "./allowlist";

export class MasaSession {
  constructor(private masa: Masa) {}

  checkLogin = () => checkLogin(this.masa);
  sessionLogout = () => this.masa.client.sessionLogout();
  login = () => login(this.masa);
  logout = () => logout(this.masa);
  getSession = () => getSession(this.masa);
  checkAllowlist = () => checkAllowlist(this.masa);
}
