/*
This is a replication of the original 'Worlde' game. The original was created entirely by Josh Wardle.
*/

const keyboardGrid = document.querySelector(".keyboard-container"); 
const keys = document.querySelectorAll(".keyboard-container .key");
let attemptNumber = 1;
let letterNumber = 0;
let correctWord = "";
let guessWord = "";


setKeyEvents()
createCorrectWord();
console.log(`The correct word is: ${correctWord}`);

/*
Set up events for the keys on the keyboard
*/
function setKeyEvents() {

    keys.forEach(key => {

        key.addEventListener("click", pressKey);
    })

}

/*
WRTIE DESCRIPTION
*/
function createCorrectWord() {

    let wordArray = ["THORN","PIOUS","ADIEU","CRANE","ANIME","EARTH","PLOTS","SCORN","RAINY","QUERY"];
    let randomIndex = Math.floor(Math.random() * wordArray.length);
    correctWord = wordArray[randomIndex];

}

/*
Colors the given key on the keyboard the given color
*/
function colorKey(color,key) {

    let keyClass = ".key-" + key.toUpperCase();
    const keyDisplay = document.querySelector(keyClass);
    switch(color) {

        case "green":
            keyDisplay.classList.add("key-green");
            break;
        case "yellow":
            keyDisplay.classList.add("key-yellow");
            break;
        case "gray":
            keyDisplay.classList.add("key-gray");
            break;
    }
}

/*
Color all of the letters of the current attempt correctly, and color the appropriate keyboard letters.
- If the letter is in the right spot, it is colored green.
- Otherwise if the letter is in the wrong spot but still correct, it is colored yellow.
- If the letter does not exist, it is colored gray.
*/
function colorLetters() {

    let correctLettersArray = [];
    let keysArray = Array.from(keys);
    for (let i = 0; i < correctWord.length; i++) {

        correctLettersArray[i] = correctWord[i];
    }

    let attemptClass = ".attempt-" + attemptNumber;
    let letters = document.querySelectorAll(attemptClass + " .letter");
    let lettersArray = Array.from(letters);
    
    for (let i = 0; i < guessWord.length; i++) {
        
        if (guessWord[i] == correctWord[i]) { //guess and correct letter match
            
            lettersArray[i].classList.add("correct-place");
            colorKey("green",guessWord[i]);
            correctLettersArray[i] = "#"; //get rid of this character from the correct letters array
                                          //and replace it so that the index doesn't change
        }
        else if (correctLettersArray.includes(guessWord[i])) { //the guess letter is in the wrong place

            let guessIndex = correctLettersArray.indexOf(guessWord[i]);
            if (correctWord[guessIndex] == guessWord[guessIndex]) { //check if the letter matches later on

                lettersArray[i].classList.add("incorrect");
                continue;
            }
            correctLettersArray[guessIndex] = "#"; //replace that letter with a filler
            colorKey("yellow",guessWord[i]);
            lettersArray[i].classList.add("wrong-place");
        }
        else { //guess letter not in correct word

            colorKey("gray",guessWord[i]);
            lettersArray[i].classList.add("incorrect"); 
        }
    }

}

/*
Ends the game
    - Remove pressKey event listeners.
    - If game was won, congratulate user, otherwise reveal the correct word.
*/
function endGame(gameWon) {

    keys.forEach(key => { //remove the event listeners from the keyboard keys

        key.removeEventListener("click", pressKey);
    })

    if (gameWon) {

        alert(`Congratulations! You guessed correctly in ${attemptNumber} guesses!`);
    }
    else {

        alert(`Better luck next time! The word was ${correctWord}`);
    }
}

/*
Compares the guessWord to the correctWord. 
 - If the guessWord and correctWord are the same then all letters turn green and the game 
   ends with a win.
 - Otherwise letters in the correct spot are turned green and correct letters
   not in the right spot are turned yellow. If the number of attempts > 6,
   then the game ends with a loss. Otherwise, increment attemptNumber, reset letterNumber 
   and clear guessWord.
*/
function checkAnswer() {

    colorLetters();

    if (guessWord == correctWord) {

        endGame(true);
    }

    if (attemptNumber >= 6) {

        endGame(false); //End the game with a loss
    }

    letterNumber = 0;
    attemptNumber++;
    guessWord = "";

}

/*
Update the board with the given value in the correct position
*/
function updateBoard(keyVal) {

    let attemptClass = ".attempt-" + attemptNumber;
    let letterClass = ".letter-" + letterNumber;
    let letterDisplay = document.querySelector(`${attemptClass} ${letterClass}`);


    if (keyVal === "Ba") {

        letterDisplay.textContent = "";
    }
    else {
    
    letterDisplay.textContent = keyVal;
    }
}

/*
What happens when a key is pressed
 - The content of the key is added to the guess
 - The key's letter is added to the attempt board
*/
function pressKey() {

    if (this.classList.contains("key-backspace")) { //key is backspace

        if (guessWord.length <= 0) { //do nothing if guessWord is empty

            alert("You haven't entered anything yet!");
            return;
        }

        guessWord = guessWord.slice(0, -1); //remove the last character
        updateBoard("Ba");
        letterNumber--;
    }
    else if (this.classList.contains("key-enter")) { //key is enter

        if (guessWord.length != 5) { //do nothing if not 5 letters long

            alert("Not enough letters!")
            return;
        }
        else {

            checkAnswer();
        }
    }
    else if (guessWord.length >= 5) {

        alert("Can't add more letters!");
        return;
    } else { //key is not backspace or enter
    let keyVal = this.textContent;
    guessWord += keyVal;
    letterNumber++;
    updateBoard(keyVal);
    }



}