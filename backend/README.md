# DoubleNote Backend

This is the backend of DoubleNote.

It's an [Express.js](https://expressjs.com) server weitten in TypeScript.

The goal of the server is to serve the compiled files of the frontend (located in `/frontend/dist/DoubleNote/`) when requested via HTTP or HTTPS and serve API requests.

Instead of displaying a 404 error, the server should serve the `index.html`. It is then the responsibility of the frontend to inform the user, that the requested route does not lead to a specific target.

## Folder structure

- `/backend/` Contains all files of the backend
  - `README.md` You are here
  - `src/` Contains all backend source files
    - `main.ts` The main entry point of the application
    - `server/` All other source files
      - `server.ts` The file configuring starting the server
      - `routes/` Contains all routes mounted to the server
        - `routes.ts` The top-level routing file
        - `files.ts` Provides routing to static files of the frontend
        - `api/` Contains all API routes
          - `api.ts` The top-level file for API routes
          - `v1.ts` The top-level file for the first version of the API
  - `dist/` Compiler outout; included in .gitignore
  - `node_modules/` Installed npm dependencies; included in .gitignore
  - `package.json` Declares all backend dependencies and npm scripts
  - `package-lock.json` An npm-generated file
  - `tsconfig.json` Configures how TypeScript should compile the backend
  - `.gitignore` Prevents `node_modules` and `dist` from entering version control

## Further reading

For information about the frontend, see the [frontend README.md](/frontend/README.md).
For information about the application as a whole, see the [main README.md](/README.md).
