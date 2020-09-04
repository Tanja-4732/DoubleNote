import { environment } from "src/environments/environment";

class Helper {
  static get log() {
    return !environment.production ? console.log : (...nothing: any) => {};
  }

  static get error() {
    return !environment.production ? console.error : (...nothing: any) => {};
  }
}

export const log = Helper.log;
export const error = Helper.error;
