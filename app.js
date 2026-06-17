/*
App Title: Sudoku
Credits: Tre Thacker
Year Created: 2026
Version: 1.00
Dedication: None
*/

/* <------------------------------------------------
      CHANGELOG

      Version 1.00 - Initial game creation.
   -------------------------------------------------> */

/* <------------------------------------------------
      APPLICATION CONSTANTS
   -------------------------------------------------> */
const APP_TITLE = "Sudoku";
const APP_CREDITS = "Tre Thacker";
const APP_YEAR = "2026";
const APP_VERSION = "1.00";
const APP_DEDICATION = "None";
const DATABASE_NAME = "SudokuDatabase";
const DATABASE_VERSION = 1;
const STATE_STORE_NAME = "gameState";
const SAVE_KEY = "currentSudokuState";
const BOARD_SIZE = 9;
const BOX_SIZE = 3;
const MAX_MISTAKES_BY_DIFFICULTY = {
	easy: 7,
	medium: 5,
	hard: 3
};	
const DIFFICULTY_SETTINGS = {
	easy: 38,
	medium: 46,
	hard: 54
};

/* <------------------------------------------------
      DOM REFERENCES
   -------------------------------------------------> */
const dom = {
	body: document.body,
	playerDisplay: document.getElementById("playerDisplay"),
	playerNameInput: document.getElementById("playerNameInput"),
	savePlayerButton: document.getElementById("savePlayerButton"),
	difficultySelect: document.getElementById("difficultySelect"),
	clockToggle: document.getElementById("clockToggle"),
	mistakesToggle: document.getElementById("mistakesToggle"),
	newGameButton: document.getElementById("newGameButton"),
	themeButtons: document.querySelectorAll(".theme-button"),
	difficultyDisplay: document.getElementById("difficultyDisplay"),
	timerDisplay: document.getElementById("timerDisplay"),
	mistakeDisplay: document.getElementById("mistakeDisplay"),
	sudokuBoard: document.getElementById("sudokuBoard"),
	numberPad: document.getElementById("numberPad"),
	noteModeButton: document.getElementById("noteModeButton"),
	eraseButton: document.getElementById("eraseButton"),
	hintButton: document.getElementById("hintButton"),
	pauseButton: document.getElementById("pauseButton"),
	pauseOverlay: document.getElementById("pauseOverlay"),
	exportBackupButton: document.getElementById("exportBackupButton"),
	importBackupButton: document.getElementById("importBackupButton"),
	importBackupInput: document.getElementById("importBackupInput"),
	optionsButton: document.getElementById("optionsButton"),
	adminButton: document.getElementById("adminButton"),
	helpButton: document.getElementById("helpButton"),
	aboutButton: document.getElementById("aboutButton"),
	statisticsButton: document.getElementById("statisticsButton"),
	modalBackdrop: document.getElementById("modalBackdrop"),
	optionsModal: document.getElementById("optionsModal"),
	adminModal: document.getElementById("adminModal"),
	statisticsModal: document.getElementById("statisticsModal"),
	helpModal: document.getElementById("helpModal"),
	aboutModal: document.getElementById("aboutModal"),
	gameOverModal: document.getElementById("gameOverModal"),
	gameOverMessage: document.getElementById("gameOverMessage"),
	gameOverNewGameButton: document.getElementById("gameOverNewGameButton"),
	gameOverCloseButton: document.getElementById("gameOverCloseButton"),
	aboutContent: document.getElementById("aboutContent")
};

/* <------------------------------------------------
      GAME STATE
   -------------------------------------------------> */
let database = null;
let timerInterval = null;
let selectedCellIndex = null;
let gameState = createDefaultGameState();

/* <------------------------------------------------
      APPLICATION STARTUP
   -------------------------------------------------> */
document.addEventListener("DOMContentLoaded", initializeApplication);

async function initializeApplication() {
	database = await openDatabase();
	bindEventListeners();
	initializeHelpAccordion();
	renderAboutWindow();
	await loadSavedState();

	if (!gameState.solution.length) {
		startNewGame();
		return;
	}

	renderFullInterface();
	startTimer();
}

/* <------------------------------------------------
      DEFAULT STATE
   -------------------------------------------------> */
function createDefaultStatistics() {
	return {
		gamesPlayed: 0,
		gamesWon: 0,
		gamesLost: 0,
		easy: { played: 0, won: 0, lost: 0 },
		medium: { played: 0, won: 0, lost: 0 },
		hard: { played: 0, won: 0, lost: 0 },
		custom: { played: 0, won: 0, lost: 0 },
		fastestEasy: null,
		fastestMedium: null,
		fastestHard: null,
		fastestCustom: null,
		totalCompletionTime: 0,
		hintsUsed: 0,
		mistakesMade: 0,
		validNumbersPlayed: 0,
		totalErasesUsed: 0,
		perfectGames: 0,
		currentWinStreak: 0,
		bestWinStreak: 0
	};
}	 
	 
function createDefaultGameState() {
	return {
		playerName: "Guest",
		theme: "classic",
		difficulty: "medium",
		puzzle: [],
		solution: [],
		entries: Array(81).fill(0),
		notes: Array.from({ length: 81 }, () => []),
		givenCells: Array(81).fill(false),
		selectedCellIndex: null,
		noteMode: false,
		clockEnabled: true,
		mistakesEnabled: true,
		mistakes: 0,
		hintsUsed: 0,
		elapsedSeconds: 0,
		isComplete: false,
		isGameOver: false,
		isPaused: false,
		resultRecorded: false,
		statistics: createDefaultStatistics(),
		startedAt: Date.now(),
		updatedAt: Date.now()
	};
}

/* <------------------------------------------------
      HELP ACCORDION
   -------------------------------------------------> */
function initializeHelpAccordion() {
	const helpSections = document.querySelectorAll("#helpModal details");

	helpSections.forEach((section) => {
		section.addEventListener("toggle", () => {
			if (!section.open) {
				return;
			}

			helpSections.forEach((otherSection) => {
				if (otherSection !== section) {
					otherSection.open = false;
				}
			});
		});
	});
}

/* <------------------------------------------------
      EVENT LISTENERS
   -------------------------------------------------> */
function bindEventListeners() {
	dom.savePlayerButton.addEventListener("click", savePlayerName);
	dom.playerNameInput.addEventListener("keydown", handlePlayerNameKeydown);
	dom.newGameButton.addEventListener("click", startNewGame);
	dom.clockToggle.addEventListener("change", toggleClockSetting);
	dom.mistakesToggle.addEventListener("change", toggleMistakesSetting);
	dom.numberPad.addEventListener("click", handleNumberPadClick);
	dom.noteModeButton.addEventListener("click", toggleNoteMode);
	dom.eraseButton.addEventListener("click", eraseSelectedCell);
	dom.hintButton.addEventListener("click", useHint);
	dom.pauseButton.addEventListener("click", togglePause);
	dom.exportBackupButton.addEventListener("click", exportBackup);
	dom.importBackupButton.addEventListener("click", () => dom.importBackupInput.click());
	dom.importBackupInput.addEventListener("change", importBackup);
	dom.optionsButton.addEventListener("click", () => openModal(dom.optionsModal));
	dom.adminButton.addEventListener("click", () => openModal(dom.adminModal));
	dom.statisticsButton.addEventListener("click", openStatisticsModal);
	dom.helpButton.addEventListener("click", () => openModal(dom.helpModal));
	dom.aboutButton.addEventListener("click", () => openModal(dom.aboutModal));
	dom.gameOverNewGameButton.addEventListener("click", startNewGame);
	dom.gameOverCloseButton.addEventListener("click", closeModals);
	dom.modalBackdrop.addEventListener("click", handleBackdropClick);

	document.querySelectorAll("[data-close-modal]").forEach((button) => {
		button.addEventListener("click", closeModals);
	});

	dom.themeButtons.forEach((button) => {
		button.addEventListener("click", () => setTheme(button.dataset.theme));
	});

	document.addEventListener("keydown", handleKeyboardInput);
}

/* <------------------------------------------------
      DATABASE
   -------------------------------------------------> */
function openDatabase() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

		request.onupgradeneeded = (event) => {
			const db = event.target.result;

			if (!db.objectStoreNames.contains(STATE_STORE_NAME)) {
				db.createObjectStore(STATE_STORE_NAME);
			}
		};

		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

function saveState() {
	gameState.updatedAt = Date.now();

	return new Promise((resolve, reject) => {
		const transaction = database.transaction(STATE_STORE_NAME, "readwrite");
		const store = transaction.objectStore(STATE_STORE_NAME);
		const request = store.put(gameState, SAVE_KEY);

		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}

function loadStateFromDatabase() {
	return new Promise((resolve, reject) => {
		const transaction = database.transaction(STATE_STORE_NAME, "readonly");
		const store = transaction.objectStore(STATE_STORE_NAME);
		const request = store.get(SAVE_KEY);

		request.onsuccess = () => resolve(request.result || null);
		request.onerror = () => reject(request.error);
	});
}

async function loadSavedState() {
	const savedState = await loadStateFromDatabase();

	if (!savedState) {
		return;
	}

	gameState = {
		...createDefaultGameState(),
		...savedState
	};

	selectedCellIndex = gameState.selectedCellIndex;
}

/* <------------------------------------------------
      NEW GAME AND PUZZLE GENERATION
   -------------------------------------------------> */
function startNewGame() {
	const difficulty = dom.difficultySelect.value;
	const solution = generateSolvedBoard();
	const puzzle = createPuzzleFromSolution(solution, DIFFICULTY_SETTINGS[difficulty]);
	const givenCells = puzzle.map((value) => value !== 0);

	stopTimer();

	gameState = {
		...createDefaultGameState(),
		playerName: gameState.playerName,
		theme: gameState.theme,
		clockEnabled: gameState.clockEnabled,
		mistakesEnabled: gameState.mistakesEnabled,
		statistics: gameState.statistics,
		difficulty,
		puzzle,
		solution,
		entries: [...puzzle],
		givenCells,
		startedAt: Date.now()
	};

	selectedCellIndex = null;
	closeModals();
	renderFullInterface();
	startTimer();
	saveState();
}

function generateSolvedBoard() {
	const board = Array(81).fill(0);

	fillBoard(board);
	return board;
}

function fillBoard(board) {
	const emptyIndex = board.findIndex((value) => value === 0);

	if (emptyIndex === -1) {
		return true;
	}

	const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);

	for (const number of numbers) {
		if (isSafeNumber(board, emptyIndex, number)) {
			board[emptyIndex] = number;

			if (fillBoard(board)) {
				return true;
			}

			board[emptyIndex] = 0;
		}
	}

	return false;
}

function createPuzzleFromSolution(solution, cellsToRemove) {
	const puzzle = [...solution];
	const shuffledIndexes = shuffleArray([...Array(81).keys()]);
	let removedCount = 0;

	for (const index of shuffledIndexes) {
		if (removedCount >= cellsToRemove) {
			break;
		}

		puzzle[index] = 0;
		removedCount++;
	}

	return puzzle;
}

function isSafeNumber(board, index, number) {
	const row = Math.floor(index / BOARD_SIZE);
	const column = index % BOARD_SIZE;
	const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
	const boxColumn = Math.floor(column / BOX_SIZE) * BOX_SIZE;

	for (let checkColumn = 0; checkColumn < BOARD_SIZE; checkColumn++) {
		if (board[row * BOARD_SIZE + checkColumn] === number) {
			return false;
		}
	}

	for (let checkRow = 0; checkRow < BOARD_SIZE; checkRow++) {
		if (board[checkRow * BOARD_SIZE + column] === number) {
			return false;
		}
	}

	for (let rowOffset = 0; rowOffset < BOX_SIZE; rowOffset++) {
		for (let columnOffset = 0; columnOffset < BOX_SIZE; columnOffset++) {
			const checkIndex = (boxRow + rowOffset) * BOARD_SIZE + boxColumn + columnOffset;

			if (board[checkIndex] === number) {
				return false;
			}
		}
	}

	return true;
}

function shuffleArray(array) {
	const shuffled = [...array];

	for (let index = shuffled.length - 1; index > 0; index--) {
		const randomIndex = Math.floor(Math.random() * (index + 1));
		[shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
	}

	return shuffled;
}

/* <------------------------------------------------
      RENDERING
   -------------------------------------------------> */
function renderFullInterface() {
	applyTheme();
	renderPlayer();
	renderStatus();
	renderBoard();
	renderNumberPad();
	renderNoteMode();
	renderPauseState();
}

function renderPlayer() {
	dom.playerDisplay.textContent = gameState.playerName;
	dom.playerNameInput.value = gameState.playerName === "Guest" ? "" : gameState.playerName;
}

function renderStatus() {
	dom.difficultySelect.value = gameState.difficulty;
	dom.clockToggle.checked = gameState.clockEnabled;
	dom.mistakesToggle.checked = gameState.mistakesEnabled;
	dom.difficultyDisplay.textContent = getDisplayedDifficulty();
	dom.timerDisplay.textContent = gameState.clockEnabled ? formatTime(gameState.elapsedSeconds) : "Off";
	dom.mistakeDisplay.textContent = gameState.mistakesEnabled ? `${gameState.mistakes} / ${getMaxMistakes()}` : "Off";
}

function renderBoard() {
	dom.sudokuBoard.innerHTML = "";

	for (let index = 0; index < 81; index++) {
		const cell = document.createElement("button");
		cell.className = getCellClassName(index);
		cell.type = "button";
		cell.dataset.index = index;
		cell.setAttribute("aria-label", `Sudoku cell ${index + 1}`);
		cell.addEventListener("click", () => selectCell(index));

		if (gameState.entries[index]) {
			cell.textContent = gameState.entries[index];
		} else if (gameState.notes[index].length) {
			cell.appendChild(createNotesGrid(gameState.notes[index]));
		}

		dom.sudokuBoard.appendChild(cell);
	}
}

function getCellClassName(index) {
	const classes = ["sudoku-cell"];

	if (gameState.givenCells[index]) {
		classes.push("given");
	}

	if (index === selectedCellIndex) {
		classes.push("selected");
	} else if (selectedCellIndex !== null && isRelatedCell(index, selectedCellIndex)) {
		classes.push("related");
	}

	if (!gameState.givenCells[index] && gameState.entries[index] && gameState.entries[index] !== gameState.solution[index]) {
		classes.push("error");
	}

	return classes.join(" ");
}

function createNotesGrid(notes) {
	const notesGrid = document.createElement("div");
	notesGrid.className = "notes-grid";

	for (let number = 1; number <= 9; number++) {
		const note = document.createElement("span");
		note.textContent = notes.includes(number) ? number : "";
		notesGrid.appendChild(note);
	}

	return notesGrid;
}

function renderNumberPad() {
	const buttons = dom.numberPad.querySelectorAll("button");

	buttons.forEach((button) => {
		const number = Number(button.dataset.number);
		const isComplete = countNumberOnBoard(number) >= 9;

		button.disabled = gameState.isComplete || gameState.isGameOver || gameState.isPaused || isComplete;
	});

	dom.hintButton.disabled = gameState.difficulty === "hard" || gameState.isComplete || gameState.isGameOver || gameState.isPaused;
}

function renderNoteMode() {
	dom.noteModeButton.textContent = gameState.noteMode ? "Notes: On" : "Notes: Off";
	dom.noteModeButton.setAttribute("aria-pressed", String(gameState.noteMode));
}

function renderPauseState() {
	dom.pauseButton.textContent = gameState.isPaused ? "Resume" : "Pause";
	dom.pauseOverlay.classList.toggle("hidden", !gameState.isPaused);
}

function renderAboutWindow() {
	dom.aboutContent.innerHTML = `
		<p><strong>App Title:</strong> ${APP_TITLE}</p>
		<p><strong>Credits:</strong> ${APP_CREDITS}</p>
		<p><strong>Year Created:</strong> ${APP_YEAR}</p>
		<p><strong>Version:</strong> ${APP_VERSION}</p>
	`;
}

function renderStatistics() {
	const stats = gameState.statistics;
	const winPercentage = stats.gamesPlayed ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;

	document.getElementById("statsGamesPlayed").textContent = stats.gamesPlayed;
	document.getElementById("statsGamesWon").textContent = stats.gamesWon;
	document.getElementById("statsGamesLost").textContent = stats.gamesLost;
	document.getElementById("statsWinPercentage").textContent = `${winPercentage}%`;

	document.getElementById("statsEasyRecord").textContent = formatDifficultyRecord(stats.easy);
	document.getElementById("statsMediumRecord").textContent = formatDifficultyRecord(stats.medium);
	document.getElementById("statsHardRecord").textContent = formatDifficultyRecord(stats.hard);
	document.getElementById("statsCustomRecord").textContent = formatDifficultyRecord(stats.custom);

	document.getElementById("statsFastestEasy").textContent = formatBestTime(stats.fastestEasy);
	document.getElementById("statsFastestMedium").textContent = formatBestTime(stats.fastestMedium);
	document.getElementById("statsFastestHard").textContent = formatBestTime(stats.fastestHard);
	document.getElementById("statsFastestCustom").textContent = formatBestTime(stats.fastestCustom);
	document.getElementById("statsAverageTime").textContent = stats.gamesWon ? formatTime(Math.round(stats.totalCompletionTime / stats.gamesWon)) : "--:--";

	document.getElementById("statsHintsUsed").textContent = stats.hintsUsed;
	document.getElementById("statsMistakesMade").textContent = stats.mistakesMade;
	document.getElementById("statsValidNumbersPlayed").textContent = stats.validNumbersPlayed;
	document.getElementById("statsTotalErasesUsed").textContent = stats.totalErasesUsed;
	document.getElementById("statsPerfectGames").textContent = stats.perfectGames;

	document.getElementById("statsCurrentWinStreak").textContent = stats.currentWinStreak;
	document.getElementById("statsBestWinStreak").textContent = stats.bestWinStreak;
}

/* <------------------------------------------------
      PLAYER AND THEME
   -------------------------------------------------> */
function savePlayerName() {
	const trimmedName = dom.playerNameInput.value.trim();

	gameState.playerName = trimmedName || "Guest";
	renderPlayer();
	saveState();
}

function handlePlayerNameKeydown(event) {
	if (event.key === "Enter") {
		savePlayerName();
	}
}

function toggleClockSetting() {
	gameState.clockEnabled = dom.clockToggle.checked;

	if (gameState.clockEnabled) {
		startTimer();
	} else {
		stopTimer();
	}

	renderStatus();
	saveState();
}

function toggleMistakesSetting() {
	gameState.mistakesEnabled = dom.mistakesToggle.checked;
	renderStatus();
	saveState();
}

function setTheme(theme) {
	gameState.theme = theme;
	applyTheme();
	saveState();
}

function applyTheme() {
	dom.body.classList.remove("theme-ocean", "theme-sunset");

	if (gameState.theme !== "classic") {
		dom.body.classList.add(`theme-${gameState.theme}`);
	}

	dom.themeButtons.forEach((button) => {
		button.classList.toggle("active", button.dataset.theme === gameState.theme);
	});
}

/* <------------------------------------------------
      GAME INPUT
   -------------------------------------------------> */
function selectCell(index) {
	if (gameState.isComplete || gameState.isGameOver || gameState.isPaused || gameState.givenCells[index]) {
		return;
	}

	selectedCellIndex = index;
	gameState.selectedCellIndex = index;
	renderBoard();
	saveState();
}

function handleNumberPadClick(event) {
	const button = event.target.closest("button");

	if (!button) {
		return;
	}

	enterNumber(Number(button.dataset.number));
}

function handleKeyboardInput(event) {
	if (event.key >= "1" && event.key <= "9") {
		enterNumber(Number(event.key));
		return;
	}

	if (event.key === "Backspace" || event.key === "Delete" || event.key === "0") {
		eraseSelectedCell();
		return;
	}

	if (event.key.toLowerCase() === "n") {
		toggleNoteMode();
	}
}

function enterNumber(number) {
	if (selectedCellIndex === null || gameState.isComplete || gameState.isGameOver || gameState.isPaused || gameState.givenCells[selectedCellIndex]) {
		return;
	}

	if (gameState.noteMode) {
		toggleNote(selectedCellIndex, number);
		return;
	}

	gameState.entries[selectedCellIndex] = number;
	gameState.notes[selectedCellIndex] = [];

	if (number !== gameState.solution[selectedCellIndex]) {
		if (gameState.mistakesEnabled) {
			gameState.mistakes++;
			gameState.statistics.mistakesMade++;
		}
	} else {
		gameState.statistics.validNumbersPlayed++;
		clearMatchingNotes(selectedCellIndex, number);
	}

	checkCompletion();
	renderFullInterface();
	saveState();
}

function toggleNote(index, number) {
	if (gameState.entries[index]) {
		return;
	}

	if (gameState.notes[index].includes(number)) {
		gameState.notes[index] = gameState.notes[index].filter((note) => note !== number);
	} else {
		gameState.notes[index].push(number);
		gameState.notes[index].sort((a, b) => a - b);
	}

	renderBoard();
	saveState();
}

function eraseSelectedCell() {
	if (selectedCellIndex === null || gameState.givenCells[selectedCellIndex] || gameState.isComplete || gameState.isGameOver || gameState.isPaused) {
		return;
	}

	gameState.entries[selectedCellIndex] = 0;
	gameState.notes[selectedCellIndex] = [];
	gameState.statistics.totalErasesUsed++;
	renderFullInterface();
	saveState();
}

function toggleNoteMode() {
	gameState.noteMode = !gameState.noteMode;
	renderNoteMode();
	saveState();
}

function useHint() {
	const emptyIndexes = gameState.entries
		.map((value, index) => value === 0 ? index : null)
		.filter((index) => index !== null);

	if (!emptyIndexes.length || gameState.isComplete || gameState.isGameOver || gameState.isPaused || gameState.difficulty === "hard") {
		return;
	}

	const hintIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
	gameState.entries[hintIndex] = gameState.solution[hintIndex];
	gameState.notes[hintIndex] = [];
	gameState.hintsUsed++;
	gameState.statistics.hintsUsed++;
	selectedCellIndex = hintIndex;
	gameState.selectedCellIndex = hintIndex;

	checkCompletion();
	renderFullInterface();
	saveState();
}

function togglePause() {
	if (gameState.isComplete || gameState.isGameOver) {
		return;
	}

	gameState.isPaused = !gameState.isPaused;

	if (gameState.isPaused) {
		stopTimer();
	} else {
		startTimer();
	}

	renderFullInterface();
	saveState();
}

/* <------------------------------------------------
      GAME LOGIC HELPERS
   -------------------------------------------------> */
function isRelatedCell(indexA, indexB) {
	const rowA = Math.floor(indexA / BOARD_SIZE);
	const columnA = indexA % BOARD_SIZE;
	const rowB = Math.floor(indexB / BOARD_SIZE);
	const columnB = indexB % BOARD_SIZE;
	const boxA = Math.floor(rowA / BOX_SIZE) * BOX_SIZE + Math.floor(columnA / BOX_SIZE);
	const boxB = Math.floor(rowB / BOX_SIZE) * BOX_SIZE + Math.floor(columnB / BOX_SIZE);

	return rowA === rowB || columnA === columnB || boxA === boxB;
}

function clearMatchingNotes(index, number) {
	gameState.notes = gameState.notes.map((notes, noteIndex) => {
		if (isRelatedCell(index, noteIndex)) {
			return notes.filter((note) => note !== number);
		}

		return notes;
	});
}

function checkCompletion() {
	if (gameState.mistakesEnabled && gameState.mistakes >= getMaxMistakes()) {
		triggerGameOver();
		return;
	}

	const isSolved = gameState.entries.every((value, index) => value === gameState.solution[index]);

	if (isSolved) {
		gameState.isComplete = true;
		stopTimer();
		recordGameResult("win");
		alert(`Great job, ${gameState.playerName}! Puzzle completed.`);
	}
}

function triggerGameOver() {
	gameState.isGameOver = true;
	stopTimer();
	recordGameResult("loss");

	// Future achievements and coin hooks will connect here.
	dom.gameOverMessage.textContent = "You have reached the maximum mistake limit for this game.";

	renderFullInterface();
	openModal(dom.gameOverModal);
	saveState();
}

function recordGameResult(result) {
	if (gameState.resultRecorded) {
		return;
	}

	const mode = getDisplayedDifficulty().toLowerCase();
	const stats = gameState.statistics;

	gameState.resultRecorded = true;
	stats.gamesPlayed++;

	if (stats[mode]) {
		stats[mode].played++;
	}

	if (result === "win") {
		stats.gamesWon++;
		stats.currentWinStreak++;
		stats.bestWinStreak = Math.max(stats.bestWinStreak, stats.currentWinStreak);
		stats.totalCompletionTime += gameState.elapsedSeconds;

		if (stats[mode]) {
			stats[mode].won++;
		}

		if (gameState.mistakes === 0) {
			stats.perfectGames++;
		}

		updateFastestTime(mode);
		return;
	}

	stats.gamesLost++;
	stats.currentWinStreak = 0;

	if (stats[mode]) {
		stats[mode].lost++;
	}
}

function countNumberOnBoard(number) {
	return gameState.entries.filter((value) => value === number).length;
}

function getMaxMistakes() {
	return MAX_MISTAKES_BY_DIFFICULTY[gameState.difficulty];
}

function getDisplayedDifficulty() {
	if (!gameState.clockEnabled || !gameState.mistakesEnabled) {
		return "Custom";
	}

	return capitalizeFirstLetter(gameState.difficulty);
}

function updateFastestTime(mode) {
	const fastestKey = `fastest${capitalizeFirstLetter(mode)}`;

	if (gameState.statistics[fastestKey] === null || gameState.elapsedSeconds < gameState.statistics[fastestKey]) {
		gameState.statistics[fastestKey] = gameState.elapsedSeconds;
	}
}

/* <------------------------------------------------
      TIMER
   -------------------------------------------------> */
function startTimer() {
	stopTimer();

	if (gameState.isComplete || gameState.isGameOver || gameState.isPaused || !gameState.clockEnabled) {
		return;
	}

	timerInterval = setInterval(() => {
		gameState.elapsedSeconds++;
		dom.timerDisplay.textContent = formatTime(gameState.elapsedSeconds);
		saveState();
	}, 1000);
}

function stopTimer() {
	if (timerInterval) {
		clearInterval(timerInterval);
		timerInterval = null;
	}
}

function formatTime(totalSeconds) {
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;

	return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatBestTime(seconds) {
	return seconds === null ? "--:--" : formatTime(seconds);
}

function formatDifficultyRecord(record) {
	return `${record.played} played / ${record.won} won / ${record.lost} lost`;
}

/* <------------------------------------------------
      BACKUP SYSTEM
   -------------------------------------------------> */
function getLocalBackupDateStamp() {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

function getLocalBackupTimestamp() {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");
	const hours = String(now.getHours()).padStart(2, "0");
	const minutes = String(now.getMinutes()).padStart(2, "0");
	const seconds = String(now.getSeconds()).padStart(2, "0");

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}	 
	 
function createBackupData() {
	return {
		appTitle: APP_TITLE,
		appVersion: APP_VERSION,
		backupVersion: APP_VERSION,
		exportedAt: getLocalBackupTimestamp(),
		gameState
	};
}

function exportBackup() {
	const backupData = createBackupData();
	const backupBlob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
	const backupUrl = URL.createObjectURL(backupBlob);
	const downloadLink = document.createElement("a");

	downloadLink.href = backupUrl;
	downloadLink.download = `Sudoku_Backup_${getLocalBackupDateStamp()}.json`;
	downloadLink.click();

	URL.revokeObjectURL(backupUrl);
}

function importBackup(event) {
	const file = event.target.files[0];

	if (!file) {
		return;
	}

	const reader = new FileReader();

	reader.onload = async () => {
		try {
			const backupData = JSON.parse(reader.result);

			if (
				!backupData ||
				typeof backupData !== "object" ||
				!backupData.gameState ||
				backupData.appTitle !== APP_TITLE
			) {
				alert("This does not appear to be a valid Sudoku backup file.");
				return;
			}

			if (backupData.backupVersion !== APP_VERSION) {
				alert(
					`This backup was created with version ${backupData.backupVersion || "Unknown"}, but this app is version ${APP_VERSION}. Import was canceled to protect your game data.`
				);
				return;
			}

			stopTimer();
			if (
				!Array.isArray(backupData.gameState.entries) ||
				!Array.isArray(backupData.gameState.solution) ||
				!Array.isArray(backupData.gameState.givenCells)
			) {
				alert("Backup file is missing required game data.");
				return;
			}

			gameState = {
				...createDefaultGameState(),
				...backupData.gameState
			};
			selectedCellIndex = gameState.selectedCellIndex;
			renderFullInterface();
			startTimer();
			await saveState();
			alert("Backup imported successfully.");
		} catch (error) {
			alert("The backup file could not be imported.");
		} finally {
			dom.importBackupInput.value = "";
		}
	};

	reader.readAsText(file);
}

/* <------------------------------------------------
      MODAL WINDOWS
   -------------------------------------------------> */
function openStatisticsModal() {
	renderStatistics();
	openModal(dom.statisticsModal);
} 
	 
function openModal(modal) {
	closeModals();
	dom.modalBackdrop.classList.remove("hidden");
	modal.classList.remove("hidden");
}

function closeModals() {
	dom.modalBackdrop.classList.add("hidden");
	dom.optionsModal.classList.add("hidden");
	dom.adminModal.classList.add("hidden");
	dom.statisticsModal.classList.add("hidden");
	dom.helpModal.classList.add("hidden");
	dom.aboutModal.classList.add("hidden");
	dom.gameOverModal.classList.add("hidden");
}

function handleBackdropClick(event) {
	if (event.target === dom.modalBackdrop) {
		closeModals();
	}
}

/* <------------------------------------------------
      GENERAL HELPERS
   -------------------------------------------------> */
function capitalizeFirstLetter(text) {
	return text.charAt(0).toUpperCase() + text.slice(1);
}
