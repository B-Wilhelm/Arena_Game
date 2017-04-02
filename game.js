// Brett Wilhelm
// Com_S 319

var gID;
var isRunning = true;
var game = 0;
var keyState = {};

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
		drawCard(card.x, card.y);
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

function drawCard(x, y) {	// Coordinates are pointing to the rear-middle of cards
	ctx.lineWidth = 5;
	ctx.strokeStyle = 'blue';
	ctx.fillStyle = 'blue';
	this.x = Math.floor(x);
	this.y = Math.floor(y);
	cardWidth = Math.floor(card.width);
	
	ctx.beginPath();
	ctx.moveTo(this.x-cardWidth/3, this.y);
	ctx.lineTo(this.x+cardWidth/3, this.y);
	ctx.lineTo(this.x, this.y-cardWidth/2);
	ctx.fill();
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(this.x-cardWidth/3, this.y-cardWidth/6);
	ctx.lineTo(this.x-cardWidth/3, this.y+cardWidth/6);
	ctx.lineTo(this.x-cardWidth/2, this.y);
	ctx.fill();
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(this.x+cardWidth/3, this.y-cardWidth/6);
	ctx.lineTo(this.x+cardWidth/3, this.y+cardWidth/6);
	ctx.lineTo(this.x+cardWidth/2, this.y);
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

function update() {	
	getEnemyHeight();
	
	if(keyState[37] || keyState[65]) {  }	// Left on Keyboard
	if(keyState[39] || keyState[68]) {  }	// Right on Keyboard
		
	if(card.x < 0 + card.width/3 + card.width/6) { card.x = 0 + card.width/3 + card.width/6; }
	if(card.x > canvas.width - card.width/3 - card.width/6) { card.x = canvas.width - card.width/3 - card.width/6; }
	
	
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
	card = {
		x : canvas.width/2,
		y : canvas.height * (50/51),
		width : canvas.width/16
	};
	
	
}

function enemy(x, y) {
		this.x = x;
		this.y = y;
		this.speed = 12;
		this.width = canvas.width/20;
		this.isFiring = false;
		this.isAlive = true;
}