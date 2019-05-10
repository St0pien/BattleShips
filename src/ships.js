var GameStats = {
    player1: {
        ships: {
            fours: [],
            threes: [],
            twos: [],
            ones: []
        },

        attacks: {
            hits: [],
            missHits: [],
            destroyed: []
        }
    },
    
    player2: {
        ships: {
            fours: [],
            threes: [],
            twos: [],
            ones: []
        },

        attacks: {
            hits: [],
            missHits: [],
            destroyed: []
        }
    }
}

var Player;

function getType(ships, value) {
    switch(value) {
        case '1': return ships.ones; break;
        case '2': return ships.twos; break;
        case '3': return ships.threes; break;
        case '4': return ships.fours; break;
    }
}

export function checkShip(player, cords) {
    let playerKey;
    if(player == 'player1') {
        playerKey = GameStats.player1;
        Player = playerKey;
    } else {
        playerKey = GameStats.player2;
        Player = playerKey;
    }
    const ships = playerKey.ships;

    let keys = [ships.fours, ships.threes, ships.twos, ships.ones];
    let good = keys.every((key) => {
        return key.every((element) => {
            return element.fields.every((location) => {
                return cords.every((cord) => {
                    let ok = true;
                    if(location == cord) {
                        ok = false;
                    }
                    if(location+1 == cord && location != 9 && location.toString().charAt(1) != '9') {
                        ok = false;
                    }
                    if(location-1 == cord && location != 0 && location.toString().charAt(1) != '0') {
                        ok = false;
                    }
                    if(location+10 == cord) {
                        ok = false;
                    }
                    if(location-10 == cord) {
                        ok = false;
                    }
                    if(location+11 == cord && location != 9 && location.toString().charAt(1) != '9') {
                        ok = false;
                    }
                    if(location+9 == cord && location != 0 && location.toString().charAt(1) != '0') {
                        ok = false;
                    }
                    if(location-9 == cord && location != 9 && location.toString().charAt(1) != '9') {
                        ok = false;
                    }
                    if(location-11 == cord && location != 0 && location.toString().charAt(1) != '0') {
                        ok = false;
                    }
                    return ok;
                });
            });
        });
    });
    if(!good) {
        return false;
    }
    
}

export function placeShip(player, type, cords, ship, field) {
    let playerKey;
    if(player == 'player1') {
        playerKey = GameStats.player1;
        Player = playerKey;
    } else {
        playerKey = GameStats.player2;
        Player = playerKey;
    }
    const ships = playerKey.ships;
    if(checkShip(player, cords) != false) {
        let category = getType(ships, type);

        category.push({
            fields: cords,
            hits: []
        });
        field.append(ship);
    }
}

export function removeShip(ship) {
    let id = ship.parentNode.dataset.id;
    let type = ship.dataset.fields;
    if(id != undefined) {
        let ships = Player.ships;
        let table = getType(ships, type);
        table.forEach((element, index) => {
            if(element.fields.indexOf(Number(id)) > -1) {
                table.splice(index);
            }
        });
    }
}

export function restoreShip(player, type, ship) {
    if(ship.parentNode.dataset.id != undefined) {
        let id = ship.parentNode.dataset.id;
        let num = Number(id);
        let cords = [];
        if(ship.dataset.rotation == 'vertical') {
            for(let j=0; j<Number(type); j++) {
                cords.push(num+j*10);
            }
        } else {
            for(let j=0; j<Number(type); j++) {
                cords.push(num+j);
            }
        }
        placeShip(player, type, cords, ship, ship.parentNode);
    }
}

export function drawShips(player) {
    let ships;
    if(player == 'player1') {
        ships = GameStats.player1.ships;
    } else {
        ships = GameStats.player2.ships;
    }
    const types = [ships.ones, ships.twos, ships.threes, ships.fours];
    const map = document.querySelector('.map');

    [...map.children].splice(1).forEach((field) => field.style.backgroundColor = "");

    types.forEach((type) => {
        type.forEach((ship) => {
            const locations = ship.fields;
            locations.forEach((cord) => {
                const field = map.querySelector(`.field[data-id="${cord.toString()}"]`);
                if(ship.hits.length == ship.fields.length) {
                    field.style.backgroundColor = "black";
                } else if(ship.hits.indexOf(cord) > -1) {
                    field.style.backgroundColor = "red";
                } else {
                    field.style.backgroundColor = "green";
                }
            });
        })
    });
}

import { shoot } from './gamePlay';
export function drawShots(player) {
    if(player == 'player1') {
        var shots = GameStats.player1.attacks;
    } else {
        var shots = GameStats.player2.attacks;
    }
    const map = document.querySelectorAll('.map')[1];

    [...map.children].splice(1).forEach((field) => {
        field.style.backgroundColor = "";
        field.addEventListener('click', shoot);
    });

    const { hits, missHits, destroyed } = shots;
    hits.forEach((hit) => {
        const field = map.querySelector(`.field[data-id="${hit.toString()}"]`);
        field.style.backgroundColor = "red";
        field.removeEventListener('click', shoot);
    });
    missHits.forEach((hit) => {
        const field = map.querySelector(`.field[data-id="${hit.toString()}"]`);
        field.style.backgroundColor = "blue";
        field.removeEventListener('click', shoot);
    });
    destroyed.forEach((hit) => {
        const field = map.querySelector(`.field[data-id="${hit.toString()}"]`);
        field.style.backgroundColor = "black";
        field.removeEventListener('click', shoot);
    });
}

export function addShot(player, cord) {
    let ships;
    let attacks;
    if(player == "player1") {
        ships = GameStats.player2.ships;
        attacks = GameStats.player1.attacks;
    } else {
        ships = GameStats.player1.ships;
        attacks = GameStats.player2.attacks;
    }
    let types = [ships.ones, ships.twos, ships.threes, ships.fours];
    let value = false;
    types.forEach((type) => {
        type.forEach((ship) => {
            if(!value) {
                const index = ship.fields.indexOf(cord);
                if(index > -1) {
                    ship.hits.push(cord);
                    attacks.hits.push(cord);
                    if(ship.hits.length >= ship.fields.length) {
                        ship.fields.forEach((field) => {
                            attacks.destroyed.push(field);
                            if(types.every((type) => {return type.every((ship) => {return ship.hits.length >= ship.fields.length;});})) {
                                won(player);
                            }
                        });
                    }
                    value = true;
                }
            }
        });
    });
    if(!value) {
        attacks.missHits.push(cord);
    }
    return value;
}

import { startTurn } from './gamePlay';
function won(player) {
    if(player == 'player1') {
        var text = "PLAYER 1 WON!!!";
    } else {
        var text = "PLAYER 2 WON!!!";
    }
    const maps = document.querySelectorAll('.map');
    maps.forEach((map) => map.style.display = 'none');
    const missInfo = document.querySelector('.missInfo');
    missInfo.style.display = 'block';
    missInfo.innerHTML = text;
    const button = document.querySelector('.button');
    button.style.display = "";
    button.innerHTML = "RESTART";
    button.removeEventListener('click', startTurn);
    button.addEventListener('click', restart);
    
}

import { changeRotation } from './setShips';
export function restart() {
    GameStats = {
        player1: {
            ships: {
                fours: [],
                threes: [],
                twos: [],
                ones: []
            },
    
            attacks: {
                hits: [],
                missHits: [],
                destroyed: []
            }
        },
        
        player2: {
            ships: {
                fours: [],
                threes: [],
                twos: [],
                ones: []
            },
    
            attacks: {
                hits: [],
                missHits: [],
                destroyed: []
            }
        }
    }
    const maps = [...document.querySelectorAll('.map')];
    maps[0].style.display = 'grid';
    maps[1].style.display = 'none';
    const ships = document.querySelector('.ships');
    ships.style.display = '';
    document.querySelectorAll('.ship').forEach((element) => {
        ships.appendChild(element);
        if(element.dataset.rotation == 'vertical') {
            changeRotation(element);
        }
        element.style.display = 'block';
    });
    maps.forEach((map) => [...map.children].forEach((element) => element.parentNode.removeChild(element)));
    maps.forEach((map) => {
        const header = document.createElement('h2');
        header.innerHTML = "Place your ships";
        map.append(header);
});
    const button = document.querySelector('.button');
    const missInfo = document.querySelector('.missInfo');
    missInfo.style.display = 'none';
    missInfo.innerHTML = "YOU MISSED!";
    button.style.display = 'block';
    button.innerHTML = 'SET';
    console.log("restarted");
    setShips();
    setFields();
}

import { setShips } from './setShips';
import { setFields } from './setFields';
setShips();
setFields();