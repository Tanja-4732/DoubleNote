<div align="center">
  <img src="frontend/design/dn-logo/dn-logo.svg" width="150px">
</div>

# DoubleNote

A note taking app focused on ease of use and user freedom.

This is a new project (currently in beta); its development status is far away from a 1.0 release.

To give it a try, see the `master` branch deployed here: <https://DoubleNote.bernd.pw/> (powered by Vercel).  
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

## Usage

If you want to try the application before installing via NPM or Docker, you can check it out [here on Vercel](https://DoubleNote.bernd.pw/).

You can use the [doublenote Docker image](https://hub.docker.com/r/berndl/doublenote), or the [doublenote NPM package](https://npmjs.org/package/doublenote), which contains the frontend, the backend and some CLI files which allow for easy execution (for more details about the doublenote NPM package, see the [package README.md](/package/README.md); it contains info on how to install and start the software).

Both the frontend and the backend have their respective packages on NPM: [doublenote-frontend](https://npmjs.org/package/doublenote-frontend) (contains the compiled frontend without any non-dev dependencies), and the [doublenote-backend](https://npmjs.org/package/doublenote-backend), which contains the compiled backend (depending on Express).

## Development

For more information on how to develop this application, push it beyond its current capabilities and realize your own features and/or bug fixes, see the [development section of the frontend README.md](/frontend/README.md#development)

## Further reading

For information about the frontend, see the [frontend README.md](/frontend/README.md).  
For information about the backend, see the [backend README.md](/backend/README.md).  
For information about the `doublenote` NPM package, see the [package README.md](/package/README.md).

## Licence & Copyright

Copyright (c) 2020 Bernd-L. All rights reserved.

![AGPL v3: Free as in Freedom](https://www.gnu.org/graphics/agplv3-with-text-162x68.png)

DoubleNote is free software: you can redistribute it and/or modify it under the terms of the [GNU Affero General Public License](/LICENSE.md) as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

DoubleNote is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the [GNU Affero General Public License](/LICENSE.md) for more details.

You should have received a copy of the [GNU Affero General Public License](/LICENSE.md) along with DoubleNote. If not, see <https://www.gnu.org/licenses/>.

This project (including its source code and its documentation) is released under the terms of the [GNU Affero General Public License](/LICENSE.md).
