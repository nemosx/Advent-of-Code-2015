/**
 * Created by Michael Root on 2/15/2017.
 */
class Spell {
    constructor(cost) {
        this.cost = cost;
    }

    canCast() {}

    cast(player, boss) {}
}

class MagicMissile extends Spell {
    constructor() {
        super(53);
    }

    canCast() {
        return true;
    }

    cast(player, boss) {
        boss.applyDamage(4);
    }
}

class Drain extends Spell {
    constructor() {
        super(73);
    }

    canCast() {
        return true;
    }

    cast(player, boss) {
        boss.applyDamage(2);
        player.applyHealth(2);
    }
}

class Shield extends Spell {
    constructor() {
        super(113);
    }

    canCast(activeEffects) {
        return Effect.isInactive('Shield', activeEffects);
    }

    cast(player, boss) {
        return new ShieldEffect();
    }
}

class Poison extends Spell {
    constructor() {
        super(173);
    }

    cast(player, boss) {
        return new PoisonEffect();
    }

    canCast(activeEffects) {
        return Effect.isInactive('Poison', activeEffects);
    }
}

class Recharge extends Spell {
    constructor() {
        super(229);
    }

    cast(player, boss) {
        return new RechargeEffect();
    }

    canCast(activeEffects) {
        return Effect.isInactive('Recharge', activeEffects);
    }
}

class Effect {
    constructor(name, timer) {
        this.name = name;
        this.timer = timer;
        this.alreadyApplied = false;
    }

    static isInactive(effectName, activeEffects) {
        return activeEffects.filter(effect => {
                return effect.name === effectName;
            }).length === 0;
    }

    applyEffect(player, boss) {}

    removeEffect(player, boss) {}

    administer(player, boss) {
        this.timer--;
        this.applyEffect(player, boss);
    }

    equals(anotherEffect) {
        return this.name === anotherEffect.name && this.timer === anotherEffect.timer;
    }

    isActive() {
        return this.timer > 0;
    }
}

class ShieldEffect extends Effect {
    constructor() {
        super('Shield', 6);
        this.alreadyApplied = false;
    }

    applyEffect(player, boss) {
        if (!this.alreadyApplied) {
            this.alreadyApplied = true;
            player.armor = 7;
        }
    }

    removeEffect(player, boss) {
        player.armor = 0;
    }

    equals(anotherEffect) {
        return this.alreadyApplied === anotherEffect.alreadyApplied && super.equals(anotherEffect);
    }

    clone() {
        let clone = new ShieldEffect();
        clone.timer = this.timer;
        clone.alreadyApplied = this.alreadyApplied;
        return clone;
    }
}

class PoisonEffect extends Effect {
    constructor() {
        super('Poison', 6);
    }

    applyEffect(player, boss) {
        boss.applyDamage(3);
    }

    clone() {
        let clone = new PoisonEffect();
        clone.timer = this.timer;
        return clone;
    }
}

class RechargeEffect extends Effect {
    constructor() {
        super('Recharge', 5);
    }

    applyEffect(player, boss) {
        player.mana += 101;
    }


    clone() {
        let clone = new RechargeEffect();
        clone.timer = this.timer;
        return clone;
    }
}


module.exports = [new MagicMissile(), new Drain(), new Shield(), new Poison(), new Recharge()];