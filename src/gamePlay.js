import { drawShips, drawShots, addShot } from './ships';

var activePlayer = 'player2';

export function startGameplay() {
    document.querySelector('h3').innerHTML = "turn: PLAYER 2";
    document.querySelectorAll('.map').forEach((element) => {
        element.style.display = "grid";
    });
    const shipsPanel = document.querySelector('.ships');
    shipsPanel.style.display = 'none';
    document.querySelectorAll('.ship').forEach((element) => {
        element.style.display = 'none';
    });
    const button = document.querySelector('.button');
    button.style.display = 'none';
    button.innerHTML = "NEXT TURN";
    button.addEventListener('click', startTurn);
    const headers = document.querySelectorAll('h2');
    headers[0].innerHTML = "Your ships";
    headers[1].innerHTML = "Your shots";

    const maps = document.querySelectorAll('.map');
    const fields = [...maps[1].children].splice(1);
    fields.forEach((element) => {
        element.addEventListener('click', shoot);
    });
    drawShips(activePlayer);
    drawShots(activePlayer);
}

export function shoot() {
    if(addShot(activePlayer, Number(this.dataset.id))) {
        drawShots(activePlayer);
    } else {
        if(activePlayer == 'player1') {
            activePlayer = 'player2';
            document.querySelector('h3').innerHTML = "turn: PLAYER 2";
        } else {
            activePlayer = 'player1';
            document.querySelector('h3').innerHTML = "turn: PLAYER 1";
        }
        changePlayer();
    }
}

function changePlayer() {
    const maps = document.querySelectorAll('.map');
    maps.forEach((map) => map.style.display = 'none');
    document.querySelector('.missInfo').style.display = 'block';
    document.querySelector('.button').style.display = "";
}

export function startTurn() {
    const maps = document.querySelectorAll('.map');
    maps.forEach((map) => map.style.display = 'grid');
    document.querySelector('.missInfo').style.display = 'none';
    document.querySelector('.button').style.display = "none";

    drawShips(activePlayer);
    drawShots(activePlayer);
}