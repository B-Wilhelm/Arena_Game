// Brett Wilhelm
// Com_S 319

var gID;
var isRunning = true;
var game = 0;
var keyState = {};
var NUM_SLOTS = 20
var slots = new Array(NUM_SLOTS);
var SLOT_WIDTH;
var SLOT_HEIGHT;
var SLOT_BASE_X, SLOT_X;
var SLOT_BASE_Y, SLOT_Y;
var MOVE_MODIFIER = 3;
var PROJECTILE_SPEED = 3;
var PROJECTILE_RADIUS = 3;
var mousePosX = 0;
var mousePosY = 0;
var timer = 0.00;
var NUM_PLAYERS = 2;
var orb = new Array(NUM_PLAYERS);
var players = new Array(NUM_PLAYERS);
var PLAYER_RADIUS = 16;

function init() {
	ctx = document.getElementById("canvas").getContext('2d');
	ctx.canvas.width  = window.innerWidth;
	ctx.canvas.height = window.innerHeight;
	
	initValues();
	initKeyEvents();
	fillSlots();
	
	gID = window.requestAnimationFrame(draw);
}

function draw() {
	if(game === 0) {	// Initial screen
		clear();
		drawText("Goal is to hit opponent with your projectile\nwhile evading your opponent's projectile.\n\n\nEnter/Esc to Pause and Unpause\n\nWASD to move P1\nArrow Keys to move P2\n\nP1's Projectile uses IJKL\nP2's Projectile uses Numpad8456\n\n\nPress Enter to Begin", canvas.width*(16/56), canvas.height*(6/25));
		gID = window.requestAnimationFrame(draw);
	}
	else if(game === 1) {	// Game screen
		clear();
		update();
		render();
		gID = window.requestAnimationFrame(draw);
	}
	else if(game === 2) {	// P2 Wins
		clear();
		drawText("PLAYER 2\nWINS", canvas.width*(5/11), canvas.height/2);
	}
	else if(game === 3) {	// P1 Wins
		clear();
		drawText("PLAYER 1\nWINS", canvas.width*(5/11), canvas.height/2);
	}
}

function update() {	
	if(keyState[37]) {	// Left on Keyboard
		move('l', 1);
	}
	if(keyState[39]) {	// Right on Keyboard
		move('r', 1);
	}
	if(keyState[38]) {	// Up on Keyboard
		move('u', 1);
	}
	if(keyState[40]) {	// Down on Keyboard
		move('d', 1);
	}
	
	if(keyState[65]) {	// a on Keyboard
		move('l', 0);
	}
	if(keyState[68]) {	// d on Keyboard
		move('r', 0);
	}
	if(keyState[87]) {	// w on Keyboard
		move('u', 0);
	}
	if(keyState[83]) {	// s on Keyboard
		move('d', 0);
	}
	
	if(keyState[74]) {	// j on Keyboard
		moveProjectile(0, 'l');
	}
	if(keyState[76]) {	// l on Keyboard
		moveProjectile(0, 'r');
	}
	if(keyState[73]) {	// i on Keyboard
		moveProjectile(0, 'u');
	}
	if(keyState[75]) {	// k on Keyboard
		moveProjectile(0, 'd');
	}
	
	if(keyState[100]) {	// 4 on Numpad
		moveProjectile(1, 'l');
	}
	if(keyState[102]) {	// 6 on Numpad
		moveProjectile(1, 'r');
	}
	if(keyState[104]) {	// 8 on Numpad
		moveProjectile(1, 'u');
	}
	if(keyState[101]) {	// 5 on Numpad
		moveProjectile(1, 'd');
	}
	
	if(checkVictory(0)) {
		game = 2;
	}
	else if(checkVictory(1)) {
		game = 3;
	}
}

function render() {	
	drawSlots();
	for(var pNum = 0; pNum < NUM_PLAYERS; pNum++) {
		drawPlayer(pNum);
		drawProjectile(pNum);
	}
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
	ctx.fillStyle='yellow';
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
//	document.addEventListener('click', function(e) {
//		for(var i = 0; i < NUM_PLAYERS; i++) {
//			if(orb[i].isActive) { var direction = (Math.atan2(e.pageY - orb[i].y, e.pageX - orb[i].x) * 180 / Math.PI); }
//			else { var direction = (Math.atan2(e.pageY - orb[i].y, e.pageX - orb[i].x) * 180 / Math.PI); }
//			
//			orb[i].targetX = e.pageX;
//			orb[i].targetY = e.pageY;
//		    orb[i].compX = Math.cos(direction * Math.PI/180) * PROJECTILE_SPEED;
//		    orb[i].compY = Math.sin(direction * Math.PI/180) * PROJECTILE_SPEED;
//		    orb[i].isActive = true;
//		}
//	});
	
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
		    	
			}
		      break;
		    case "Escape":
		    case "Enter":
		      if(game === 0) {
		    	  game = 1;
		      }
		      else if(game === 1) {
		    	  if(isRunning) {
		    		  drawText("PAUSED", 10, 35);
		    		  stop();
		    	  }
			      else {
			    	  start();
			      }
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
		    default:
		      return;	// Quit when this doesn't handle the key event.
		  }
		  event.preventDefault();	// Cancel the default action to avoid it being handled twice
		}, true);
}

function moveProjectile(pNum, dir) {
	if(orb[pNum].isActive) {
		if(orb[pNum].x < 0 || orb[pNum].x > canvas.width || orb[pNum].y < 0 || orb[pNum].y > canvas.height) {
			orb[pNum].isActive = false;
			orb[pNum].x = players[pNum].x;
			orb[pNum].y = players[pNum].y;
		}
		else {
//			orb[pNum].x += orb[pNum].compX;
//			orb[pNum].y += orb[pNum].compY;
			
			orb[pNum].isActive = true;
			
			switch(dir) {
			case 'l':
				orb[pNum].x -= PROJECTILE_SPEED;
				break;
			case 'r':
				orb[pNum].x += PROJECTILE_SPEED;
				break;
			case 'u':
				orb[pNum].y -= PROJECTILE_SPEED;
				break;
			case 'd':
				orb[pNum].y += PROJECTILE_SPEED;
				break;
			}
		}
	}
	else {
		orb[pNum].isActive = true;
		
		orb[pNum].x = players[pNum].x;
		orb[pNum].y = players[pNum].y;
	}
}

function move(dir, pNum) {
	switch(dir) {
	case 'l':
		players[pNum].x -= MOVE_MODIFIER;
		break;
	case 'r':
		players[pNum].x += MOVE_MODIFIER;
		break;
	case 'u':
		players[pNum].y -= MOVE_MODIFIER;
		break;
	case 'd':
		players[pNum].y += MOVE_MODIFIER;
		break;
	}
	
	checkPos(dir, pNum);
}

function checkPos(curDir, pNum) {
	if(isWithin(pNum) === true) {
		switch(curDir) {
		case 'l':
			players[pNum].x += MOVE_MODIFIER;
			break;
		case 'r':
			players[pNum].x -= MOVE_MODIFIER;
			break;
		case 'u':
			players[pNum].y += MOVE_MODIFIER;
			break;
		case 'd':
			players[pNum].y -= MOVE_MODIFIER;
			break;
		}
	}
	
	if(players[pNum].x-PLAYER_RADIUS < 0) { players[pNum].x = PLAYER_RADIUS+1; }
	if(players[pNum].x+PLAYER_RADIUS > canvas.width) { players[pNum].x = canvas.width-(PLAYER_RADIUS+1); }
	if(players[pNum].y-PLAYER_RADIUS < 0) { players[pNum].y = PLAYER_RADIUS+1; }
	if(players[pNum].y+PLAYER_RADIUS > canvas.height) { players[pNum].y = canvas.height-(PLAYER_RADIUS+1); }
}

function isWithin(pNum) {
	for(var i = 0; i < NUM_SLOTS; i++) {
		if((players[pNum].x+PLAYER_RADIUS>slots[i].x) && (players[pNum].x-PLAYER_RADIUS<(slots[i].x+SLOT_WIDTH)) && (players[pNum].y+PLAYER_RADIUS>slots[i].y) && (players[pNum].y-PLAYER_RADIUS<(slots[i].y+SLOT_HEIGHT))) {
			return true;
		}
	}
	return false;
}

function checkVictory(pNum) {
	for(var i = 0; i < NUM_SLOTS; i++) {
		if((players[pNum].x+PLAYER_RADIUS>orb[Math.abs(pNum-1)].x) && (players[pNum].x-PLAYER_RADIUS<(orb[Math.abs(pNum-1)].x+PROJECTILE_RADIUS)) && (players[pNum].y+PLAYER_RADIUS>orb[Math.abs(pNum-1)].y) && (players[pNum].y-PLAYER_RADIUS<(orb[Math.abs(pNum-1)].y+PROJECTILE_RADIUS))) {
			return true;
		}
	}
	return false;
}

function fillSlots() {
	var x = 0, y = 0, i = 0, k = 1;
	
	x = SLOT_BASE_X;
	y = SLOT_BASE_Y;
	
	for(i = 0; i < NUM_SLOTS; i++, k++) {
		slots[i] = new pillar(x, y);
		
		if(k >= (NUM_SLOTS/4)) {
			x = SLOT_BASE_X;
			y += 2*SLOT_Y;
			k = 0;
		}
		else {
			x += 2*SLOT_X;
		}
	}
}

function drawSlots() {
	ctx.lineWidth = 4;
	
	var i, j;
	
	for(i = 0, j = 0; i < NUM_SLOTS; i++, j++) {
		
		ctx.strokeStyle = 'red';
		ctx.fillStyle = 'black';
		
		if(i >= NUM_SLOTS/4) {
			ctx.strokeStyle = 'lightblue';
			ctx.fillStyle = 'black'
		}
		
		if(i >= NUM_SLOTS/2) {
			ctx.strokeStyle = 'lightblue';
			ctx.fillStyle = 'black'
		}
		
		if(i >= 3*NUM_SLOTS/4) {
			ctx.strokeStyle = 'red';
			ctx.fillStyle = 'black';
		}
		
		ctx.beginPath();
		ctx.rect(slots[i].x, slots[i].y, SLOT_WIDTH, SLOT_HEIGHT);
		ctx.stroke();
	}
}

function drawPlayer(pNum) {
	ctx.lineWidth = 3;
	ctx.strokeStyle = 'yellow';
	ctx.fillStyle = 'black';
	
	ctx.beginPath();
	ctx.arc(players[pNum].x, players[pNum].y, PLAYER_RADIUS, 0, 2 * Math.PI, false);
	ctx.stroke();
	ctx.fill();
}

function drawProjectile(pNum) {
	if(orb[pNum].isActive) {
		ctx.lineWidth = 3;
		ctx.strokeStyle = 'white';
		ctx.fillStyle = 'white';
		
		ctx.beginPath();
		ctx.arc(orb[pNum].x, orb[pNum].y, PROJECTILE_RADIUS, 0, 2 * Math.PI, false);
		ctx.stroke();
		ctx.fill();
	}
}

function initValues() {
	SLOT_WIDTH = canvas.width/11;
	SLOT_HEIGHT = canvas.height/9;
	SLOT_BASE_X = canvas.width/11;
	SLOT_X = canvas.width/11;
	SLOT_BASE_Y = canvas.height/9;
	SLOT_Y = canvas.height/9;
	
	for(var i = 0; i < NUM_PLAYERS; i++) {
		players[i] = new player();
		orb[i] = new projectile();
	}
	
	players[0].x = canvas.width/11;
	players[0].y = canvas.height/2;
	players[1].x = 10*canvas.width/11;
	players[1].y = canvas.height/2;
}

function pillar(x, y) {
		this.x = x;
		this.y = y;
		this.isTaken = false;
}

function projectile() {
		this.x = 0;
		this.y = 0;
		this.targetX = 0;
		this.targetY = 0;
		this.compX = 0;
		this.compY = 0;
		this.isActive = false;
}

function player() {
		x = 0;
		y = 0;
		isAlive = true;
}