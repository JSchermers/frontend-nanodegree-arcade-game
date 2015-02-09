'use strict';

// Enemies our player must avoid
var Enemy = function(x, y, speed, collisionArea ) {
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
    var canvas = getCanvas('gameCanvas');

    if (this.x < canvas.width) {
        this.x += 100 * dt * this.speed;
    }
    // When the enemy runs off the screen, move him to the other
    // side to start over
    else {
        this.x = 0;
        this.speed = getRandomInt(1, 5) * .5;
        this.y = getRandomInt(60, 230);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y, collision) {
    this.sprite = 'images/char-cat-girl.png';
    this.x = x;
    this.y = y;
    this.collision = collision;
}

Player.prototype.render = function(dt) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
Player.prototype.handleInput = function(direction) {
        var canvas = getCanvas('gameCanvas');
            if (direction === 'up') {

                this.y -= 82;
                }
                if (direction === 'down') {
                if (this.y < canvas.height - 210){
                this.y += 82;
                }
                }
                if (direction === 'left') {
                if (this.x > 1){
                this.x -= 101;
                }
                }
                if (direction === 'right') {
                if (this.x < canvas.width - 105) {
                this.x += 101;
                }
        }
    };
Player.prototype.update = function(dt) {

    };


Player.prototype.checkCollisions = function(enemy, collision){
    if(Math.abs(this.x - enemy.x) <= collision && Math.abs(this.y - enemy.y <= collision)){
        console.log('boom');
    }
}

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

    allEnemies.push(enemy);
    i++;
}

var collision = 20;
var player = new Player(400, 400, collision);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    //used e.which check for Firefox
    var keyCode = (e.which) ? e.which : e.keyCode,
        allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
            };

        player.handleInput(allowedKeys[keyCode]);
        });

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Helper method to get the canvas
function getCanvas(id) {
    var c = document.getElementById(id);
    return c;
}
