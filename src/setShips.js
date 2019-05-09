export function setShips() {
    const ships = document.querySelectorAll('.ship');
    
    ships.forEach((element, index) => {
        if(index < 4) {
            element.style.width = "40px";
            element.dataset.fields = 1;
        } else if(index < 7) {
            element.style.width = "80px";
            element.dataset.fields = 2;
        } else if(index < 9) {
            element.style.width = "120px";
            element.dataset.fields = 3;
        } else {
            element.style.width = "160px";
            element.dataset.fields = 4;
        }

        element.dataset.rotation = "horizontal";
        element.addEventListener('dragstart', dragStart);
        element.addEventListener('dragend', dragEnd);
        element.addEventListener('click', onClick);
    });
}

var dragItem;

import { removeShip, placeShip, checkShip } from './ships';
import { getActivePlayer } from './setFields';

function dragStart() {
    setTimeout(() => this.style.display = "none");
    dragItem = this;

    removeShip(this);
}

function dragEnd() {
    this.style.display = "block";
}

function onClick() {
    changeRotation(this);
}

export function changeRotation(ship) {
    if(ship.dataset.rotation == "horizontal") {
        const id = ship.parentNode.dataset.id;
        if(Number(id)+(Number(ship.dataset.fields)-1)*10 > 99) {
            return;
        }
    } else {
        const id = ship.parentNode.dataset.id;
        const type = ship.dataset.fields;
        for(let i=0; i<Number(type); i++) {
            if((Number(id)+i).toString().charAt(1) == '9' || (Number(id)+i) == 9 && (Number(id)+i+1).toString().charAt(1) == '0') {
                if(i+1 != Number(type)) {
                    return;
                }
            }
        }
    }
    let changed = false;
    if(ship.parentNode.dataset.id != undefined) {
        removeShip(ship);
        changed = true;
    }

    if(changed) {
        const type = ship.dataset.fields;
        let cords = [];
        const id = ship.parentNode.dataset.id;

        if(ship.dataset.rotation == "horizontal") {
            for(let i=0; i<type; i++) {
                if(Number(id)+i*10 > 99) {
                    console.log("błąd");
                    return;
                }
                cords.push(Number(id) + i*10);
            }
        } else {
            if((Number(id)+Number(type)-1)%10 == 0 && id.charAt(1) != '0' && id != 0) {
                return;
            }
            for(let i=0; i<type; i++) {
                cords.push(Number(id) + i);
            }
        }
        if(checkShip(getActivePlayer(), cords) != false) {
            placeShip(getActivePlayer(), type, cords, ship, ship.parentNode);
        } else {
            return;
        }
    }

    if(ship.dataset.rotation == "vertical") {
        ship.dataset.rotation = "horizontal";
        ship.style.width = `${40*Number(ship.dataset.fields)}px`;
        ship.style.height = '40px';
    } else {
        ship.dataset.rotation = "vertical";
        ship.style.height = `${40*Number(ship.dataset.fields)}px`;
        ship.style.width = '40px';
    }
}

export function getDragItem() {
    return dragItem;
}