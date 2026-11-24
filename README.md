# JAGIVERSE — Birthday Edition (Phase 1)

A static HTML/CSS/JavaScript friendship website for Madhu / Jagiya. Built for GitHub Pages.

## Preview locally
1. Download and unzip the project.
2. Open `index.html` in a browser.
3. Entrance passphrase: `JAGIYA` (change it in `script.js`).

For the most reliable preview, use VS Code with the Live Server extension, or run:
`python -m http.server 8000`
Then open `http://localhost:8000`.

## Publish on GitHub Pages
1. Create a GitHub repository (for example `jagiverse`).
2. Upload `index.html`, `styles.css`, `script.js`, and the `assets` folder to the repository root.
3. In Settings → Pages, select Deploy from a branch, choose `main` and `/ (root)`, then Save.
4. GitHub Pages will provide the public website URL.

## Personalise the entrance
Open `script.js` and change:
`const ACCESS_CODE = "JAGIYA";`
This is only a client-side entrance. The code is visible in the website's source and is NOT real security. Do not place private/confidential content behind it.

## Add your own voice recordings
1. Put audio files in `assets/audio/`, for example:
   - `birthday.mp3`
   - `sad.mp3`
   - `happy.mp3`
   - `lonely.mp3`
   - `hug.mp3`
   - `proud.mp3`
   - `sleep.mp3`
   - `need.mp3`
2. In `script.js`, find `const audioFiles` and set the matching path, e.g.:
   `birthday: "assets/audio/birthday.mp3"`
3. Save and refresh. Native browser audio controls will appear when a path is supplied.

## Scrapbook photos and memories
The memory museum works without photos. Use **Add a memory** to create/edit pages and optionally select a photo. Memory text and selected photos are saved in this browser's localStorage. This is browser/device-local storage, not cloud sync. Keep a copy of your photos separately.

For photos you want to serve directly from GitHub Pages, place them in `assets/photos/` and use relative paths in the memory photo field in a future edit, or choose a photo with the Add/Edit Memory picker (which stores it in localStorage).

## Annual birthday book
2026, 2027 and 2028 are included, with future years available in the selector. Entries are saved under their year and do not overwrite other chapters. The website uses this browser's localStorage; export/backup or copy the data before clearing browser data or changing devices.

## Current phase
Phase 1 includes the birthday opening, birthday letter, confetti, seven emotional rooms, hug and proud interactions, open-when letters, play zone, editable scrapbook placeholders, annual birthday chapters, and audio slots. The timeline has starter copy and can be personalised further. Add real photos and your voice recordings when ready.

## Notes
- No external framework or paid backend is required.
- Google Fonts are loaded online; system fallbacks are provided.
- The password screen is a playful client-side gate, not authentication.
- localStorage data stays in the visitor's browser and does not automatically sync between devices.
