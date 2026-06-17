[![GitHub repo size](https://img.shields.io/github/repo-size/Jacoblearncode/SkillBridge)](https://github.com/Jacoblearncode/SkillBridge)

# SkillBridge — Find Skills & Get Help

SkillBridge connects people who need help with those who can provide it nearby. Flexible tasks, skill exchanges, and real-world community help.

- Live demo: https://jacoblearncode.github.io/SkillBridge/ (if enabled)

### Demo Screenshots

![SkillBridge Desktop Demo](./readme-images/desktop.png "Desktop Demo")

### Prerequisites

- Git must be installed. See https://git-scm.com/downloads
- (Optional) `node` / `npm` or Python 3 for running a simple local server

### Run locally — step by step

1) Clone the repository

```bash
git clone https://github.com/Jacoblearncode/SkillBridge.git
cd SkillBridge
```

2) Quick preview (open file)

- On Windows or macOS, you can simply open `index.html` in your browser (double-click). This works for most static pages.

3) Recommended: run a local static server (keeps routes and assets working correctly)

- Using Python 3 (cross-platform):

```bash
python -m http.server 8000
# then open http://localhost:8000 in your browser
```

- Using Node (npx serve):

```bash
npx serve . -l 8000
# or: npx http-server . -p 8000
```

- Using Live Server extension in VS Code:

  - Open the folder in VS Code: `File → Open Folder...` → select the `SkillBridge` folder.
  - Install and enable the Live Server extension, then click `Go Live` in the status bar.

4) View the site

- Open `http://localhost:8000` (or the port shown by your server) in your browser.

### Development notes

- The project is static HTML/CSS/JS located at the repository root. No build step required.
- If you modify files, refresh the browser or use Live Server for auto-reload.

### License

This project is available under the MIT License — see the `LICENSE` file.

### Contact

Find me on GitHub: https://github.com/Jacoblearncode

If you'd like any specific README content (badges, additional screenshots, or deployment instructions), tell me what to include and I'll update it.
