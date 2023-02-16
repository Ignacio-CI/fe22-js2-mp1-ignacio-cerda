const userInfo = {
    name: '',
    score: 0
};

const databaseUrl = 'https://highscores-846ee-default-rtdb.europe-west1.firebasedatabase.app/highscores.json';

let userPointsCounter = 0;
let computerPointsCounter = 0;

const highscoreContainer = document.querySelector('#highscores-list');

let userPoints = document.querySelector('#user-points');
userPoints.innerText = `Dina poäng: ${userPointsCounter}`;
userPoints.style.visibility = 'visible';

let computerPoints = document.querySelector('#computer-points');
computerPoints.innerText = `Datorns poäng: ${computerPointsCounter}`;
computerPoints.style.display = 'none';

const userChoice = document.querySelectorAll('.choice-btn');
for (let i = 0; i < userChoice.length; i++) {
    userChoice[i].addEventListener('click', generateGame);
}

let showComputerChoice = document.querySelector('#computer-choice');

let roundCounter = document.querySelector('#round-counter');

displayHighscores();

//---------------------------------------------------------

const SubmitBtn = document.querySelector('#enter-username-btn');

SubmitBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const userName = document.querySelector('#username-input').value
    const userNameElement = document.querySelector('#username');
    userNameElement.innerText = `Klicka på ditt val, ${userName}`;

});


//---------------------------------------------------

function generateGame(event) {
    console.log(userInfo)
    let computerChoice = Math.round(Math.random() * 2);

    if (computerChoice == 0) {
        showComputerChoice.src = "../img/sten.png";
        showComputerChoice.style.visibility = 'hidden';
    }
    else if (computerChoice == 1) {
        showComputerChoice.src = "../img/sax.png";
        showComputerChoice.style.visibility = 'hidden';
    }
    else {
        showComputerChoice.src = "../img/pase.png";
        showComputerChoice.style.visibility = 'hidden';
    }

    if (event.target == userChoice[0] && computerChoice == 0 || event.target == userChoice[1] && computerChoice == 1 || event.target == userChoice[2] && computerChoice == 2) {
        roundCounter.innerText = 'Oavgjort!';
        showComputerChoice.style.visibility = 'visible';
    }

    else if (event.target == userChoice[0] && computerChoice == 1 || event.target == userChoice[1] && computerChoice == 2 || event.target == userChoice[2] && computerChoice == 0) {
        userPointsCounter++;
        userInfo.score = userPointsCounter;
        console.log(userInfo);
        updateDatabase(userInfo)
        showComputerChoice.style.visibility = 'visible';
        userPoints.innerText = `Dina poäng: ${userPointsCounter}`;
        roundCounter.innerText = `Du vinner!`;
    }

    else {
        computerPointsCounter++;
        userInfo.score = 0;
        const { score } = userInfo;
        roundCounter.innerText = 'Datorn vinner! Spelet börjar om';
        setTimeout(() => restartGame(), 3000);    
    };
};

function restartGame() {

    roundCounter.innerText = '';
    userPointsCounter = 0;
    computerPointsCounter = 0;

    userPoints.innerText = `Dina poäng: ${userPointsCounter}`;
    computerPoints.innerText = `Datorns poäng: ${computerPointsCounter}`;

    showComputerChoice.style.visibility = 'hidden';

    userPoints.style.visibility = 'visible';
    computerPoints.style.visibility = 'visible';

    location.reload();
};

//=============================================================

// Firebase

// Hämta data från databasen
async function getHighScores() {
    const response = await fetch(databaseUrl);
    const highScores = await response.json();
    console.log(highScores);
    return highScores;
};

// Sortera highscores från högsta till lägsta
async function sortScores() {
    const highscores = await getHighScores();
    const highscoreArr = Object.entries(highscores);
    console.log(highscores);

    const sortedHighscores = highscoreArr.sort(
        (a, b) => b[1].score - a[1].score
    );
    console.log(sortedHighscores)

    const resultObj = sortedHighscores.map((sortedHighscore) => sortedHighscore[1]);
    console.log(resultObj);
    return resultObj;
};

async function displayHighscores() {
    const highScores = await sortScores();
    const highscoreList = document.createElement('ol');
    highscoreContainer.append(highscoreList);

    highScores.slice(0, 5).forEach((element) => {
        const nameAndScore = document.createElement('li');
        nameAndScore.innerText = `${element.name} : ${element.score}`;
        highscoreList.append(nameAndScore);
    });

    // Remove any additional scores from the list
    const additionalScores = highscoreList.querySelectorAll('li')[5];
    if (additionalScores) {
        additionalScores.remove();
    };

    //Clear any previous scores
    highscoreList.innerHTML = '';

    // Add the updated scores
    highScores.slice(0, 5).forEach((element) => {
        const nameAndScore = document.createElement('li');
        nameAndScore.innerText = `${element.name} : ${element.score}`;
        highscoreList.append(nameAndScore);
    });
};

async function updateDatabase() {
    const highscores = await getHighScores();

    let userName = document.querySelector('#username-input').value;

    console.log(highscores[userName]);
    highscores[userName] = {
        name: userName,
        score: userPointsCounter,
    };

    const init = {
        method: "PUT",
        body: JSON.stringify(highscores),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
        },
    };

    const response = await fetch(databaseUrl, init);
};
