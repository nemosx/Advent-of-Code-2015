/**
 * Created by Michael Root on 12/20/2015.
 */
var fs = require('fs');
var split = require('split');

var ingredients = [];

var INGRED_REGEX = /(\w+): capacity (-?\d+), durability (-?\d+), flavor (-?\d+), texture (-?\d+), calories (-?\d+)/;

function addIngredient(ingredientDescription) {
    var matches = ingredientDescription.match(INGRED_REGEX);
    var ingredient = {};
    ingredient['name'] = matches[1];
    ingredient['capacity'] = Number.parseInt(matches[2]);
    ingredient['durability'] = Number.parseInt(matches[3]);
    ingredient['flavor'] = Number.parseInt(matches[4]);
    ingredient['texture'] = Number.parseInt(matches[5]);
    ingredient['calories'] = Number.parseInt(matches[6]);
    ingredients.push(ingredient);
}

function findOptimalRecipe() {
    console.log('Making Cookies!');

    var maxScore = 0;
    var bestRecipe;

    var recipe;
    var quantities;


    for (var i = 0; i < 101; ++i) {
        for (var j = 0; j < 101; ++j) {
            for (var k = 0; k < 101; ++k) {
                for (var l = 0; l < 101; ++l) {
                    if (i + j + k + l === 100) {
                        quantities = [];
                        quantities.push(i, j, k, l);

                        recipe = {
                            'ingredients': ingredients,
                            'quantities': quantities
                        };

                        var score = evaluateRecipe(recipe);

                        if (score > maxScore) {
                            maxScore = score;
                            bestRecipe = recipe;
                        }
                    }
                }
            }
        }
    }

    console.log('Max Score: ' + maxScore);
}

function evaluateRecipe(recipe) {
    var scores = [];
    var props = ['capacity', 'durability', 'flavor', 'texture'];

    props.forEach(function (property) {
        var propertyScore = 0;
        recipe.ingredients.forEach(function (ingredient, index) {
            propertyScore += ingredient[property] * recipe.quantities[index];
        });
        scores.push(Math.max(0, propertyScore));
    });

    return scores.reduce(function (prev, current) {
        return prev * current;
    });
};

fs.createReadStream('ingredients.txt', 'utf-8')
    .pipe(split())
    .on('data', addIngredient)
    .on('end', findOptimalRecipe);
