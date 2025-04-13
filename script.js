
let words = [ 
"dog","cat","danger","happy","courage","epiphany","monster","spontaneous","had","concatination","sigma","shampoo","rat","disease","entrepreneur","live","digital","media","and","design","schizophrenia","gone","enter","hieroglyphics","bin","phone","technology","heart","what","bird","zucchini","red","river","college","mentor","cartoon","alien","apple","rot","gain","brush","hat","mental","table","outlet","ginger","donkey","listen","movie","remember","music","christmas","entrepreneur","live","digital","media","and","design","schizophrenia","gone","enter","hieroglyphics","bin","phone","technology","heart","what","bird","zucchini","red","river","college","mentor","cartoon","alien","apple","rot","gain","brush","hat","mental","table","outlet","ginger","donkey","listen","movie","remember","music","christmas"
];
let wordIndex = 0;
let timeLeft = 2; 
let characterHp = 200; 
let monsterHp = 200; 
let characterDamage = document.querySelector(".character");
let characterSprite = document.querySelector(".character-sprite")
let monsterDamage = document.querySelector(".monster");
let monsterSprite = document.querySelector(".monster-sprite")
let timer;
let wordDisplay = document.getElementById("word");
let inputField = document.getElementById("input");
let timerDisplay = document.getElementById("timer");
let message = document.getElementById("message");
let resetBtn = document.getElementById("reset-button")
let startButton = document.getElementById("start-btn");
let characterHpBar = document.getElementById("character-hp-bar");
let monsterHpBar = document.getElementById("monster-hp-bar");
let resetButton = document.getElementById("reset-button");
let score = 0;
let isGameOver = false;
// AUDIO

const monsterAttackAudio = new Audio('AUDIO/monster-hit.mp3');
const bgMusic = new Audio('AUDIO/BG.mp3');
const victory = new Audio('AUDIO/victory.mp3');
const perfectAudio = new Audio('AUDIO/perfect.mp3');
const gameOverAudio = new Audio('AUDIO/gameover.mp3');
const charAttackAudio = new Audio('AUDIO/char-hit.mp3');

monsterAttackAudio.volume = 0.5;
monsterAttackAudio.preload = 'auto';
gameOverAudio.preload = 'auto';
perfectAudio.preload = 'auto';

const swordHitAudio = [ new Audio('AUDIO/sword6.mp3'), new Audio('AUDIO/sword3.mp3'), new Audio('AUDIO/sword4.mp3'), new Audio('AUDIO/sword5.mp3')];

const damageAudio = [ new Audio('AUDIO/damage1.mp3'), new Audio('AUDIO/damage2.mp3'), new Audio('AUDIO/damage3.mp3'), new Audio('AUDIO/damage4.mp3')];




// function for randomizing sword sounds from array
function swordWhoosh() {
    //rounds down decimal
    const randomIndex = Math.floor(Math.random() * swordHitAudio.length);

    // getting our audio from our sword variable and randomizing with above
    const randomAudio = swordHitAudio[randomIndex];

    // making it start a little bit later so theres no empty space
    randomAudio.currentTime = 0.1; 
    randomAudio.play();
}

function randomDamageAudio() {

    const randomIndex = Math.floor(Math.random() * damageAudio.length);
    const randomDmgAudio = damageAudio[randomIndex];

    randomDmgAudio.currentTime = 0; 
    randomDmgAudio.play();
}






const menuButton = document.getElementById('Button');
// WHEN BUTTON IS CLICKED, will play button click audio,bg audio and remove main menu (translateY)
menuButton.addEventListener('click', () => {
  startMenu();
  btnClick()
});

// just for audio when theyre clicked
const startBtn = [document.getElementById('start-btn'), document.getElementById('reset-button')];
startBtn.forEach(button => {
  button.addEventListener('click', () => {
    btnClick()
  });
});

const buttonClickAudio = new Audio('AUDIO/button-click.mp3');
function btnClick() {
    buttonClickAudio.play();
    buttonClickAudio.currentTime = .73; 
    buttonClickAudio.volume = 0.4;
}


function startMenu() {
    bgMusic.volume = .2;
    bgMusic.play();
    document.getElementById('mainMenu').classList.add('hide');
  }


function startGame() {
    wordIndex = 0;
    inputField.disabled = true;
    inputField.value = "";
    // what it will say before the timer starts counting down
    timerDisplay.textContent = "A few";
    // startButton.disabled = true;
    startButton.classList.add("start_disabled");
    updateHpBars();

// DELAY BEFORE GAME STARTS
    setTimeout(() => {
        inputField.disabled = false;
        
        // instantly lets people start typing without having to click
        inputField.focus();
        message.textContent = "";
        getNewWord();
        
    }, 2000); 
}




function resetGame() {
    document.getElementById('mainMenu').classList.add('active');
    setTimeout(() => {
        location.reload();
    }, 500);
    score = 0;  
    document.getElementById("score").textContent = score;  
}

function getNewWord() {
    if (isGameOver) return;
    clearInterval(timer);
    // if words are finished
    if (wordIndex >= words.length) {
        message.textContent = "Congratulations! You've completed all words!";
        wordDisplay.textContent = "";
        inputField.disabled = true;
        return;
    }

    // plays next word from words variable, words variable starts at 0 and continitues till all words are typed in
    wordDisplay.textContent = words[wordIndex];
    // THIS MAKES TIME DIFFERENT
    // time time time
    timeLeft = 3;
    timerDisplay.textContent = timeLeft;
    // reset

    // https://www.w3schools.com/js/js_timing.asp
    // clearInterval stops the setInterval execution and it resets by having the setInterval play again. 
   
    timer = setInterval(countdown, 1000);
    
 
}



function countdown() {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft === 0) {
        clearInterval(timer); 
        decreaseCharacterHp();
        getNewWord(); 
    }
}

function checkInput() {
    // this is to see the input from input box matches the word displayed
    // trim takes out the spaces so it doesnt care
    if (inputField.value.trim() === words[wordIndex]) {
        clearInterval(timer);
        // if the word is correct, then will go to next word in word index 0,1,2,3 etc
        wordIndex++;
        inputField.value = "";
        decreaseMonsterHp();
        getNewWord();
    }
}


function decreaseCharacterHp() {
    if (isGameOver) return;

    if (characterHp > 10) {
        

        //  this is the amount it will damage
        characterHp -= 30;
        // 30
        inputField.value = "";
        wordIndex++;
        getNewWord();
        updateHpBars();
        injureCharacter();
        
        score -= 50;
        document.getElementById("score").textContent = score;
       
    } 
    
    else {
        
        // CHARACTER DIES
       
        playDefeat()
        document.querySelector('#character-hp-bar').style.opacity='0';
        characterSprite.style.top = '-900px';
        updateHpBars();
        gameOver("Character HP is empty. Game Over!");
        message.classList.add("character_defeat");
        resetBtn.classList.add("gameover_reset");
        timeLeft = 0;
        timerDisplay.textContent = timeLeft;
        clearInterval(timer);
        timer = null;
        characterHp = 0;
    }
}

// audio wasnt working inside of the function above so I made it on the outside
function playDefeat() {
    bgMusic.volume = .01;
    gameOverAudio.currentTime = 0;
    gameOverAudio.play();
}



function decreaseMonsterHp() {
    if (isGameOver) return;

    if (monsterHp > 10) {
        
    //  this number is the amount it will damage
        monsterHp -= 7; //make this 7
        updateHpBars();
        injureMonster();

        // +10 to score 
        score += 100;
        // the score id will show our score variable 
        document.getElementById("score").textContent = score;
    
    } 
    
    // MONSTER DIES
    else {
     
      
        // goes to location on spritesheet
        monsterSprite.style.top = '-900px';
        // I had a problem with the hp bar showing a little bit even though the monsterhp/characterhp was at 0 so I decided that once they are dead, the hp will just be transparent to simulate same effect
        document.querySelector('#monster-hp-bar').style.opacity='0';
        updateHpBars();
        // runs perfect score function
        gameOver("Monster defeated! You win!");
        winner();
        message.classList.add("monster_defeat");
        resetBtn.classList.add("gameover_reset");
        // when the monster dies the timer will be disabled so it doesnt trigger the monster attac
        clearInterval(timer);
        timer = null;


        startButton.disabled = true;
        resetButton.style.visibility = 'visible';
        monsterHp = 0;
    }

}



// adds red damage visuals to protagonist and attack
function injureCharacter() {
    charAttackAudio.volume = 1;
    charAttackAudio.currentTime = 0.2;
    charAttackAudio.play();
    randomDamageAudio();
  
    // Adding classes for animations
    characterDamage.classList.add("injured");
    monsterSprite.style.top = '-300px';
    characterSprite.style.top = '-600px';
    monsterDamage.classList.add("monster-move");
    monsterSprite.classList.add("monster-attack");

    setTimeout(() => {
        
        characterDamage.classList.remove("injured");
        monsterDamage.classList.remove("monster-move");
        monsterSprite.classList.remove("monster-attack");
        monsterSprite.classList.add("monster-idle");
       
        monsterSprite.style.top = '0px';
    }, 800);  

    setTimeout(() => {
        characterSprite.style.top = '0px'; 
    }, 600);  
}

// adds red damage visuals to monster and also attack animation
function injureMonster() {
    swordWhoosh()
    // I learned that this code helps to snip the beginning of audio 
    // https://www.w3schools.com/tags/av_prop_currenttime.asp
    // good for audio that starts a bit later then you wanted
    monsterAttackAudio.currentTime = 0.2;
    monsterAttackAudio.play();
    monsterDamage.classList.add("injured");
    characterDamage.classList.add("character-move");
    characterSprite.style.top = '-300px';
    monsterSprite.style.top = '-600px';
    characterSprite.classList.add("character-attack");

    setTimeout(() => {
        
        monsterDamage.classList.remove("injured");
        characterDamage.classList.remove("character-move");
        characterSprite.classList.remove("character-attack"); 
        characterSprite.classList.add("character-idle");  
        characterSprite.style.top = '0px'; 
    }, 400); 

    setTimeout(() => {
        monsterSprite.style.top = '0px'; 

    }, 600);  
    
}


// hp bar width translates to the same number of the hp in px

function updateHpBars() {
    
    characterHpBar.style.width = characterHp + 'px';
    monsterHpBar.style.width = monsterHp + 'px';
}


function winner() {
    
// This statement is to detect if the player has written all the words without any mistakes. if someones score is above 2750 then they will get a special golden perfect defeat screen and new sound!! VICTORY!!!!!!!!!!
    if (score > 2750) {
        perfectAudio.play(); 
        perfectAudio.currentTime = 0; 
        message.textContent = "Monster Defeated, PERFECT SCORE!";
        message.classList.add("perfect_run");
    } 

    // if they didnt get a perfect score, they still will get green victory screen
    else {
        victory.play(); 
        victory.currentTime = 0.2; 
        
    }
    // in both cases, audio will be lowered anyway
    bgMusic.volume = 0.01;
}


// Lost

// had an issue with the timer keep going even though monster was dead 
//used chatgpt to debug because I could figure it out
// added a isGameOver because my getNewWord kept resetting the timer, so having this isGameOver flag makes it NOT run if the game is actually over
// fixed!!


function gameOver(messageText) {

    wordDisplay.textContent = "";
    message.textContent = messageText;
    wordDisplay.textContent = "";
    inputField.disabled = true;
    isGameOver = true;
    clearInterval(timer);
    timer = null;
}

startButton.addEventListener("click", startGame);
inputField.addEventListener("input", checkInput);



// for Anne:

// make it so that the hp bar is 0 when the monster or protagonist is dead
// make a reset button 
// make animation ( using offset i think from pacmac example he gave us)

// sprites ( dungeon type but if u want anything else )


// UPDATE APR 08
// didn't do anything with HP bar i think the code is fine for now
// reset button works. will need CSS for it
// implemented character sprites however i can't get it to play certain sequences when any condition is met (stuck on the initial animation it's been set to)