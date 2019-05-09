import { getActivePlayer } from "./setFields";

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
        default: console.log("fatal error"); break;
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

    let keys = [ships.fours, ships.threes, ships.twos, ships.ones];
    let good = keys.every((key) => {
        return key.every((element) => {
            return element.fields.every((location) => {
                return cords.every((cord) => {
                    let ok = true;
                    if(location == cord) {
                        ok = false;
                    }
                    if(location+1 == cord) {
                        ok = false;
                    }
                    if(location-1 == cord) {
                        ok = false;
                    }
                    if(location+10 == cord) {
                        ok = false;
                    }
                    if(location-10 == cord) {
                        ok = false;
                    }
                    if(location+11 == cord) {
                        ok = false;
                    }
                    if(location+9 == cord && location != 0 && location.toString().charAt(1) != '0') {
                        ok = false;
                    }
                    if(location-9 == cord && location != 9 && location.toString().charAt(1) != '9') {
                        ok = false;
                    }
                    if(location-11 == cord) {
                        ok = false;
                    }
                    return ok;
                });
            });
        });
    });
    if(!good) {
        console.log('nie wolno');
        restoreShip(getActivePlayer(), type, ship);
        return;
    }
    let category = getType(ships, type);

    category.push({
        fields: cords,
        hits: new Array(cords.length)
    });
    field.append(ship);
    console.log(GameStats);
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

import { setShips } from './setShips';
import { setFields } from './setFields';
setShips();
setFields();