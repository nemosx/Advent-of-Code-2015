/**
 * Created by Michael Root on 2/15/2017.
 */
const Player = require('./player');
const GameState = require('./gamestate');

const completedGames = [];
const evaluatedGames = new Set();
const isHardDifficulty = true;
const initialGameState = createInitialGameState();

function createInitialGameState() {
    const player = new Player('Player', 50, 500, 0, 0);
    const boss = new Player('Boss', 55, 0, 0, 8);

    return new GameState(player, boss);
}

function alreadyEvaluated(gameState) {
    return evaluatedGames.has(JSON.stringify(gameState));
}

function evaluateGameStates(gameState) {
    if (isHardDifficulty && gameState.currentAttacker.name === 'Player') {
        gameState.currentAttacker.applyDamage(1);
    }

    if (gameState.isGameOver()) {
        completedGames.push(gameState);
        return;
    }

    if (alreadyEvaluated(gameState)) {
        return;
    }

    evaluatedGames.add(JSON.stringify(gameState));

    gameState.nextStates().forEach(futureState => {
        evaluateGameStates(futureState);
    });
}

evaluateGameStates(initialGameState);

const lowestManaSpend =
    completedGames
        .filter(game => {
            return game.results.winner.name === 'Player';
        })
        .reduce((lowestManaSpend, game) => {
            return game.cumulativeManaSpend < lowestManaSpend ? game.cumulativeManaSpend : lowestManaSpend;
        }, Number.MAX_VALUE);

console.log(lowestManaSpend);


