'use strict';

// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
 // You should multiply any movement by the dt parameter
// which will ensure the game runs at the same speed for
// all computers.
// *Set coordinates for collision detection
    this.x = this.x + 1;

    // If the enemy is on screen, move him at a rate multiplied
    // by dt and by the level (to increase game difficulty)
    if (this.x < 707) {
    this.x += 100 * dt * this.speed;
    }
    // When the enemy runs off the screen, move him to the other
    // side to start over
    else {
        this.x = 0;
        this.speed = getRandomInt(1,5) * .5;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y) {
    this.sprite = 'images/char-cat-girl.png';
    this.x = x;
    this.y = y;
    this.render = function(dt) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    this.handleInput = function(action) {
            if (action === 'up') {
                console.log("up");
                this.y -= 82;
                }
                if (action === 'down') {
                if (this.y < 350){
                this.y += 82;
                }
                }
                if (action === 'left') {
                if (this.x > 1){
                this.x -= 101;
                }
                }
                if (action === 'right') {
                if (this.x < 606) {
                this.x += 101;
                }
        }
    };
    this.update = function(dt) {

    };

};

var checkCollisions = function(){

    console.log("boo");
};



// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var i = 0;
while (i < 3){
    var x = 0,
        y = getRandomInt(60, 230),
        speed = getRandomInt(1,7) * .5,
        enemy = new Enemy(x, y , speed);
        console.log(y);

    allEnemies.push(enemy);
    i++;
};


var player = new Player(400, 400);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var keyCode = (e.which) ? e.which : e.keyCode,
        allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
            };

        player.handleInput(allowedKeys[keyCode]);
        });

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
