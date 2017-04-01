// Brett Wilhelm
// Com_S 319

var gID;
var isRunning = true;
var keyState = {};
var enemies = [];
var enemyPop = 32;
var enemyDir = 'r';
var rowLimit = 8;
var enemyHeight = 0;
var game = 0;
var enemyCount;
var laserList = [];
var canFire = true;

function init() {
	ctx = document.getElementById("canvas").getContext('2d');
	ctx.canvas.width  = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	
	initValues();
	initKeyEvents();
	
	gID = window.requestAnimationFrame(draw);
}

function draw() {
	if(game === 0) {	// Initial screen
		drawText("Enter/Esc to Pause and Unpause\n\nLeft/Right Arrow Keys to Move\n\nSpacebar to Fire\n\n\nPress Enter to Begin", canvas.width*(20/56), canvas.height*(10/25));
		gID = window.requestAnimationFrame(draw);
	}
	else if(game === 1) {	// Game screen
		update();
		clear();
		drawShip(ship.x, ship.y);
		drawEnemies();
		drawLasers();
		drawSurvivalLine();
		drawText("Enemy Count: " + enemyCount, 50, 35);
		gID = window.requestAnimationFrame(draw);
	}
	else if(game === 2) {	// Failure screen
		clear();
		drawText("YOU\nLOSE", canvas.width*(5/11), canvas.height/2);
	}
	else if(game === 3) {	// Success screen
		clear();
		drawText("YOU\nWIN", canvas.width*(5/11), canvas.height/2);
	}
}

function drawShip(x, y) {	// Coordinates are pointing to the rear-middle of ships
	ctx.lineWidth = 5;
	ctx.strokeStyle = 'blue';
	ctx.fillStyle = 'blue';
	this.x = Math.floor(x);
	this.y = Math.floor(y);
	shipWidth = Math.floor(ship.width);
	
	ctx.beginPath();
	ctx.moveTo(this.x-shipWidth/3, this.y);
	ctx.lineTo(this.x+shipWidth/3, this.y);
	ctx.lineTo(this.x, this.y-shipWidth/2);
	ctx.fill();
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(this.x-shipWidth/3, this.y-shipWidth/6);
	ctx.lineTo(this.x-shipWidth/3, this.y+shipWidth/6);
	ctx.lineTo(this.x-shipWidth/2, this.y);
	ctx.fill();
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(this.x+shipWidth/3, this.y-shipWidth/6);
	ctx.lineTo(this.x+shipWidth/3, this.y+shipWidth/6);
	ctx.lineTo(this.x+shipWidth/2, this.y);
	ctx.fill();
	ctx.stroke();
}

function drawEnemies() {
	ctx.lineWidth = 3;
	ctx.strokeStyle = 'red';
	ctx.fillStyle = 'red';

	var count = 0;
	
	for(var i = 0; i < enemies.length; i++) {
		if(enemies[i].isAlive) {
			ctx.beginPath();
			ctx.moveTo(Math.floor(enemies[i].x-enemies[i].width/2.5), Math.floor(enemies[i].y));
			ctx.lineTo(Math.floor(enemies[i].x+enemies[i].width/2.5), Math.floor(enemies[i].y));
			ctx.lineTo(Math.floor(enemies[i].x), Math.floor(enemies[i].y+enemies[i].width/2));
			ctx.fill();
			ctx.stroke();
			count++;
		}
	}
	
	enemyCount = count;
}

function drawSurvivalLine() {
	ctx.lineWidth = 3;
	ctx.strokeStyle = 'red';
	
	ctx.beginPath();
	ctx.moveTo(0, canvas.height*13/14-ship.width*(4/17));
	ctx.lineTo(canvas.width, canvas.height*13/14-ship.width*(4/17));
	ctx.lineWidth = 2;
	ctx.stroke();
}

function drawLasers() {
	ctx.lineWidth = 3;
	ctx.strokeStyle = 'white';
	
	for(var i = 0; i < laserList.length; i++) {
		ctx.beginPath();
		ctx.moveTo(laserList[i].x, laserList[i].originY);
		ctx.lineTo(laserList[i].x, laserList[i].endY);
		ctx.lineWidth = 3;
		ctx.stroke();
		
		laserList[i].framesLeft--;	// Laser display decay
		
		if(laserList[i].framesLeft == 0) { laserList.splice(i); }
	}
	
}

function update() {	
	getEnemyHeight();
	
	if(keyState[37] || keyState[65]) { left();  }
	if(keyState[39] || keyState[68]) { right(); }
	
	for(var i = 0; i < enemies.length; i++) {
		if(enemyDir === 'r') { enemies[i].x += enemies[i].speed; }
		else if(enemyDir === 'l') { enemies[i].x -= enemies[i].speed; }
		else { /* Won't happen. */ }
	}
	
	if(ship.x < 0 + ship.width/3 + ship.width/6) { ship.x = 0 + ship.width/3 + ship.width/6; }
	
	if(ship.x > canvas.width - ship.width/3 - ship.width/6) { ship.x = canvas.width - ship.width/3 - ship.width/6; }
	
	if(enemies[rowLimit-1].x + enemies[rowLimit-1].width/2 >= canvas.width) {
		enemyDir = 'l';
		enemyApproach();	// Moves enemies down a row upon making contact with sides of window
	}
	if(enemies[0].x - enemies[0].width/2 <= 0) {
		enemyDir = 'r';
		enemyApproach();
	}
	
	if(enemyCount == 0) { game = 3; }
	
	if(enemyHeight >= canvas.height*6/7) { game = 2; }
}

function enemyApproach() {
	for(var i = 0; i < enemies.length; i++) {
		if(enemyDir === 'r' || enemyDir === 'l') {
			enemies[i].y += canvas.height/24;
		}
	}
}

function getEnemyHeight() {
	for(var i = 0; i < enemies.length; i++) {
		if(enemies[i].y > enemyHeight && enemies[i].isAlive) {
			enemyHeight = enemies[i].y;
		}
	}
}

function left() {
	ship.x -= ship.SPEED;
}

function right() {
	ship.x += ship.SPEED;
}

function fire() {
	var enemiesHit = [];
	var enemiesHitHeight = [];

	for(var i = 0; i < enemies.length; i++) {
		if(hit(enemies[i])) {
			enemiesHit.push(enemies[i]);
			enemiesHitHeight.push(enemies[i].y+enemies[i].width/2);
		}
	}

	if(enemiesHit.length > 0) {
		laserList.push(new laser(enemiesHitHeight[enemiesHitHeight.length-1]));
		enemiesHit[enemiesHit.length-1].isAlive = false;
	}
	else {
		laserList.push(new laser(0));
	}
}

function hit(enemy) {
	var laser = ship.x;

	if((laser > enemy.x-enemy.width/2) && (laser < enemy.x+enemy.width/2) && (enemy.isAlive)) { return true; }
	else { return false; }
}

function stop() {
	window.cancelAnimationFrame(gID);
	isRunning = false;
}

function start() {
	if(!isRunning) {
		globalID = requestAnimationFrame(draw);
		isRunning = true;
	}
}

function clear() {
	ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
}

function drawText(str, x, y) {
	ctx.font="32px Verdana";
	ctx.fillStyle='white';
	fillTextMultiLine(ctx, str, x, y);
}

function fillTextMultiLine(ctx, text, x, y) {
	  var lineHeight = ctx.measureText("M").width * 1.2;
	  var lines = text.split("\n");
	  for (var i = 0; i < lines.length; ++i) {
	    ctx.fillText(lines[i], x, y);
	    y += lineHeight;
	  }
	}

function initKeyEvents() {	
	window.addEventListener('keydown',function(e){
	    keyState[e.keyCode || e.which] = true;
	},true);    
	window.addEventListener('keyup',function(e){
	    keyState[e.keyCode || e.which] = false;
	},true);
	
	window.addEventListener("keydown", function (event) {
		  if (event.defaultPrevented) {
		    return;		// Do nothing if the event was already processed
		  }

		  switch (event.key) {
		    case " ":
		    if(game === 1) {
		    	if(canFire) {
			    	  fire();
			    	  canFire = false;
			      }
			}
		      break;
		    case "Escape":
		    case "Enter":
		      if(game === 0) {
		    	  game = 1;
		      }
		      else if(game === 1) {
		    	  if(isRunning && (enemyHeight < canvas.height*6/7)) { stop(); }
			      else { start(); }  
		      }
		      break;
		    default:
		      return;	// Quit when this doesn't handle the key event.
		  }
		  event.preventDefault();	// Cancel the default action to avoid it being handled twice
		}, true);
	
	window.addEventListener("keyup", function (event) {
		  if (event.defaultPrevented) {
		    return;		// Do nothing if the event was already processed
		  }

		  switch (event.key) {
		    case " ":
		      if(!canFire) {
		    	  canFire = true;
		      }
		      break;
		    default:
		      return;	// Quit when this doesn't handle the key event.
		  }
		  event.preventDefault();	// Cancel the default action to avoid it being handled twice
		}, true);
}

function initValues() {
	ship = {
		x : canvas.width/2,
		y : canvas.height * (50/51),
		dir : 'r',
		SPEED : 20,
		width : canvas.width/16
	};
	
	var xOrig = canvas.width/32;
	var yOrig = canvas.height/14 ;
	var x;
	var y;
	
	for(var i = 0; i < enemyPop; i++) {
		if(i % rowLimit == 0) {
			y = yOrig * ((i / rowLimit) + 1);
			x = xOrig;
		}
		else {
			x = xOrig + canvas.width/18 * ((i % rowLimit) );
		}
		
		enemies.push( new enemy(Math.floor(x), Math.floor(y) ));
	}
}

function enemy(x, y) {
		this.x = x;
		this.y = y;
		this.speed = 12;
		this.width = canvas.width/20;
		this.isFiring = false;
		this.isAlive = true;
}

function laser(newY) {
	this.x = ship.x;
	this.originY = ship.y-ship.width/2;
	this.endY = newY;
	this.framesLeft = 2;
}