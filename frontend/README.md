# DoubleNote Frontend

This is the Frontend of DoubleNote.

It's an [Angular](https://angular.io) single page application written in TypeScript, HTML, and SCSS.

The goal of the frontend is to provide a fully-featured web application capable of creating, editing, and view notes -- both in Markdown and as free-hand drawings.

You can view a static deployment of the `master` branch at <https://double-note.vercel.app/>.

## Implementation strategy

This is how I envision DoubleNote to be implemented

### Older stuff (1st, 2nd and 3rd iteration)

<details>
<summary>
  Show older ideas (1st, 2nd and 3rd iteration)
</summary>

### Initial strategy

Some of this is outdated (see below)

- Provide a sidenav to switch between contexts such as the welcome screen, settings and notebooks
- Use RxJS Observables and Subjects where possible
- Use event-sourcing (CQRS)
- Represent any action as an event as soon as possible
- Connect to users via WebRTC for peer-to-peer communication
  - Use the PeerJS library
- Send every event to all peers as soon as possible
- Treat own events the same way as incoming events from peers
- Only update the state of a note by applying events
- Maybe implement something like Git?
  - Objects
  - Hashes
  - Branches
  - Push/Pull

### 2nd iteration

- Real-time collaboration requires one peer to be the host
- Every action performed by any user needs to be an event
- Pipe every event through the same pipeline
- Treat own events the same way as incoming events from peers
- Allow users to undo and redo any changes made during editing
- Commit after changes are completed

### Editing notes & Markdown engine

We need a syntax tree

Maybe consider using FrontMatter as well
There can be formatting (bold, italics, ...) inline

Several markdown features can be applied to one piece of text.
Some features disable each other, depending on which one is inside of the other
We'll need to run the parser several times

Markdown features

- Code blocks
- Inline code
- Comments
- Tables
- Math blocks
- Inline math
- Inline formatting
  - Bold
  - Italics
  - Underline
  - Strike-through
  - Highlight
- Headings
- Links
- Images
- Abbreviations
- Text
- Quotes
- Critique markup

List of nodes

- Headings
- Comments
- Tables
- Paragraphs

### Another take on collaboration

- Every peer parses their own changes
- Only send the delta to the message bus

### 3rd iteration

- Sections and pages are stored in notebooks
- Sections can be sub-sections of other sections
- Pages must be part of exactly one section
- Send every event to the message bus
- Every event which affects the view must come from the message bus
- The message bus propagates messages to peers
- The message bus receives incoming messages from peers
- Assume the Markdown engine to be sufficiently fast
- Every text box has its own MDOM
- One page can have multiple text boxes
- On local change of the markdown text, the engine should parse it again
- On local change of the WYSIWYG text, the engine should parse it again
- The resulting MDOM needs to be sent to the message bus in its entirety
- Incoming MDOM from the message bus needs to be compared against the local MDOM
- Only calculate the delta locally and apply it to the markdown text and the WYSIWYG text
  - Handle conflicting changes
  - What if two people delete a different paragraph?
- Think about persisting messages
  - Probably store the JSON of every MDOM as text in the localStorage
  - Distributed versioning
- How to handle drawing?
  - A user can draw on every page
  - Only allow drawing in draw boxes?
  - How to synchronize drawing?
  - Introduce some kind of Drawing Object Model?
  - Only allow one Drawing Object Model per page?
    - If so, every page should have one
- Git works best on text files on a line by line basis
  - How would applying such version control look like using an AST?
  - What if something changes sub-node?
  - When a node changes, it needs to be replaced
  - Handle sub-node conflicts
  - When are two text nodes the same node but with changes?
  - What if two peers paste the same text as a paragraph?
    - What if there are two, non-conflicting changes?
  - What if there are changes on separate lines of one markdown paragraph?
  - How to handle changes in the WYSIWYG text?
  - How to handle paragraphs being merged with other paragraphs?
  - How to handle paragraphs being re-ordered?
  - The third iteration plans suggest sending the entire MDOM in every event
  - Delta cannot be calculated on the side of the sending peer
    - At least not without some kind of Git-like commit structure
- **Real-time peer-to-peer needs to work as well as asynchronous peer-to-peer editing**
  - Decide where to handle delta calculations
  - Real-time editing requires fast delta computations
  - Async editing requires distributed merging of conflicting changes
  - Achieve eventual consistency somehow

</details>

### 4th iteration

- Function both as a static website and with a server
  - A static website host (such as GitHub pages) should work for most features
  - The backend server should provide additional functionality
- Two kinds of pages
  - Sequential block pages (SBP)
  - Box canvas pages (BCP)
- Collaboration
  - Real-time
    - Message bus via WebRTC
  - Async
- Notebooks
- Tags

WIP

## Sub-projects

- Frontend user interface
- Message bus
- Markdown engine
- WYSIWYG editor
- Distributed version control
- SBP implementation
- BCP implementation
- Web-port of [matcha dark sea](https://github.com/vinceliuice/Matcha-gtk-theme#readme)

## Folder structure

Only the relevant files and folders are listed

- `/frontend/` Contains all files of the frontend
  - `README.md` You are here
  - `src/` Contains all frontend application-source files
    - `app/` The application code, structured in modules
      - `core/` The core module containing all globally used services
      - `user-interface/` The main UI module containing most UI components
      - `routes/` Contains Angular routing
        - `app-routing.module.ts` The routing module (specifies Angular routes)
      - `box-canvas-page` The Box canvas page implementation
      - `sequential-block-page` The Sequential block page implementation
      - `app.module.ts` The root app module
      - `app.component.*` The root angular component
    - `typings/` The TypeScript interfaces used in the application
    - `assets/` This directory contains some icons
    - `styles.scss` The global styles
    - `_matcha.scss` The [matcha](https://github.com/vinceliuice/Matcha-gtk-theme#readme) port
    - `index.html` The index.html file (Includes the Angular root component)
    - `manifest.webmanifest` The Progressive Web App manifest
  - `dist/` Compiler outout; Served by the backend; included in .gitignore
  - `node_modules/` Installed npm dependencies; included in .gitignore
  - `angular.json` The main Angular configuration file
  - `package.json` Declares all frontend dependencies and npm scripts
  - `package-lock.json` An npm-generated file
  - More files generated by the Angular CLI

## Further reading

For information about the backend, see the [backend README.md](/backend/README.md).  
For information about the application as a whole, see the [main README.md](/README.md).
