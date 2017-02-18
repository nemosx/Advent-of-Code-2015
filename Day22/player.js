/**
 * Created by Michael Root on 2/18/2017.
 */
module.exports = class Player {
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
    }

    clone() {
        return new Player(this.name, this.hp, this.mana, this.armor, this.attack);
    }
};