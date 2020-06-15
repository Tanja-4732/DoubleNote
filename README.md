# DoubleNote

This is a new project; its development status is far away from a beta release.

See the `master` branch deployed here: <https://DoubleNote.bernd.pw/>  
Notice: This is only the frontend served statically. Some (planned) features are only available using the backend server.

## (Planned) Features

_See the newest plans in the [4th iteration of the frontend README](/frontend/README.md#4th-iteration)_

- Progressive web application
  - Full offline support
- Real-time collaboration
  - WebRTC
  - Peer-to-peer collaboration
  - PeerJs
- Organize notes in notebooks
  - Store notebooks in `localStorage`
  - Allow for sections & subsections (recursively)
  - Use pages for notes
- Markdown & Free-hand drawing
  - Create text boxes anywhere within a page
  - Write notes using Markdown
  - Draw anywhere on a page
  - Touch & mouse support
- Undo/Redo functionality
  - Undo multiple actions
  - Revert undo-s using redo
  - Persistent edit history
  - Maybe also use commit-based version control
- Import/Export
  - (De)serialize notebooks to and from JSON

Frontend-specific features are specified in the [frontend implementation strategy](/frontend/README.md#implementation-strategy).

## Further reading

For information about the frontend, see the [frontend README.md](/frontend/README.md).  
For information about the backend, see the [backend README.md](/backend/README.md).

## Licence & Copyright

Copyright (c) 2020 Bernd-L. All rights reserved.

DoubleNote is free software: you can redistribute it and/or modify it under the terms of the [GNU Affero General Public License](/LICENSE.md) as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

DoubleNote is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the [GNU Affero General Public License](/LICENSE.md) for more details.

You should have received a copy of the [GNU Affero General Public License](/LICENSE.md) along with DoubleNote. If not, see <https://www.gnu.org/licenses/>.

This project (including its source code and its documentation) is released under the terms of the [GNU Affero General Public License](/LICENSE.md).
