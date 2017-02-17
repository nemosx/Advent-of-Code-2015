/**
 * Created by Michael Root on 2/15/2017.
 */

const spells = require('./spells');

class Player {
    constructor(name, hp, mana, armor, attack) {
        this.name = name;
        this.hp = hp;
        this.mana = mana;
        this.armor = armor;
        this.attack = attack;
    }

    isAlive() {
        return this.hp > 0;
    }

    applyHealth(health) {
        this.hp += health;
    }

    applyDamage(damage) {
        this.hp -= damage;
        if (this.hp < 0) {
            this.hp = 0;
        }
    }

    equals(anotherPlayer) {
        return this.name === anotherPlayer.name
            && this.hp === anotherPlayer.hp
            && this.mana === anotherPlayer.mana
            && this.attack === anotherPlayer.attack
            && this.armor === anotherPlayer.armor;
    }

    clone() {
        return new Player(this.name, this.hp, this.mana, this.armor, this.attack);
    }
}

class GameState {
    constructor(attacker, defender) {
        this.activeEffects = [];
        this.currentAttacker = attacker;
        this.currentDefender = defender;
        this.cumulativeManaSpend = 0;
    }

    get player() {
        return this.currentAttacker.name === 'Player' ? this.currentAttacker : this.currentDefender;
    }

    get boss() {
        return this.currentAttacker.name === 'Boss' ? this.currentAttacker : this.currentDefender;
    }

    isGameOver() {
        return !(this.currentAttacker.isAlive() && this.currentDefender.isAlive()) || this.castFailLoss;
    }

    get results() {
        if (this.castFailLoss) {
            return {
                winner : this.boss,
                loser : this.player
            };
        }
        return {
            winner: this.currentAttacker.isAlive() ? this.currentAttacker : this.currentDefender,
            loser: !this.currentAttacker.isAlive() ? this.currentAttacker : this.currentDefender
        };
    }

    sameActiveEffects(otherActiveEffects) {
        if (this.activeEffects.length !== otherActiveEffects.length) {
            return false;
        }

        this.activeEffects.sort((a, b) => {
            if (a.name === b.name) {
                return 0;
            }
            else if (a.name < b.name) {
                return -1;
            }
            else  {
                return 1;
            }
        });

        otherActiveEffects.sort((a, b) => {
            if (a.name === b.name) {
                return 0;
            }
            else if (a.name < b.name) {
                return -1;
            }
            else  {
                return 1;
            }
        });


        for (let i = 0; i < this.activeEffects.length; i++) {
            if (!this.activeEffects[i].equals(otherActiveEffects[i])) {
                return false;
            }
        }

        return true;
    }

    swapRoles() {
        let temp = this.currentAttacker;
        this.currentAttacker = this.currentDefender
        this.currentDefender = temp;
    }

    clone() {
        let currentAttacker = this.currentAttacker.clone();
        let currentDefender = this.currentDefender.clone();

        let clonedState = new GameState()
        clonedState.cumulativeManaSpend = this.cumulativeManaSpend;
        clonedState.currentAttacker = currentAttacker;
        clonedState.currentDefender = currentDefender;

        this.activeEffects.forEach(effect => {
            clonedState.activeEffects.push(effect.clone());
        })

        return clonedState;
    }

    equals(anotherGameState) {
        return this.sameActiveEffects(anotherGameState.activeEffects)
            && this.currentAttacker.equals(anotherGameState.currentAttacker)
            && this.currentDefender.equals(anotherGameState.currentDefender)
            && this.cumulativeManaSpend === anotherGameState.cumulativeManaSpend;
    }
}

let player = new Player('Player', 50, 500, 0, 0);
let boss = new Player('Boss', 55, 0, 0, 8);


let initialGameState = new GameState(player, boss);

const completedGames = [];
const evaluatedGameStates = [];

function alreadyEvaluated(gameState) {
    return evaluatedGameStates.some(state => {
        return state.equals(gameState);
    });
}

function expand(gameState) {
    let nextGameState = gameState.clone();
    let player = nextGameState.player;
    let boss = nextGameState.boss;


    //Remove effects that are no longer active
    nextGameState.activeEffects.forEach(effect => {
        if (!effect.isActive()) {
            effect.removeEffect(player, boss);
        }
    });
    //and filter them from the list
    nextGameState.activeEffects = nextGameState.activeEffects.filter(effect => {
        return effect.isActive();
    });

    //Apply all of the effects
    nextGameState.activeEffects.forEach(effect => {
        effect.administer(player, boss);
    });



    if (nextGameState.isGameOver()) {
        return [nextGameState];
    }

    let currentAttacker = nextGameState.currentAttacker;
    let currentDefender = nextGameState.currentDefender;
    let temp = undefined;

    if (currentAttacker.name === 'Boss') {
        let effectiveDamage = currentAttacker.attack - currentDefender.armor;
        if (effectiveDamage <= 0) {
            effectiveDamage = 1;
        }

        currentDefender.applyDamage(effectiveDamage);

        nextGameState.swapRoles();

        return [nextGameState];
    }
    else {
        //Get Spells we can cast
        let castableSpells = spells.filter(spell => {
            return spell.canCast(nextGameState.activeEffects) && spell.cost <= currentAttacker.mana;
        });

        //If we can't cast any spells, we lose
        if (castableSpells.length === 0) {
            nextGameState.castFailLoss = true;
            return [nextGameState];
        }

        let futureStates = [];

        castableSpells.forEach(spell => {
            let futureState = nextGameState.clone();

            let effect = spell.cast(futureState.currentAttacker, futureState.currentDefender);
            futureState.currentAttacker.mana -= spell.cost;
            futureState.cumulativeManaSpend += spell.cost;

            if (effect) {
                futureState.activeEffects.push(effect);
            }
            futureState.swapRoles();
            futureStates.push(futureState);
        });
        return futureStates;
    }
}

function searchGameStates(gameState, round) {

    if (gameState.currentAttacker.name === 'Player') {
        gameState.currentAttacker.applyDamage(1);
    }

    if (gameState.isGameOver()) {
        completedGames.push(gameState);
        evaluatedGameStates.push(gameState);
        return;
    }

    // if (alreadyEvaluated(gameState)) {
    //     return;
    // }
    //
    // evaluatedGameStates.push(gameState);

    let nextStates = expand(gameState);

    nextStates.forEach(futureState => {
        searchGameStates(futureState, round + 1);
    });
}


searchGameStates(initialGameState, 0);

const lowestManaSpend =
    completedGames
        .filter(game => {
            return game.results.winner.name === 'Player';
        })
        .reduce((lowestManaSpend, game) => {
            return game.cumulativeManaSpend < lowestManaSpend ? game.cumulativeManaSpend : lowestManaSpend;
        }, Number.MAX_VALUE);

console.log(lowestManaSpend);


