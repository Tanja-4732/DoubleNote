export interface Server {
  /**
   * The name of the server
   */
  name: string;

  /**
   * The ISOString of date the server was added on
   */
  addedOn: string;

  /**
   * The URL to the API base path of the server
   *
   * ### Examples:
   *
   * - `https://doublenote.example.com/api`
   * - `https://app.example.com/DoubleNote/api`
   */
  apiUrl: string;
}
