export function setFields() {
    const maps = document.querySelectorAll('.map');

    maps.forEach((element) => {
        const frag = document.createDocumentFragment();
        for(let i=0; i<100; i++) {
            const div = document.createElement('div');
            div.classList.add('field');
            div.dataset.id = i;
            frag.appendChild(div);
        };
        element.appendChild(frag);
    });

    const fields = document.querySelectorAll('.field');

    fields.forEach((element) => {
        element.addEventListener('dragenter', dragEnter);
        element.addEventListener('dragover', dragOver);
        element.addEventListener('drop', dragDrop);
    });

    const button = document.querySelector('.button');
    button.addEventListener('click', nextPlayer);
}

import { getDragItem, changeRotation } from './setShips';
import { placeShip, restoreShip } from './ships';
var activePlayer = 'player1';

function nextPlayer() {
    this.classList.add('buttonClicked');
    setTimeout(() => document.querySelector('.button').classList.remove('buttonClicked'), 100);
    const container = document.querySelector('.ships');
    const header = document.querySelector('h2');
    header.innerHTML = "Place your ships";
    header.style.color = "";

    if(container.children.length <= 0) {
        if(activePlayer == 'player1') {
            activePlayer = 'player2';
            let ships = [...document.querySelectorAll('.ship')];
            ships.sort((a, b) => {
                return Number(a.dataset.fields) - Number(b.dataset.fields)
            });
            ships.forEach((ship) => {
                if(ship.dataset.rotation == 'vertical') {
                    changeRotation(ship);
                }
                container.appendChild(ship);
            });
        }
    } else {
        header.innerHTML = "Place them ALL";
        header.style.color = "#b00";
    }
}

export function getActivePlayer() {
    return activePlayer;
}

function dragEnter(e) {
    e.preventDefault();
}

function dragOver(e) {
    e.preventDefault();
}

function dragDrop() {
    const ship = getDragItem();
    const type = ship.dataset.fields;
    let cords = [];
    let id = this.dataset.id;
    if(ship.dataset.rotation == "vertical") {
        if(Number(id)+(Number(type)-1)*10 > 99) {
            restoreShip(activePlayer, type, ship);
            return;
        }
        for(let i=0; i<Number(type); i++) {
            cords.push(Number(id) + i*10);
        }
    } else {
        for(let i=0; i<Number(type); i++) {
            if((Number(id)+i).toString().charAt(1) == '9' || (Number(id)+i) == 9 && (Number(id)+i+1).toString().charAt(1) == '0') {
                if(i+1 != Number(type)) {
                    console.log('nope');
                    restoreShip(activePlayer, type, ship);
                    return;
                }
            }
            cords.push(Number(id) + i);
        }
    }
    placeShip(activePlayer, type, cords, ship, this);
}