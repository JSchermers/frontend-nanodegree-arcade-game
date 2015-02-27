frontend-nanodegree-arcade-game
===============================

Students should use this rubric: https://www.udacity.com/course/viewer#!/c-ud015/l-3072058665/m-3072588797

for self-checking their submission.

## Game rules

Select a player

When player reaches the water + 1 up arrow he/she reaches the next level and starts at initial position.

When the player reaches the next level an additional BigEnemy is added as well as the three starting enemies.

When the player collides with an enemy  it gets set back at the starting position and one live is substracted.

When there aren't any lives left the gameover screen is drawn. And you can start a new game

When the player reaches the level set in game.win (set to 5). He/ she has won the game and so is drawn. You can then choose to play the game again.


#sources used for this game

*	[mdn]{https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/ "canvasApi"}
*	[mdn]{https://developer.mozilla.org/nl/docs/Web/JavaScript/ "Javascript"}
*	[Paciello group]{http://www.paciellogroup.com/blog/2015/02/html5-canvas-sub-dom/ "Accessible canvas"} - did not implement because canvas was dynamically added.
*	[Addy Osmani - mutation observers]{http://addyosmani.com/blog/mutation-observers/}
*	[StackOverflow - contructor.name]{http://stackoverflow.com/questions/3905144/how-to-retrieve-the-constructors-name-in-javascript}

## to do

*	improve collision
* 	add sounds
*	add points
*	improve BigEnemy position


