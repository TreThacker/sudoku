# 🎯 Sudoku

A modern, feature-rich Sudoku game built with HTML, CSS, and JavaScript.

Designed for desktop and tablet play, Sudoku includes multiple difficulty levels, statistics tracking, automatic saving, backup management, customizable themes, and a clean responsive interface.

---

## 📋 Overview

Sudoku is a browser-based puzzle game that automatically saves your progress and restores your game after refreshing the page. The game supports multiple difficulty levels, customizable gameplay options, detailed statistics tracking, and backup import/export capabilities.

---

## ✨ Features

### 🎮 Gameplay

* Easy, Medium, and Hard difficulty levels
* Random puzzle generation
* Automatic puzzle validation
* Notes mode
* Hint system
* Pause and Resume functionality
* Keyboard support
* Mouse and touch support

### ⚙️ Customizable Options

* Custom player name
* Clock On / Off
* Mistakes On / Off
* Automatic Custom difficulty detection
* Three visual themes:

  * Classic
  * Ocean
  * Sunset

### 📊 Statistics Tracking

Tracks lifetime statistics including:

* Games Played
* Games Won
* Games Lost
* Win Percentage
* Difficulty Records
* Fastest Completion Times
* Average Completion Time
* Hints Used
* Mistakes Made
* Valid Numbers Played
* Total Erases Used
* Perfect Games
* Current Win Streak
* Best Win Streak

### 💾 Save System

* Automatic saving
* Browser refresh recovery
* IndexedDB storage
* Full game state restoration

### 📦 Backup System

* Export backup files
* Import backup files
* Version validation protection
* Backup corruption checks
* Local timestamped backup creation

---

# 🎯 Difficulty Levels

| Difficulty | Maximum Mistakes | Hint Available      |
| ---------- | ---------------- | ------------------- |
| Easy       | 7                | Yes                 |
| Medium     | 5                | Yes                 |
| Hard       | 3                | No                  |
| Custom     | User Defined     | Depends on Settings |

### Custom Mode

The game automatically switches to **Custom** when either:

* Clock is disabled
* Mistakes are disabled

---

# 🎮 Controls

## Mouse / Touch Controls

| Action       | Description            |
| ------------ | ---------------------- |
| Select Cell  | Click or tap a cell    |
| Enter Number | Click a number button  |
| Notes Mode   | Toggle Notes button    |
| Erase        | Remove selected value  |
| Hint         | Fill one correct value |
| Pause        | Pause the game         |
| Options      | Open settings window   |

---

## Keyboard Controls

| Key       | Action              |
| --------- | ------------------- |
| 1 - 9     | Enter number        |
| Backspace | Erase selected cell |
| Delete    | Erase selected cell |
| 0         | Erase selected cell |
| N         | Toggle Notes Mode   |

---

# 🏆 Game Over Rules

When Mistakes are enabled:

* Easy allows up to 7 mistakes
* Medium allows up to 5 mistakes
* Hard allows up to 3 mistakes

Upon reaching the mistake limit:

* Game enters Game Over state
* Board becomes read-only
* Timer stops
* Loss is recorded in statistics
* Player may start a new game or close the Game Over window

---

# 💾 Backup Files

## Exporting

1. Open **Options**
2. Select **Admin**
3. Click **Export Backup**

A backup file will be downloaded automatically.

---

## Importing

1. Open **Options**
2. Select **Admin**
3. Click **Import Backup**
4. Select a valid backup file

---

## Backup Validation

Sudoku validates backup files before importing.

Validation checks include:

* Correct application name
* Matching game version
* Required game data
* Proper backup structure

Invalid or mismatched backups are blocked to protect game data.

---

# 🖥️ Local Installation

No installation is required.

### Option 1

Download all project files and open:

```text
index.html
```

in your web browser.

### Option 2

Host the files on a local web server.

Examples:

```text
VS Code Live Server
Python HTTP Server
XAMPP
WAMP
```

---

# 🌐 GitHub Pages Deployment

1. Upload all project files to your GitHub repository.
2. Open repository Settings.
3. Select **Pages**.
4. Under **Build and Deployment**, select:

```text
Deploy from Branch
```

5. Choose:

```text
main
/root
```

6. Save changes.

GitHub will generate a public site.

### Live URL

Replace the placeholder below after deployment:

```text
https://YOUR-GITHUB-PAGES-URL-HERE
```

---

# 📱 Install As An App

## Windows (Chrome)

1. Open Sudoku in Chrome.
2. Click the Install icon in the address bar.
3. Click **Install**.

Sudoku will appear as a desktop application.

---

## Windows (Microsoft Edge)

1. Open Sudoku in Edge.
2. Click:

```text
Settings
Apps
Install this site as an app
```

3. Click **Install**.

Sudoku will launch like a native application.

---

## iPhone / iPad (Safari)

1. Open Sudoku in Safari.
2. Tap the **Share** button.
3. Select:

```text
Add to Home Screen
```

4. Tap **Add**.

Sudoku will appear on the Home Screen and launch in full-screen mode.

---

# 📁 Project Structure

```text
/
│
├── index.html
├── styles.css
├── app.js
├── manifest.json
├── favicon.ico
│
├── image/
│   └── icon/
│       ├── icon-16.png
│       ├── icon-32.png
│       ├── icon-180.png
│       ├── icon-192.png
│       └── icon-512.png
│
└── README.md
```

---

# 📦 Version Information

| Item    | Value   |
| ------- | ------- |
| Version | 1.00    |
| Status  | Release |
| Year    | 2026    |

---

# 👨‍💻 Credits

**Author:** Tre Thacker

Created in 2026.

---

# 📄 License

Tre Thacker ~ 2026
