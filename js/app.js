'use strict';
var helper = {
    redraw : function(x, y, width, height) {
    var r, g, b, a, pixel, imageData, numPixels;
        imageData = ctx.getImageData(x, y, width, height);
        numPixels = imageData.data.length / 4;
        for (var i = 0 ; i < numPixels ; i++) {
            r = imageData.data[i * 4 + 0];
            g = imageData.data[i * 4 + 1];
            b = imageData.data[i * 4 + 2];
            a = imageData.data[i * 4 + 3];
            pixel = helper.makePixelGreyScale(r, g, b, a);
            imageData.data[i * 4 + 0] = pixel.r;
            imageData.data[i * 4 + 0] = pixel.g;
            imageData.data[i * 4 + 0] = pixel.b;
            imageData.data[i * 4 + 0] = pixel.a;
        }
        ctx.putImageData(imageData, x, y);
    },
    drawGameOver : function(image, x, y, angle, width, height) {
        var toRadians = Math.PI / 180;
            ctx.save();
            ctx.translate(x + 90, y + 90);
            ctx.rotate(angle * Math.PI/180);
            ctx.drawImage(image, -(width / 2), -(height / 2));
            ctx.restore();
    },
    setText : function(text, x, y, color, font) {
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.fillText(text, x / 4, y / 2);
    },
    getRandomInt : function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },
    makePixelGreyScale : function(r, g, b, a){
                        var y = (0.3 * r) + (0.59 * g) + (0.11 * b);
                        return {r: y, g: y, b: y, a: y};
                    },
    getCanvas : function(id) {
        var canvas = document.getElementById(id);
        return canvas;
    },
    createDocumentElement : function(append, el, id, cssClass, text) {
        var appendTo = document.getElementById(append);
        var docfrag = document.createDocumentFragment();
        var elm = document.createElement(el);
        elm.id = id;
        if(text){
            elm.innerHTML = text;
        }
        if(cssClass) {
            elm.classList.add(cssClass);
        }
        docfrag.appendChild(elm);
        appendTo.appendChild(docfrag);
    },
    removeElSlow : function(el) {
        var elm = document.getElementById(el);
        elm.classList.add('fadeOut');
    },
    removeEl: function(el) {
        //because of repeating code check if element is null, so
        var elm = document.getElementById(el);
        if(elm !== null) {
            elm.parentNode.removeChild(elm);
        }
        elm = null;
    },
    setInnerText : function(el, text) {
        if(el !== null) {
            el.innerHTML = text;
        }
        el = null;
    },
    showElement: function(el) {
            var elm = this.getDomElement(el);
            elm.classList.add('fadeIn');
    },
    getDomElement : function(el) {
        var elm = document.getElementById(el);
        return elm;
    },
    upDateAnim : function(el, cl) {
        if(el.classList !== 0) {
            el.classList.remove(cl);
        }
        setTimeout(function(){
           el.classList.add(cl);
       }, 1000);
    }
};

var game = {
    gameOver : false,
    score : 0,
    level : 1,
    lives : 1,
    points : 1,
    win : 3,
    numberLives: '',
    playerSet : false,
    gameOverText : 'Game over',
    gameWinText : 'You win',
    primMessageColor : 'red',
    primFont : '60px Calibri',
    secMessageColor : 'blue',
    secFont : '14px Verdana',
    levelText : function(level, text){
        var textEl = text ? text : 'Get to the Chopper',
        totalText = 'Level ' + level + ' ' + textEl;
        return totalText;

    },
    moreText : 'One enemy added',
    init : function(){

    },
    //start game with 3 enemies
    gameSettings : function(gameLevel, collision) {
        var collisionPlayer = collision || 20,
            speedfactor = 100,
            x = 0,
            y = 0,
            speed = 0,
            i = 0;

            if(gameLevel === 1) {
                //create three enemy objects
                while (i < 3){
                    y = helper.getRandomInt(60, 230);
                    speed = helper.getRandomInt(1,7) * 0.5;
                    enemy = new Enemy(x, y ,speed, speedfactor);

                    allEnemies.push(enemy);
                    i++;
                }
                         //add collision to player
            player = new Player(400, 400, collisionPlayer);
            }

            //when levelnumber adds, a new enemy is added to the game, who is faster
            else {
                    speedfactor += 5;
                    player.collision += 5;
                    y = helper.getRandomInt(80, 210);
                    speed = helper.getRandomInt(1,7) * 0.5;
                    enemy = new BigEnemy(x, y ,speed, speedfactor);
                    allEnemies.push(enemy);
            }


    },
};

// Enemies our player must avoid
var Enemy = function(x, y, speed, speedfactor) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.speedfactor = speedfactor;
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
    var canvas = helper.getCanvas('gameCanvas');

    if (this.x < canvas.width) {
        this.x += this.speedfactor * dt * this.speed;
    }
    // When the enemy runs off the screen, move him to the other
    // side to start over
    else {
        this.x = 0;
        this.speed = helper.getRandomInt(1, 5) * 0.5;
        this.y = helper.getRandomInt(60, 230);
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    if(this instanceof Enemy) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    if(this instanceof BigEnemy) {
        ctx.save();
        ctx.scale(1.2,1.2);
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        ctx.restore();
    }

};

//avoid BigEnemy
var BigEnemy = function(x, y, speed, speedfactor) {
    //call parent function
    Enemy.call(this, x, y, speed, speedfactor);
};

//delegate BigEnemy.prototype to Enemy.protoype
BigEnemy.prototype = Object.create(Enemy.prototype);
BigEnemy.prototype.constructor = BigEnemy;

                           // Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y, collision) {
    this.sprite = '';
    this.x = x;
    this.y = y;
    this.collision = collision;
    this.width = 80;
    this.height = 100;
};

Player.prototype.render = function() {
    var canvas = helper.getCanvas('gameCanvas');
        if (game.gameOver === false) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    else {
        helper.drawGameOver(Resources.get(this.sprite), this.x, this.y, 90, this.width, this.height);
        //redraw whole canvas
        helper.redraw(0, 0, canvas.width, canvas.height);
        helper.setText(game.gameOverText, canvas.width, canvas.height, game.primMessageColor, game.primFont);
    }

    if (game.level === game.win) {
        helper.redraw(0, 0, canvas.width, canvas.height);
        helper.setText(game.gameWinText, canvas.width, canvas.height, game.primMessageColor, game.primFont);
        helper.removeEl('meta');
     }
};
Player.prototype.handleInput = function(direction) {
        var canvas = helper.getCanvas('gameCanvas'),
            level = helper.getDomElement('level-number') || 1,
            startText = helper.getDomElement('start-text'),
            config = { attributes: false, childList: true, characterData: true, characterOldData: true },
            newValue = '',
            text = '',
            startValue = '',
            observer = new MutationObserver(function(mutations){
                        mutations.forEach(function(mutation){
                            newValue = mutation.target.innerHTML;

                            if (newValue !== startValue && game.level < game.win ) {
                                text = game.levelText(newValue, 'Watch out for them new ones');
                                helper.setInnerText(startText, text);
                                helper.upDateAnim(startText, 'fadeOut');
                                startValue = newValue;
                            }
                        });
                    });
            observer.observe(level, config);
            if (direction === 'up') {
                //position player so it fits
                if(this.y > 20) {
                    this.y -= 80;
                }
                else {
                    game.level += 1;
                    level.innerHTML = game.level;
                    this.setPosition(400, 400);
                    helper.upDateAnim(level, 'scaleUp');
                    game.gameSettings(game.level);
                }

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
    if(!game.numberLives) {
        game.numberLives = helper.getDomElement('number-lives');
    }
    if(Math.abs(this.x - enemy.x) <= collision && Math.abs(this.y - enemy.y) <= collision){
        if(game.lives === 0) {
            game.gameOver = true;
        }
        else {
            game.lives -= 1;
            game.numberLives.innerHTML = game.lives;
            player.setPosition(400, 400);
            helper.upDateAnim(game.numberLives, 'scaleUp');


        }
    }
};

Player.prototype.setPosition = function(x, y){
   this.x = x;
   this.y = y;
};



// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
// start the game with 3 enemies in an allEnemies array

var allEnemies = [];
var player = null;
var enemy = null;
game.gameSettings(game.level);

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
            if (game.gameOver === false && game.level < game.win) {
        player.handleInput(allowedKeys[keyCode]);
        }
    });