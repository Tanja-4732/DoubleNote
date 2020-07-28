<div align="center">
  <img src="frontend/design/dn-logo/dn-logo.svg" width="150px">
</div>

# DoubleNote

A note taking app focused on ease of use and user freedom.

This is a new project; its development status is far away from a beta release.

See the `master` branch deployed here: <https://DoubleNote.bernd.pw/> using Vercel.  
Notice: This is only the frontend served statically. Some (planned) features are only available using the backend server.

## (Planned) Features

_See the newest plans in the [5th iteration of the frontend README](/frontend/README.md#5th-iteration)_

- Note-taking with both Markdown and WYSIWYG editors (ProseMirror)
- Full offline support (Progressive Web App)
- Peer-to-peer real-time collaboration (WebRTC, no backend server needed)
- Git-like version control (commits, branches, tags, reused objects)
- Two types of notebooks
  - Recursive categories with pages containing text boxes and free-hand drawing (like OneNote)
  - Sequential blocks with nested pages capable of special data and tables (like Notion)
- Offline-capable import/export functionality (JSON)
- Origin-agnostic migration support (for DoubleNote instances on different hosts)
- Optional cloud storage (server-side software) with user accounts and shared permissions

## Development

This application is based on [Angular](https://angular.io), a Single Page Application (SPA) framework and written in TypeScript, HTML 5 and CSS 3.

The `package.json` file in the `/frontend/` directory (the directory containing the file you're viewing now) contains a script called "watch".  
With the command `npm run watch` you can start the Angular compiler in a development mode which automatically incrementally recompiles changes made to the code found in applicable frontend files.

Those files still need to be served to the browser somehow. This is where the backend (or any old fileserver) comes into play:

1. Start the Angular compiler in development mode
   1. Open a terminal and `cd` into the `/frontend/` directory
   2. Run `npm i` to install all required frontend dependencies from the npm registry (you only need to do this once)
   3. Run the command `npm run watch` to start the Angular compiler in development mode
2. Start a file server of your choice (those are the steps for running the backend)
   1. Open another terminal and `cd` into the `/backend/` directory
   2. Run `npm i` to install all required **backend** dependencies from the npm registry (you only need to do this once)
   3. Run the command `npm run watch` to start the backend compilation script in development mode
3. View the results
   1. Open your browser of choice (I recommend using Chrome or [Firefox Developer Edition](fde))
   2. Navigate to the now served web application (usually on port 80 via http, see the [backend README.md](/backend/README.md) for further information)
   3. Your browser should now see the application served on an origin like `http://10.0.0.42:80`, `http://localhost:80` or something similar
   4. Open the developer tools (press <kbd>F12</kbd>) to see the JavaScript output (in the "Console" tab) for debugging purposes
4. Start developing
   1. You could edit the [frontend welcome HTML file](/frontend/src/app/user-interface/components/welcome/welcome.component.html) to change the application itself, or the [backend main routing file](/backend/src/server/server.ts) to modify the backend or add your own functionality
   2. Save the file you just edited and give the compiler about one and a half seconds to recompile the application
   3. Reload the page in your browser (or navigate to your new API endpoint) to see your changes
5. Contribute to this project
   1. Once you find a bug, or see other room for improvement, feel free to implement them
   2. Create a fork of this repository
   3. Commit and push your changes to your fork
   4. Create a pull request

## Further reading

For information about the frontend, see the [frontend README.md](/frontend/README.md).  
For information about the backend, see the [backend README.md](/backend/README.md).

## Licence & Copyright

Copyright (c) 2020 Bernd-L. All rights reserved.

DoubleNote is free software: you can redistribute it and/or modify it under the terms of the [GNU Affero General Public License](/LICENSE.md) as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

DoubleNote is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the [GNU Affero General Public License](/LICENSE.md) for more details.

You should have received a copy of the [GNU Affero General Public License](/LICENSE.md) along with DoubleNote. If not, see <https://www.gnu.org/licenses/>.

This project (including its source code and its documentation) is released under the terms of the [GNU Affero General Public License](/LICENSE.md).

[fde]: https://www.mozilla.org/en-US/firefox/developer/
