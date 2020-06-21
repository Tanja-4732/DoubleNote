# DoubleNote Backend

This is the (optional) backend of DoubleNote.  
It's an [Express.js](https://expressjs.com) server written in TypeScript.

It's optional because the application was designed to support being served as static resources from a regular CDN or static-site host such as GitHub pages.

The goal of the server is to serve the compiled files of the frontend (located in `/frontend/dist/DoubleNote/`) when requested via HTTP or HTTPS and serve API requests.

Instead of displaying a 404 error, the server should serve the `index.html`. It is then the responsibility of the frontend to inform the user, that the requested route does not lead to a specific target.  
The frontend achieves this functionality by providing a `404.html` symbolic link to the `index.html` file in the `gh-pages` branch of this repository to be served statically on GitHub pages.

If this server isn't used, the host must provide some way of achieving the same functionality (redirecting 404s to `index.html`) using the configuration file(s) of the static server software used.

## Goals

The frontend is designed to support multiple (or none) backend servers at once. Each server may host its own notebooks for synchronisation purposes.

Eventually, this server implementation should provide APIs which allow the automatic persistance of notebooks outside of `localStorage`.

It's meant to be a decentralised kind of backend service, in which every user gets to choose on which servers (if any) they wish to store their notebooks.

This is supposed to make sharing and collaboration easier, but is not required, as this application is designed to be static-serving-capable.

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
