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
		drawText("Enter/Esc to Pause and Unpause\n\nPress Enter to Begin", canvas.width*(20/56), canvas.height*(10/25));
		gID = window.requestAnimationFrame(draw);
	}
	else if(game === 1) {	// Game screen
		clear();
		update();
		render();
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

function update() {
	if(keyState[37] || keyState[65]) {  }	// Left on Keyboard
	if(keyState[39] || keyState[68]) {  }	// Right on Keyboard
	
	
}

function render() {	
	drawSlots();
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
		    	
			}
		      break;
		    case "Escape":
		    case "Enter":
		      if(game === 0) {
		    	  game = 1;
		      }
		      else if(game === 1) {
		    	  if(isRunning) { stop(); }	
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
		    case " ":	// If spacebar is pressed...
		      
		      break;
		    default:
		      return;	// Quit when this doesn't handle the key event.
		  }
		  event.preventDefault();	// Cancel the default action to avoid it being handled twice
		}, true);
}

function fillSlots() {
	var x = 0, y = 0, i = 0, k = 1;
	
	x = SLOT_BASE_X;
	y = SLOT_BASE_Y;
	
	for(i = 0; i < NUM_SLOTS; i++, k++) {
		slots[i] = new cardSlot(x, y);
		
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
	ctx.lineWidth = 3;
	ctx.strokeStyle = 'white';
	ctx.fillStyle = 'white';
	
	var i, j;
	
	for(i = 0, j = 0; i < NUM_SLOTS; i++, j++) {
		
		ctx.strokeStyle = 'red';
		ctx.fillStyle = 'black';
		
		if(i >= NUM_SLOTS/4) {
			ctx.strokeStyle = 'blue';
			ctx.fillStyle = 'black'
		}
		
		if(i >= NUM_SLOTS/2) {
			ctx.strokeStyle = 'blue';
			ctx.fillStyle = 'black'
		}
		
		if(i >= 3*NUM_SLOTS/4) {
			ctx.strokeStyle = 'red';
			ctx.fillStyle = 'black';
		}
		
		ctx.beginPath();
		ctx.rect(slots[i].x, slots[i].y, SLOT_WIDTH, SLOT_HEIGHT);
		ctx.stroke();
		ctx.fill();
	}
}

function initValues() {
	var player = {
			x,
			y,
			dir,
	};
	
	SLOT_WIDTH = canvas.width/11;
	SLOT_HEIGHT = canvas.height/9;
	SLOT_BASE_X = canvas.width/11;
	SLOT_X = canvas.width/11;
	SLOT_BASE_Y = canvas.height/9;
	SLOT_Y = canvas.height/9;
	
}

function cardSlot(x, y) {
		this.x = x;
		this.y = y;
		this.isTaken = false;
}