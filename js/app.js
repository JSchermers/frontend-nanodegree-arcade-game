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
    removeTextSlow : function(el) {
        var el = document.getElementById(el);
        el.classList.add('fadeOut');
    },
    removeText: function(el) {
        var el = document.getElementById(el);
        el.parentNode.removeChild(el);
    },
    setInnerText : function(el, text) {
        el.innerHTML = text;
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
    lives : 3,
    points : 1,
    playerSet : false,
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

    }
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
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y, collision) {
    this.sprite = '';
    this.width = 80;
    this.height = 171;
    this.x = x;
    this.y = y;
    this.collision = collision;
};

Player.prototype.render = function(dt) {
    var canvas = helper.getCanvas('gameCanvas');
        if (game.gameOver === false) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    else {
        var text = 'Game over';
        helper.drawGameOver(Resources.get(this.sprite), this.x, this.y, 90, this.width, this.height);
        //redraw whole canvas
        helper.redraw(0, 0, canvas.width, canvas.height);
        helper.setText(text, canvas.width, canvas.height, game.primMessageColor, game.primFont);


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

                            if (newValue !== startValue) {
                                text = game.levelText(newValue, 'Watch out for them new ones');
                                helper.setInnerText(startText, text);
                                helper.upDateAnim(startText, 'fadeOut');
                                startValue = newValue;
                            }
                        });
                    });
            observer.observe(level, config);
            if (direction === 'up') {
                if(this.y > -80) {
                    this.y -= 82;
                }
                else {
                    game.level += 1;
                    level.innerHTML = game.level;
                    this.setPosition(400, 400);
                    helper.upDateAnim(level, 'scaleUp');
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
    if(Math.abs(this.x - enemy.x) <= collision && Math.abs(this.y - enemy.y) <= collision){
        if(game.lives === 0) {
            game.gameOver = true;
        }
        else {
            game.lives -= 1;

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

if(game.level === 1){
var allEnemies = [];
var i = 0;
while (i < 3){
    var x = 0,
        y = helper.getRandomInt(60, 230),
        speedfactor = 100,
        speed = helper.getRandomInt(1,7) * 0.5,
        enemy = new Enemy(x, y , speed, speedfactor);

    allEnemies.push(enemy);
    i++;
}

var collision = 20;
var player = new Player(400, 400, collision);
}
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
            if (game.gameOver === false) {
        player.handleInput(allowedKeys[keyCode]);
        }
    });