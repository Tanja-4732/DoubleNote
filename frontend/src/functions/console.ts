import { environment } from "src/environments/environment";

class helper {
  static get log() {
    return !environment.production ? console.log : (...nothing) => {};
  }
}
export const log = helper.log;
