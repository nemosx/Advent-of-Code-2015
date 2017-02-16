/**
 * Created by Michael Root on 2/15/2017.
 */

const spells = require('./spells');

class Player {
    constructor(name, hp, mana) {
        this.name = name;
        this.hp = hp;
        this.mana = mana;
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
            && this.mana === anotherPlayer.mana;
    }

    clone() {
        return new Player(this.name, this.hp, this.mana);
    }
}

class GameState {
    constructor() {
        this.activeEffects = [];
        this.currentAttacker = undefined;
        this.currentDefender = undefined;
        this.cumulativeManaSpend = 0;
    }

    isGameOver() {
        return !(this.currentAttacker.isAlive() && this.currentDefender.isAlive());
    }

    get results() {
        return {
            winner: this.currentAttacker.isAlive() ? this.currentAttacker : this.currentDefender,
            loser: !this.currentAttacker.isAlive() ? this.currentAttacker : this.currentDefender
        };
    }

    sameActiveEffects(otherActiveEffects) {
        if (this.activeEffects.length !== otherActiveEffects.length) {
            return false;
        }

        let sortedActiveEffectsA = this.activeEffects.map(effect => effect.name).sort();
        let sortedActiveEffectsB = otherActiveEffects.map(effect => effect.name).sort();

        for (let i = 0; i < sortedActiveEffectsA.length; i++) {
            if (sortedActiveEffectsA[i].name !== sortedActiveEffectsB[i].name) {
                return false;
            }
        }

        return true;
    }

    equals(anotherGameState) {
        return this.sameActiveEffects(anotherGameState.activeEffects)
            && this.currentAttacker.equals(anotherGameState.currentAttacker)
            && this.currentDefender.equals(anotherGameState.currentDefender)
            && this.cumulativeManaSpend === anotherGameState.cumulativeManaSpend;
    }
}

let g = new GameState();

g.activeEffects.push(spells[2].cast());

let l = new GameState();
l.activeEffects.push(spells[2].cast());


console.log(g.equals(l));


//start the turn
//administer (apply) all active effects
//remove inactive effects
//check if the anyone is dead  - if so, the game is over...

//else

//determine which spells (or attack) the player can perform (can't cast spells that will create effects that are already active)
//must have enough mana to cast spell - if no attack options are available (player loses)

//cast the spell (or attack) and immediately reduce the mana
//some spells are immediate; therefore, check if defender is dead right away

//swap the attacker and defender

