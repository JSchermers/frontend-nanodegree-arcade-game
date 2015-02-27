'use strict';

/*
 * helper object. Every 'generic' function is stored in the helper object even when some of the
 * functions are being used only once
 */
var helper = {
    /* Draws the canvas again and manipulates every pixel.
     * Copied from udacity course.
     * @param {Number} x The top left x coordinate
     * @param {Number} y The top left y coordinate
     * @param {Number} width The width of the canvas
     * @param {Number} height The height of the canvas
     */
    redraw: function(x, y, width, height) {
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
    /* Draws the gameOver canvas. First saves current state. Rotates the canvas,
     * draws the player image and restores state
     * @param {String} image The player image to draw
     * @param {Number} x The x coordinate of the player
     * @param {Number} y The y coordinate of the player
     * @param {Number} angle The angle to rotate the image
     * @param {Number} width The width of the player object
     * @param {Number} height The height of the player object
     */
    drawGameOver: function(image, x, y, angle, width, height) {
        ctx.save();
        ctx.translate(x + 90, y + 90);
        ctx.rotate(angle * Math.PI/180);
        ctx.drawImage(image, -(width / 2), -(height / 2));
        ctx.restore();
    },
    /*
     * Draws text on the canvas on a set position
     * @param {String} text The text to draw
     * @param {Number} x The x start position of the text
     * @param {Number} y The y start position of the text
     * @param {String} color The color the text to draw
     * @param {String} font The font size and font family
     */
    setText: function(text, x, y, color, font) {
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.fillText(text, x / 4, y / 2);
    },
    /*
     * Returns a random integer between min (included) and max (excluded)(from Mozilla)
     * @param {Number} min The minimum number (included)
     * @param {Number} mx The maximim number (excluded)
     */
    getRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },
    /*
     * Make every pixel gray. From Udacity course
     * @param {Number} r The red value
     * @param {Number} g The green value
     * @param {Number} b The blue value
     * @param {Number} a The aplha value
     */
    makePixelGreyScale: function(r, g, b, a){
        var y = (0.3 * r) + (0.59 * g) + (0.11 * b);
        return {r: y, g: y, b: y, a: a};
    },
    /*
     * Creates dom element via document fragment
     * @param {String} append The element the dom element should be attached to
     * @param {String} el The element to create
     * @param {String} id The id set on the new element
     * @param {String} cssClass The .class set on the new element
     * @param {String} text The text to be set in the dom element
     */
    createDocumentElement: function(append, el, id, cssClass, text) {
        var appendTo = document.getElementById(append),
            docfrag = document.createDocumentFragment(),
            elm = document.createElement(el);

        elm.id = id;

        if(text) {
            elm.innerHTML = text;
        }

        if(cssClass) {
            elm.classList.add(cssClass);
        }
        docfrag.appendChild(elm);
        appendTo.appendChild(docfrag);
    },
    /*
     * Sets a class on a given element
     * @param {String} id The element the .class is set
     * @param {String} cssClass The classname to be added;
     */
    setClass: function(el, cssClass) {
        var elm = document.getElementById(el);
        elm.classList.add(cssClass);
    },
    /*
     * Removes a document element on a given id
     * @param {String} id The element that sould be removed
     */
    removeEl: function(el) {
        // because of repeating code check if element is not null
        var elm = document.getElementById(el);
        if(elm !== null) {
            elm.parentNode.removeChild(elm);
        }
        elm = null;
    },
    /*
     * Sets text in a document element on a given id
     * @param {String} el The element the innerHTML should be set
     * @param {String} text The text to set
     */
    setInnerText: function(el, text) {
        // because of repeating code check if element is not null
        if(el !== null) {
            el.innerHTML = text;
        }
        el = null;
    },
    /*
     * Gets a dom element on a given id
     * @param {String} id The element that should be get
     */
    getDomElement: function(el) {
        var elm = document.getElementById(el);
        return elm;
    },
    /*
     * Update the animation on a dom element by adding and removing a class.
     * Settimeout being used to delay.
     * @param {String} el The element the class should be added and removed
     */
    upDateAnim: function(el, cssClass) {
        // because of repeating code check if element is not null
        if(el !== null) {
            if(el.classList !== 0) {
             el.classList.remove(cssClass);
            }

            setTimeout(function() {
               el.classList.add(cssClass);
           }, 1000);
        }
    }
};

/*
 * Game object for storing game specific things
 */
var game = {
    gameOver: false,
    level: 1,
    lives: 3,
    win: 5,
    startEnemies: 3,
    numberLives: '',
    playerSet: false,
    gameOverText: 'Game over',
    gameWinText: 'You win',
    primMessageColor: 'red',
    primFont: '60px Calibri',
    secMessageColor: 'blue',
    secFont: '14px Verdana',
    /*
     * Sends both the level and the gametext
     * @param {Number} level The game level the player is in
     * @param {String} text The text the user sees when starting a new level
     */
    levelText: function(level, text) {
        var textEl = text ? text : 'Get to the Chopper',
            totalText = 'Level ' + level + ' ' + textEl;
        return totalText;

    },
    /*
     * Draws initially 3 enemies on screen. When level increases draws one more enemy and
     * adds collision of the player
     */
    gameSettings: function(gameLevel, collision) {
        var collisionPlayer = collision || 20,
            speedfactor = 100,
            x = 0,
            y = 0,
            speed = 0,
            i = 0;

            // create three enemy objects in level one
            if(gameLevel === 1) {
                while(i < game.startEnemies) {
                    // get randomInt between
                    y = helper.getRandomInt(60, 230);

                    // set random speed
                    speed = helper.getRandomInt(1,7) * 0.5;

                    // create new enemy object
                    enemy = new Enemy(x, y ,speed, speedfactor);

                    // add enemy object to allEnemiesArray
                    allEnemies.push(enemy);
                    i++;
                }
            // create player object and set it 2 start position + adds collision
            player = new Player(400, 400, collisionPlayer);
            }

            // when levelnumber goes up, a new enemy is added to the game, who is faster and collision
            // of the player will be bigger to increase difficulty.
            else {
                    speedfactor += 5;
                    player.collision += 4;
                    y = helper.getRandomInt(60, 70);
                    speed = helper.getRandomInt(1,7) * 0.5;

                    // create new BigEnemy object
                    bigEnemy = new BigEnemy(x, y ,speed, speedfactor);

                    // add bigEnemy to alleEnemiesArray
                    allEnemies.push(bigEnemy);
            }

    },
    /*
     * draws the start new game button. Totally in canvas (not in seperate DOM element)
     */
    drawStartNewGame : function() {
        var canvas = helper.getDomElement('gameCanvas'),
            // create new button
            button = new Button(canvas.width/2 - 70, canvas.height/1.8, 140, 60);

        // draw the button on the canvas
        button.draw(10, true, true);

        // set text on the button
        button.text(game.secFont, game.secMessageColor, 'Start new game!');

        // add click listener to the canvas
        canvas.addEventListener('click', function(e) {
            var clickedX = e.pageX - this.offsetLeft,
                clickedY = e.pageY - this.offsetTop;

                // check if mouse position is on the button.
                if(clickedX > button.xPos && clickedX < button.xPos + button.width &&
                    clickedY > button.yPos && clickedY < button.yPos + button.height) {

                    // reload the browser
                    location.reload();

                    // set the cursor to be the pointer
                    e.target.style.cursor = 'pointer';
                }
        }, false);
    },
    /*
     * Function to choose a player
     */
    choosePlayer: function() {
        var playerImages = [
            'images/char-boy.png',
            'images/char-cat-girl.png',
            'images/char-horn-girl.png',
            'images/char-pink-girl.png',
            'images/char-princess-girl.png'
            ];

        // create select players div
        helper.createDocumentElement('body', 'div', 'select-players', 'select-players');

        // create select players p with text
        helper.createDocumentElement('select-players', 'p', 'select-players-text', 'select-players-text', 'Select a player to play the game');

        // get newly created get players div
        var selectPlayer = helper.getDomElement('select-players');

        // loop trough all images and append the image to the selectPlayer
        for(var i = 0; i < playerImages.length; i++) {
            selectPlayer.appendChild(Resources.get(playerImages[i]));
        }

        //get all imgs
        var allPlayerImgs = document.getElementsByTagName('img');

        // loop trough all newly added images
        for(var image = 0; image < allPlayerImgs.length; image++) {
            //attach SelectplayerNow function to eventlistener click to all images
            allPlayerImgs[image].addEventListener('click', game.selectPlayerNow, false);
        }
    },
    /*
     * select clicked player img
     */
    selectPlayerNow: function() {
        // get the src
        var playerFullUrl = this.src,
            playerIndx = playerFullUrl.indexOf('images'),
            playerSubUrl = playerFullUrl.slice(playerIndx, playerFullUrl.length);

        //set player source
        player.sprite = playerSubUrl;
        //player selected
        game.playerSet = true;

        // remove dom element selectplayers
        helper.removeEl('select-players');

        game.addGameDescription();
    },
    /*
     * Add game description text and remove at after some time
     */
    addGameDescription: function() {
        // set game text
        var startGameText = game.levelText(game.level, 'Get accross the road and watch the enemies');

        // create p element in the body with the text
        helper.createDocumentElement('body', 'p', 'start-text', 'start-text', startGameText);

        // add class after 3 sec.
        setTimeout(function(){
            helper.setClass('start-text', 'fadeOut');
        }, 3000);

        // in player set show the meta div.
        if(game.playerSet) {
            helper.setClass('meta', 'fadeIn');
        }
    }
};

/*
 * Enemies our player must avoid
 * function name added so you van look it up with constructor.name
 * @param {Number} x The x position of the enemy
 * @param {Number} y The y position of the enemy
 * @param {Number} speed The speed of the enemy
 * @param {Number} speedfactor The multiplier of the speed of the enemy
*/
var Enemy = function Enemy(x, y, speed, speedfactor) {
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

/*
 * Update the enemy's position, required method for game
 * Parameter: dt, a time delta between ticks
 * @param {Number} dt Date time difference for animating
 */
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    var canvas = helper.getDomElement('gameCanvas');

    if(this.x < canvas.width) {
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

/*
 * Draw the enemy on the screen, required method for game
 */
Enemy.prototype.render = function() {
    //check constructor name to render different enemie objects
    if(this.constructor.name === 'Enemy') {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    //check constructor name to render different enemie objects
    if(this.constructor.name === 'BigEnemy') {
        ctx.save();
        ctx.scale(1.2,1.2);
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        ctx.restore();
    }


};
/*
 * BigEnemies our player must avoid
 * function name added so you van look it up with constructor.name
 * @param {Number} x The x position of the BigEnemy
 * @param {Number} y The y position of the BigEnemy
 * @param {Number} speed The speed of the BigEnemy
 * @param {Number} speedfactor The multiplier of the speed of the BigEnemy
*/
var BigEnemy = function BigEnemy(x, y, speed, speedfactor) {
    //call parent function
    Enemy.call(this, x, y, speed, speedfactor);
};

// delegate BigEnemy.prototype to Enemy.protoype. From Udacity course
BigEnemy.prototype = Object.create(Enemy.prototype);

// set constructor of BigEnemy to Enemy. From Udacity course
BigEnemy.prototype.constructor = BigEnemy;


/*
 * The player object
 * @param {Number} x The x position of the player
 * @param {Number} y The y position of the player
 * @param {Number} collision The collision of the player, so when in matches with enemy a live will
 * be substracted
*/
var Player = function(x, y, collision) {
    this.sprite = '';
    this.x = x;
    this.y = y;
    this.collision = collision;
    this.width = 80;
    this.height = 100;
};

/*
 * The render method of the player
 */

Player.prototype.render = function() {
    var canvas = helper.getDomElement('gameCanvas');

    if(game.gameOver === false) {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    else {
        helper.drawGameOver(Resources.get(this.sprite), this.x, this.y, 90, this.width, this.height);
        // redraw whole canvas
        helper.redraw(0, 0, canvas.width, canvas.height);
        helper.setText(game.gameOverText, canvas.width, canvas.height, game.primMessageColor, game.primFont);
        helper.removeEl('meta');
        // start new game button
        game.drawStartNewGame();
    }

    if (game.level === game.win) {
        helper.redraw(0, 0, canvas.width, canvas.height);
        helper.setText(game.gameWinText, canvas.width, canvas.height, game.primMessageColor, game.primFont);
        helper.removeEl('meta');
        // start new game button
        game.drawStartNewGame();
     }
};
/*
 * Function to handle the input to move the player
 * @param {String} direction The direction the player can move to
 */
Player.prototype.handleInput = function(direction) {
    var canvas = helper.getDomElement('gameCanvas'),
        level = helper.getDomElement('level-number') || 1,
        startText = helper.getDomElement('start-text'),

        // the config settings for the mutation observer
        config = { attributes: false, childList: true, characterData: true, characterOldData: true },
        newValue = '',
        text = '',
        startValue = '',

        // create mutation observer and watch changes
        observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                newValue = mutation.target.innerHTML;

                // if the innerHTML value differs form startvalue
                if (newValue !== startValue && game.level < game.win ) {
                    text = game.levelText(newValue, 'Watch out for them new ones and more collision');
                    helper.setInnerText(startText, text);
                    helper.upDateAnim(startText, 'fadeOut');
                    startValue = newValue;
                }
            });
        });
        // observe the level dom element with the specfified config settings
        observer.observe(level, config);
        if(direction === 'up') {

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

/*
 * removed because implemented with player.setposition
 *
 * Player.prototype.update = function(dt) {
 * };
 */

/*
 * Check player collisions with enemy
 * @param {Object} enemy The enemy object to check collision with
 * @param {Number} collision The collision number. When increased the area the player and enemy
 * can collide gets bigger
 *
*/

Player.prototype.checkCollisions = function(enemy, collision){
    if(!game.numberLives) {
        // set number lives
        game.numberLives = helper.getDomElement('number-lives');
    }

    // check when player and enemy collides
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

/*
 * Set player position
 * @param {Number} x The x position to reset the player to
 * @param {Number} y The y position to reset the player to
 */
Player.prototype.setPosition = function(x, y){
   this.x = x;
   this.y = y;
};

/*
 * A button to draw on canvas
 * @param {Number} x The x position of the button to draw
 * @param {Number} y The y position of the button to draw
 * @param {Number} width The width of the button to draw
 * @param {Number} height The height of the button to draw
 */
var Button = function Button(x, y, width, height) {
    this.xPos = x;
    this.yPos = y;
    this.width = width;
    this.height = height;
};


/* Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius (From Internet stackoverflow)
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} radius The corner radius. Defaults to 5;
 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
 * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
 */
Button.prototype.draw = function(radius, fill, stroke){
    if(typeof stroke == 'undefined') {
            stroke = true;
    }
    if(typeof radius === 'undefined') {
        radius = 5;
    }
    ctx.beginPath();
    ctx.moveTo(this.xPos + radius, this.yPos);
    ctx.lineTo(this.xPos + this.width - radius, this.yPos);
    ctx.quadraticCurveTo(this.xPos + this.width, this.yPos, this.xPos + this.width, this.yPos + radius);
    ctx.lineTo(this.xPos + this.width, this.yPos + this.height - radius);
    ctx.quadraticCurveTo(this.xPos + this.width, this.yPos + this.height, this.xPos + this.width - radius, this.yPos + this.height);
    ctx.lineTo(this.xPos + radius, this.yPos + this.height);
    ctx.quadraticCurveTo(this.xPos, this.yPos + this.height, this.xPos, this.yPos + this.height - radius);
    ctx.lineTo(this.xPos, this.yPos + radius);
    ctx.quadraticCurveTo(this.xPos, this.yPos, this.xPos + radius, this.yPos);
    ctx.closePath();

    if (stroke) {
        ctx.stroke();
    }

    if (fill) {
        ctx.fill();
    }
};

/*
 * The text on the button to draw
 * @param {String} font The font and size for the buttontext
 * @param {String} color The color of the buttontext
 * @param {String} text The text to be drawn on the button
 */
Button.prototype.text = function(font, color, text) {
    var height = this.yPos + this.height / 2 + 4;

    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(text, this.xPos + 10, height);
};

// Now instantiate your objects.
// create the allEnemies array
// create the player var
// create the var to store the enemy
// create the var to store the Big enemy
var allEnemies = [];
var player = null;
var enemy = null;
var bigEnemy = null;

// Start the game with the current game level
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