window.addEventListener("load", startGame);
const gravity = 0.2;
const velocity = 20;
const jump = 70;
var n = 0;
var background;
var score;
var ground;
var earth = [];
var obstacle1 = [];
var obstacle2 = [];
var obstacle3 = [];
var obstacle4 = [];
var sky = [];
var bird = [];
var jumpSound;
var gameOverSound;
// var bird;
Component.prototype.crashWith = function(otherobj) {
	var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash = true;
    if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
        crash = false;
    }
    return crash;
}
var gamePlayer;
function startGame() {
	gameArea.start();
	background = new Component(0,0,gameArea.canvas.width,gameArea.canvas.height,"#eee");
	score = new Component(25,25,"SCORE: ",15,"#000","text");
	ground = new Component(0,180,550,10,"sprites.png","image",16,274,544,8);
	// obstacle1 = new Component(350,145,70,50,"sprites.png","image",156,69,49,33);
	// obstacle2 = new Component(450,145,40,50,"sprites.png","image",161,116,32,33);
	// obstacle3 = new Component(250,150,25,45,"sprites.png","image",227,62,23,46);
	// obstacle4 = new Component(180,145,18,40,"sprites.png","image",227,117,15,33);
	// sky = new Component(230,30,50,40,"sprites.png","image",473,14,46,13);
	// bird = new Component(180,50,30,30,"sprites.png","image",156,162,42,30);
	gamePlayer = new Component(15,140,50,50,"sprites.png","image",7,47,40,43);
	jumpSound = new Music("Jump.wav");
	gameOverSound = new Music("Die.wav");
	updateGameArea();
}
var gameArea = {
	canvas: document.createElement("canvas")
}

gameArea.start = function() {
	this.canvas.width = 550;
	this.canvas.height = 200;
	this.context = this.canvas.getContext("2d");
	document.getElementById("showGame").appendChild(this.canvas);
	this.intervalN = 0;
	var o = this.canvas.getBoundingClientRect();
	this.canvas.addEventListener("mousedown", function(e) {
		gameArea.x = e.pageX-o.left;
		gameArea.y = e.pageY-o.top;
	});
	this.canvas.addEventListener("mouseup", function(e) {
		gameArea.x = false;
		gameArea.y = false;
	});
	window.addEventListener("keydown", function(e) {
		gameArea.key = e.keyCode;
	});
	window.addEventListener("keyup", function(e) {
		gameArea.key = false;
	})
}

gameArea.clear = function() {
	this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
}

gameArea.stop = function() {
	clearInterval(this.interval);
	gameOverSound.play();
	var gameOver = new Component(220,50,120,40,"sprites.png","image",556,36,83,24);
	gameOver.update();
	/*var tryAgain = new Component(270,110,30,30,"sprites.png","image",599,228,34,30);
	tryAgain.update();*/
	if(!localStorage.getItem("scoreMax")) {
		localStorage.setItem("scoreMax", gameArea.intervalN);
	}else {
		if(gameArea.intervalN > localStorage.getItem("scoreMax")) {
			localStorage.setItem("scoreMax", gameArea.intervalN);
		}
	}
	var scoreMax = new Component(200,130,"MAX SCORE: " + localStorage.getItem("scoreMax"),20,"#000","text");
	scoreMax.update();
}

function Component(x,y,width,height,color,type,sx,sy,swidth,sheight) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.color = color;
	this.type = type;
	this.sx = sx;
	this.sy = sy;
	this.swidth = swidth;
	this.sheight = sheight;
	this.acelerationGravity = 0;
}

Component.prototype.update = function() {
	ctx = gameArea.context;
	if(this.type == "image") {
		this.image = new Image();
		this.image.src = this.color;
		if(this.sx == null) {
			ctx.drawImage(this.image,this.x,this.y,this.width,this.height);
		}else {
			ctx.drawImage(this.image,this.sx,this.sy,this.swidth,this.sheight,this.x,this.y,this.width,this.height);
		}
	}else if(this.type == "text"){
		ctx.fillStyle = this.color;
		ctx.font = this.height + "px Arial";
		ctx.fillText(this.width,this.x,this.y); 
	}else {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x,this.y,this.width,this.height);
	}
}

Component.prototype.gravityForce = function() {
	this.acelerationGravity += gravity;
	this.y += this.acelerationGravity;
	this.touchGround();
}

Component.prototype.touchGround = function() {
	var rockBottom = gameArea.canvas.height-this.height-10;
	if(this.y > rockBottom) {
		this.acelerationGravity = 0;
		this.speedX = 0;
		this.y = rockBottom;
	}
}

Component.prototype.crashWith = function(otherobj) {
	var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash = true;
    if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
        crash = false;
    }
    return crash;
}

Component.prototype.touchTo = function() {
	var left = this.x;
    var right = this.x + (this.width);
    var top = this.y;
    var bottom = this.y + (this.height);
    var touch = false;
    if(gameArea.y >= top && gameArea.y <= bottom) {
    	if(gameArea.x >= left && gameArea.x <= right) {
    		touch = true;
    	}
    }
    return touch;
}

function everyInterval(n) {
	if((gameArea.intervalN/n)%1 == 0) {
		return true;
	}else {
		return false;
	}
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function Music(src) {
	this.src = src;
	this.audio = document.createElement("audio");
	this.audio.src = this.src;
	this.audio.controls = false;
	this.audio.preload = true;
	document.body.appendChild(this.audio);
	this.audio.style.display = "none";
}

Music.prototype.play = function() {
	this.audio.play();
}

Music.prototype.pause = function() {
	this.audio.pause();
}

function updateGameArea() {
	var i, r, x;
	x = gameArea.canvas.width;
	r = random(1,5);
	gameArea.clear();
	gameArea.intervalN += 1;
	background.update();
	score.width = "SCORE: " + gameArea.intervalN;
	score.update();
	ground.update();
	for(i=0; i<obstacle1.length; i++) {
		if(gamePlayer.crashWith(obstacle1[i])) {
			gameArea.stop();
			return;
		}
	}
	for(i=0; i<obstacle2.length; i++) {
		if(gamePlayer.crashWith(obstacle2[i])) {
			gameArea.stop();
			return;
		}
	}
	for(i=0; i<obstacle3.length; i++) {
		if(gamePlayer.crashWith(obstacle3[i])) {
			gameArea.stop();
			return;
		}
	}
	for(i=0; i<obstacle4.length; i++) {
		if(gamePlayer.crashWith(obstacle4[i])) {
			gameArea.stop();
			return;
		}
	}

	for(i=0; i<bird.length; i++) {
		if(gamePlayer.crashWith(bird[i])) {
			gameArea.stop();
			return;
		}
	}
	if(gameArea.intervalN == 1 || everyInterval(60,180)) {
		earth.push(new Component(gameArea.canvas.width,185+random(-3,3),70,10,"sprites.png","image",447,249,58,11));
	}

	if(everyInterval(random(80,120))) {
		// earth = new Component(400,185,70,10,"sprites.png","image",447,249,58,11);
		switch (r) {
			case 1:
				obstacle1.push(new Component(x,145+random(-3,3),70,50,"sprites.png","image",156,69,49,33));
				break;
			case 2:
				obstacle2.push(new Component(x,145+random(-3,3),40,50,"sprites.png","image",161,116,32,33));
				break;
			case 3:
				obstacle3.push(new Component(x,150+random(-3,3),25,45,"sprites.png","image",227,62,23,46));
				break;
			case 4:
				obstacle4.push(new Component(x,145,18,40,"sprites.png","image",227,117,15,33));
				break;
		}
	}
	if(gameArea.intervalN == 1 || everyInterval(random(120,180))) {
		sky.push(new Component(x,30+random(-5,6),50,40,"sprites.png","image",473,14,46,13));
	}

	if(gameArea.intervalN == 1 || everyInterval(random(80,180))) {
		if(gameArea.intervalN > 1000) {
			bird.push(new Component(x,random(100,130),30,30,"sprites.png","image",156,162,42,30));
		}
	}

	for(i=0; i<earth.length; i++) {
		earth[i].x -= velocity ;
		earth[i].update();
		if(gameArea.canvas.width+earth[i].width < 0) {
			earth[i].shift();
		}
	}
	for(i=0; i<obstacle1.length; i++) {
		obstacle1[i].x -= velocity ;
		obstacle1[i].update();
		if(gameArea.canvas.width+obstacle1[i].width < 0) {
			obstacle1[i].shift();
		}
	}
	for(i=0; i<obstacle2.length; i++) {
		obstacle2[i].x -= velocity ;
		obstacle2[i].update();
		if(gameArea.canvas.width+obstacle2[i].width < 0) {
			obstacle2[i].shift();
		}
	}
	for(i=0; i<obstacle3.length; i++) {
		obstacle3[i].x -= velocity ;
		obstacle3[i].update();
		if(gameArea.canvas.width+obstacle3[i].width < 0) {
			obstacle3[i].shift();
		}
	}
	for(i=0; i<obstacle4.length; i++) {
		obstacle4[i].x -= velocity ;
		obstacle4[i].update();
		if(gameArea.canvas.width+obstacle4[i].width < 0) {
			obstacle4[i].shift();
		}
	}
	for(i=0; i<sky.length; i++) {
		sky[i].x -= 3 ;
		sky[i].update();
		if(gameArea.canvas.width+sky[i].width < 0) {
			sky[i].shift();
		}
	}

	for(i=0; i<bird.length; i++) {
		bird[i].x -= velocity ;
		if(everyInterval(4)) {
		switch (n) {
		case n=0:
				bird[i].sx = 210;
				bird[i].sy = 162;
				break;
			case n=1:
				bird[i].sx = 156;
				bird[i].sy = 162;
				n=-1;
				break;
		}
		n+=1;
	}	
		bird[i].update();
		if(gameArea.canvas.width+bird[i].width < 0) {
			bird[i].shift();
		}
	}

	
	//bird.update();
	if(gameArea.key) {
		if(gameArea.key == 40) {
			if(everyInterval(7)) {
				switch (n) {
					case n=0:
						gamePlayer.sx = 7;
						gamePlayer.sy = 200;
						gamePlayer.swidth = 55;
						gamePlayer.sheight = 26;
						gamePlayer.height = 35;
						gamePlayer.y = 155;
						break;
					case n=1:
						gamePlayer.sx = 73;
						gamePlayer.sy = 199;
						gamePlayer.sheight = 26;
						gamePlayer.height = 35;
						gamePlayer.y = 155;
						n=-1;
						break;
				}
				n+=1;
			}
		}
		if(gameArea.key == 32 || gameArea.key == 38) {
			if(gamePlayer.acelerationGravity <= 0) {
				gamePlayer. y -= jump;
				jumpSound.play()
			}
		}
	}else{
		if(everyInterval(7)) {
			switch (n) {
			case n=0:
				gamePlayer.sx = 6;
				gamePlayer.sy = 121;
				gamePlayer.sheight = 43;
				gamePlayer.swidth = 40;
				gamePlayer.height = 50;
				break;
			case n=1:
				gamePlayer.sx = 55;
				gamePlayer.sy = 121;
				gamePlayer.sheight = 43;
				gamePlayer.height = 50;
				gamePlayer.swidth = 40;
				n=-1;
				break;
			}
			n+=1;
		}
	}
	gamePlayer.gravityForce();
	gamePlayer.update();
	requestAnimationFrame(updateGameArea);
}