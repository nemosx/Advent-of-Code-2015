/**
 * Created by Michael Root on 2/18/2017.
 */
const spells = require('./spells');

module.exports = class GameState {
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

    switchAttackerAndDefender() {
        let temp = this.currentAttacker;
        this.currentAttacker = this.currentDefender;
        this.currentDefender = temp;
    }

    clone() {
        let currentAttacker = this.currentAttacker.clone();
        let currentDefender = this.currentDefender.clone();

        let clonedState = new GameState(currentAttacker, currentDefender);
        clonedState.cumulativeManaSpend = this.cumulativeManaSpend;

        this.activeEffects.forEach(effect => {
            clonedState.activeEffects.push(effect.clone());
        });

        return clonedState;
    }

    nextStates() {
        let nextGameState = this.clone();
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
            effect.apply(player, boss);
        });

        if (nextGameState.isGameOver()) {
            return [nextGameState];
        }

        let currentAttacker = nextGameState.currentAttacker;
        let currentDefender = nextGameState.currentDefender;

        if (currentAttacker.name === 'Boss') {
            const effectiveDamage = currentAttacker.attack - currentDefender.armor;

            currentDefender.applyDamage(effectiveDamage);

            nextGameState.switchAttackerAndDefender();

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
                futureState.switchAttackerAndDefender();
                futureStates.push(futureState);
            });

            return futureStates;
        }
    }
};

