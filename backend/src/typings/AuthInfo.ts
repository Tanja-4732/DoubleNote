export type AuthComponent = "name" | "email" | "password" | "TOTP";

export type RegistrationType = "open" | "protected" | "disabled";

export interface AuthStrategy {
  components: AuthComponent[];
  registration: RegistrationType;
}

export interface AuthInfo {
  supportedStrategies: AuthStrategy[];
}
