/**
 * Created by Michael Root on 2/14/2017.
 */
const weapons = [
    {
        name: 'Dagger',
        cost: 8,
        damage: 4,
        armor: 0
    },
    {
        name: 'Shortsword',
        cost: 10,
        damage: 5,
        armor: 0
    },
    {
        name: 'Warhammer',
        cost: 25,
        damage: 6,
        armor: 0
    },
    {
        name: 'Longsword',
        cost: 40,
        damage: 7,
        armor: 0
    },
    {
        name: 'Greataxe',
        cost: 74,
        damage: 8,
        armor: 0
    }
];
const armor = [
    {
        name: 'No Armor',
        cost: 0,
        damage: 0,
        armor: 0
    },
    {
        name: 'Leather',
        cost: 13,
        damage: 0,
        armor: 1
    },
    {
        name: 'Chainmail',
        cost: 31,
        damage: 0,
        armor: 2
    },
    {
        name: 'Splintmail',
        cost: 53,
        damage: 0,
        armor: 3
    },
    {
        name: 'Bandedmail',
        cost: 75,
        damage: 0,
        armor: 4
    },
    {
        name: 'Platemail',
        cost: 102,
        damage: 0,
        armor: 5
    }
];
const rings = [
    {
        name: 'Damage +1',
        cost: 25,
        damage: 1,
        armor: 0
    },
    {
        name: 'Damage +2',
        cost: 50,
        damage: 2,
        armor: 0
    },
    {
        name: 'Damage +3',
        cost: 100,
        damage: 3,
        armor: 0
    },
    {
        name: 'Defense +1',
        cost: 20,
        damage: 0,
        armor: 1
    },
    {
        name: 'Defense +2',
        cost: 40,
        damage: 0,
        armor: 2
    },
    {
        name: 'Defense +3',
        cost: 80,
        damage: 0,
        armor: 3
    }
];

class Player {
    constructor(name, hp, equipment) {
        this.name = name;
        this.hp = hp;
        this.equipment = equipment;
    }

    get cost() {
        return this.equipment.reduce((totalCost, item) => {
            return totalCost + item.cost;
        }, 0);
    }

    get damageScore() {
        return this.equipment.reduce((totalDamageScore, item) => {
            return totalDamageScore + item.damage;
        }, 0);
    }

    get armorScore() {
        return this.equipment.reduce((totalArmorScore, item) => {
            return totalArmorScore + item.armor;
        }, 0);
    }

    isAlive() {
        return this.hp > 0;
    }

    reduceHP(damageReceived) {
        this.hp -= damageReceived;
        if (this.hp < 0) {
            this.hp = 0;
        }
    }

    get hitPoints() {
        return this.hp;
    }
}

class Game {
    constructor(player, boss) {
        this.player = player;
        this.boss = boss;
    }

    play() {
        let currentAttacker = this.player;
        let currentDefender = this.boss;
        let temp = undefined;

        while (currentAttacker.isAlive() && currentDefender.isAlive()) {
            let attackerDamage = this.calculateDamage(currentAttacker, currentDefender);

            currentDefender.reduceHP(attackerDamage);

            temp = currentAttacker;
            currentAttacker = currentDefender;
            currentDefender = temp;
        }

        return {
            winner : currentAttacker.isAlive() ? currentAttacker : currentDefender,
            loser : !currentAttacker.isAlive() ? currentAttacker : currentDefender
        }
    }

    calculateDamage(attacker, defender) {
        return (attacker.damageScore - defender.armorScore) <= 0 ? 1 : (attacker.damageScore - defender.armorScore);
    }
}


function createBoss() {
    return new Player('Boss', 103, [{
        damage: 9,
        armor: 2
    }])
}

function createPlayer(equipment) {
    return new Player('Player', 100, equipment);
}

function generateRingPermutations() {
    let ringPermutations = rings.slice().map(ring => [ring]);
    ringPermutations.unshift(
        [{
            name: 'No Ring',
            cost: 0,
            damage: 0,
            armor: 0
        }]);

    for (let i = 0; i < rings.length - 1; i++) {
        for (let j = i + 1; j < rings.length; j++) {
            ringPermutations.push([rings[i], rings[j]]);
        }
    }

    return ringPermutations;
}

function generatePlayerEquipmentPermutations() {
    let equipmentPermutations = [];
    let ringPermutations = generateRingPermutations();

    weapons.forEach(weapon => {
        armor.forEach(armor => {
            ringPermutations.forEach(ringPermutation => {
                let playerEquipment = [weapon, armor, ...ringPermutation];
                equipmentPermutations.push(playerEquipment);
            });
        });
    });

    return equipmentPermutations;
}

function findLeastSpendForVictory() {
    let equipmentPermutations = generatePlayerEquipmentPermutations();

    //Equipment => Games => Winners => Player Winners => Cheapest Winner
    let cheapestWinner = equipmentPermutations
        .map(playerEquipment => {
            let boss = createBoss();
            let player = createPlayer(playerEquipment);
            return new Game(player, boss);
        })
        .map(game => {
            return game.play().winner;
        })
        .filter(winner => {
            return winner.name === 'Player';
        })
        .reduce((cheapestVictor, currentWinner) => {
            return currentWinner.cost < cheapestVictor.cost ? currentWinner : cheapestVictor;
        }, {
            cost: Number.MAX_VALUE
        });

    console.log(cheapestWinner.cost);
}

function findMostSpendForDefeat() {
    let equipmentPermutations = generatePlayerEquipmentPermutations();

    //Equipment => Games => Loser => Player Losers => Cost => Highest Cost
    let highestCostLoser = equipmentPermutations
        .map(playerEquipment => {
            let boss = createBoss();
            let player = createPlayer(playerEquipment);
            return new Game(player, boss);
        })
        .map(game => {
            return game.play().loser;
        })
        .filter(loser => {
            return loser.name === 'Player';
        })
        .map (loser => {
            return loser.cost;
        })
        .reduce((highestCost, cost) => {
            return cost > highestCost ? cost : highestCost;
        }, Number.MIN_VALUE);


    console.log(highestCostLoser);
}

findLeastSpendForVictory();

findMostSpendForDefeat();