import { environment } from "src/environments/environment";

class Helper {
  static get log() {
    return !environment.production ? console.log : (...nothing) => {};
  }

  static get error() {
    return !environment.production ? console.error : (...nothing) => {};
  }
}

export const log = Helper.log;
export const error = Helper.error;
