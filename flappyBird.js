var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

// load images
var bird = new Image();
var bg = new Image();
var fg = new Image();
var pipeNorth = new Image();
var pipeSouth = new Image();

bird.src = "images/bird.png";
bg.src = "images/bg.png";
fg.src = "images/fg.png";
pipeNorth.src = "images/pipeNorth.png";
pipeSouth.src = "images/pipeSouth.png";

// audio files
var fly = new Audio("sounds/fly.mp3");
var scor = new Audio("sounds/score.mp3");
var death = new Audio("sounds/shatter.mp3");

// some variables
var gap = 85;
var constant;
var bX = 20;
var bY = 150;

var gravity = 0.005;
var fallRate = 2;
var score = 0;
var flapTime = 0;

// pipe coordinates
var pipe = [];

pipe[0] = {
	x: cvs.width,
	y: 0
};

// on key down
document.addEventListener("keydown", moveUp);

function moveUp() {
	bird.src = "images/bird_flap.png";
	fallRate = 0;	// reset gravity and wing animation
	flapTime = 0;
	bY -= 25;
	fly.play();
}

function layPipe(i) {
	constant = pipeNorth.height + gap;
	ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y);
	ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y + constant);

	pipe[i].x--;

	if (pipe[i].x === 125) {
		// add a new set of pipes
		pipe.push({
			x: cvs.width,
			y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height
		});
	}
}

function changeBird() {
	if (bY < 20) {
		bY = 25;	// bird on ceiling
		return;
	}

	if (bY > 374) {
		bY = 375;	// bird on floor
		bX--;		// move dead bird with background
		bird.src = "images/bird_dead.png";
		return;
	}

	// Make more gravity
	bY += .5 * gravity * Math.pow(fallRate, 2);
	fallRate++;

	if (flapTime > 4) {
		bird.src = "images/bird.png"; // Back to un-flapped image
	}

	flapTime++;
}

function drawScoreBoard() {
	ctx.fillStyle = "#000";
	ctx.font = "20px Verdana";
	ctx.fillText("Score: " + score, 10, cvs.height - 20);
}

function gameOver() {
	location.reload(); // GAME OVER MAN!  Reload the page
}


// MAIN LOOP: update and draw
function draw() {
	ctx.drawImage(bg, 0, 0);

	for (var i = 0; i < pipe.length; i++) {
		layPipe(i);

		// detect collisions
		if (bX + bird.width >= pipe[i].x 
			&& bX <= pipe[i].x + pipeNorth.width 
			&& (bY <= pipe[i].y + pipeNorth.height || bY + bird.height >= pipe[i].y + constant)
				|| bY + bird.height >= cvs.height - fg.height) {
			death.play();
			fallRate += fallRate; // fall fast
			setTimeout(gameOver, 1000);
		}

		if (pipe[i].x === 5) {
			score++;
			scor.play();
		}
	}

	ctx.drawImage(fg, 0, cvs.height - fg.height);
	ctx.drawImage(bird, bX, bY);

	changeBird();
	drawScoreBoard();
	requestAnimationFrame(draw);
}

draw();
