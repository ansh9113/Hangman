document.addEventListener('DOMContentLoaded', () => {
    // Object for word and hint
    const wordList = [
        { word: "html", hint: "Markup language for structuring web pages" },
        { word: "css", hint: "Stylesheet language for designing web pages" },
        { word: "javascript", hint: "Language for adding interactivity to websites" },
        { word: "react", hint: "Library for building user interfaces" },
        { word: "node", hint: "JavaScript runtime for backend development" },
        { word: "express", hint: "Backend framework for Node.js" },
        { word: "tailwind", hint: "Utility-first CSS framework" },
        { word: "mongodb", hint: "NoSQL database for storing data" },
    ];

    let selectedWordObject;
    let guessedLetters = [];       // Array to store guessed letters
    let incorrectGuesses = 0;      // Track the number of incorrect guesses
    const maxGuesses = 6;           // Maximum incorrect guesses

    const wordDisplay = document.querySelector('.word-display');
    const guessesText = document.querySelector('.guesses-text b');
    const hangmanImage = document.querySelector('.hangman-box img');
    const gameModel = document.querySelector('.game-model');
    const playAgainBtn = document.querySelector('.play-again');
    const gameOverImg = document.querySelector('.game-model img'); 
    const keyboardButtons = document.querySelectorAll('.keyboard button');
    const hintText = document.querySelector('.hint-text b');

    // Check if the necessary elements are found
    if (!hangmanImage || !gameOverImg || !gameModel) {
        console.error("One or more required elements are missing.");
        return; // Exit early if elements are not found
    }

    // Initial hangman image
    hangmanImage.src = "images/hangman-0.svg";

    // Function to get a random word from the word list
    function getRandomWord() {
        const randomIndex = Math.floor(Math.random() * wordList.length);
        selectedWordObject = wordList[randomIndex];
        hintText.textContent = selectedWordObject.hint; // Display the hint
        return selectedWordObject.word;
    }

    const wordToGuess = getRandomWord();  // The word to guess
    console.log(`The word to guess is: ${wordToGuess}`);  // You can remove this line in production

    // Function to update the word display
    function updateWordDisplay() {
        wordDisplay.innerHTML = ''; // Clear current word display
        wordToGuess.split('').forEach((letter) => {
            const li = document.createElement('li');
            li.classList.add('letter');
            if (guessedLetters.includes(letter)) {
                li.textContent = letter;
                li.classList.add('guessed');
            } else {
                li.textContent = '';
            }
            wordDisplay.appendChild(li);
        });
    }

    // Function to handle key press (for both keyboard and button clicks)
    function handleLetterGuess(letter) {
        if (guessedLetters.includes(letter)) return; // Ignore if already guessed
        guessedLetters.push(letter);

        // Check if guessed letter is in the word
        if (wordToGuess.includes(letter)) {
            updateWordDisplay();
        } else {
            incorrectGuesses++;
            guessesText.textContent = `${incorrectGuesses} / ${maxGuesses}`;
            hangmanImage.src = `images/hangman-${incorrectGuesses}.svg`;
        }

        // Check if the game is over (incorrect guesses reached max limit)
        if (incorrectGuesses >= maxGuesses) {
            gameOver("lost");
        }

        // Check if the player has won (all unique letters have been guessed correctly)
        const uniqueLetters = [...new Set(wordToGuess.split(''))]; // Get unique letters in the word
        if (uniqueLetters.every(letter => guessedLetters.includes(letter))) {
            gameOver("won");
        }
    }

    // Function to display game over or win screen
    function gameOver(status) {
        gameModel.style.display = 'flex';
        if (status === "won") {
            gameOverImg.src = "images/victory.gif";
            gameModel.querySelector('h4').textContent = "You Win!";
        } else {
            gameOverImg.src = "images/lost.gif";
            gameModel.querySelector('h4').textContent = "Game Over!";
        }
        gameModel.querySelector('p').innerHTML = `The correct word was: <b>${wordToGuess}</b>`;
    }

    // Play Again button functionality
    playAgainBtn.addEventListener('click', () => {
        guessedLetters = [];
        incorrectGuesses = 0;
        hangmanImage.src = "images/hangman-0.svg";
        guessesText.textContent = `0 / ${maxGuesses}`;
        gameModel.style.display = 'none';
        // Get a new word and hint for the next round
        const newWord = getRandomWord();
        console.log(`The new word to guess is: ${newWord}`);
        updateWordDisplay();
    });

    // Listen for keypress events on the keyboard (for physical keyboard)
    window.addEventListener('keydown', (event) => {
        const letter = event.key.toLowerCase();
        if (event.keyCode >= 65 && event.keyCode <= 90) {  // Check if it's a valid alphabet
            handleLetterGuess(letter);
        }
    });

    // Add click event listeners for the on-screen keyboard buttons
    keyboardButtons.forEach(button => {
        button.addEventListener('click', () => {
            const letter = button.textContent.toLowerCase();
            handleLetterGuess(letter);
        });
    });

    // Initial word display
    updateWordDisplay();
});
