var socket;
var player;
var floor;
var socket;
var username = null;
var canvas;
var s; // Sketch
var gamescr;
var titlescr;
var betlogic;

let width  = 800;
let height = 500;

let RED   = "red";
let BLACK = "black";

let colors = {
	0:"green",
	1:RED,
	2:BLACK,
	3:RED,
	4:BLACK,
	5:RED,
	6:BLACK,
	7:RED,
	8:BLACK,
	9:RED,
	10:BLACK,
	12:RED,
	11:BLACK,
	10:BLACK,
	15:BLACK,
	14:RED,
	13:BLACK,
	18:RED,
	17:BLACK,
	16:RED,
	21:RED,
	20:BLACK,
	19:RED,
	24:BLACK,
	23:RED,
	22:BLACK,
	27:RED,
	26:BLACK,
	25:RED,
	30:RED,
	29:BLACK,
	28:BLACK,
	33:BLACK,
	32:RED,
	31:BLACK,
	36:RED,
	35:RED,
	34:RED,
};

var coin;

class LayeredImage {
	constructor(paths, x, y) {
		this.imgs = [];
		for (var path of paths) {
			var url = "https://max-weiser.de/static/game/img/" + path;
			this.imgs.push( s.loadImage(url) );
		}

		// Default coordinate: (0,0)
		this.x = (x === undefined) ? 0 : x;
		this.y = (y === undefined) ? 0 : y; 
	}

	draw() {
		for (var img of this.imgs) {
			s.image(img, this.x, this.y);
		}
	}
	drawSingleLayer(index) {
		if(typeof this.imgs[index] === 'undefined') {
    		console.log("Layer does not exist:", index);
    		return
		}

		s.image(this.imgs[index], this.x, this.y);
	}
}

class WheelAnimation {
	constructor(on_rest) {
		this.on_rest = on_rest;
		this.reset();
		this.is_running = false;
		this.theta      = (0.5 + s.int(s.random(0, 37)) ) * (2*s.PI/37);
	}

	reset() {
		this.numFrames  = 600;
		this.index      = 0;
		this.is_running = true;

		this.omega     = 0; // Angular velocity
		this.theta     = 0; // Angle
	}

	calcField() {
		var field = (gamescr.wheel.anim.theta - s.PI);
		field %= 2 * s.PI;
		field *= -37 / (2 * s.PI);

		if (field.toFixed(0) <= -1) { field = 37 - Math.abs(field); }

		return field.toFixed(0).toString();
	}

	update() {
		if (!this.is_running) { return; }

		// Spin phase
		if (this.index == 0) {
			this.omega = (3 + s.random(0, 1)) * 3.141/60;
		}

		// Slow down phase
		if (100 < this.index && this.index < 400) {
			this.omega *= 0.99;
			// this.omega *= 0.90;
		}

		// Stop.
		if (this.index == 400) {
			this.omega = 0;
			this.on_rest(this.calcField());
			this.is_running = false;
		}

		this.theta += this.omega;
		this.index += 1;
	}
}

class Wheel {
	constructor() {
		this.center = s.createVector(width/2, 115);
		this.radius = 105;
		this.img    = s.loadImage("https://max-weiser.de/static/game/img/wheel.png");
		this.number = undefined;
		
		this.on_spin = () => {};
		this.on_rest = (field) => { betlogic.checkForWin(field) };

		this.anim   = new WheelAnimation( this.on_rest );
	}

	spinLogic() {
		this.anim.update();
		this.theta = this.anim.theta;
		// console.log(this.anim.theta);
	}


	draw_with_render() {
		this.spinLogic();

		s.push();
			s.translate(this.center.x, this.center.y);
		
			s.fill("black")
			s.stroke("white")
			s.ellipse(
				0, 0,
				this.radius*2, this.radius*2,
			);

			s.noStroke()
			var omicron = (2*s.PI/37);
			for (var i=0; i<= 36; i++) {
				var phi = this.theta +  i*omicron;
				var x = s.cos(phi) * this.radius * 0.95;
				var y = s.sin(phi) * this.radius * 0.95;

				s.push();
					s.translate(x, y);

					
					s.line(-x, -y, 0, 0);

					s.stroke("white")
					s.fill(colors[i]);
					s.arc(
						-x, -y,
						this.radius*2, this.radius*2,
						phi - omicron/2,
						phi + omicron/2,
					);

					s.rotate(phi - s.PI/2);
					
					s.fill("white");
					s.noStroke();
					s.textAlign(s.CENTER, s.CENTER);
					s.textSize(12);

					s.text(i.toString(), 0, 0);

				s.pop();
				
			}
		s.pop();
		this.currentFrame += 1;
	}

	draw() {
		this.spinLogic();

		s.push();
			s.translate(this.center.x, this.center.y);

			// Ball
			// s.fill("white")
			// s.ellipse();

			s.rotate(this.theta)

			var w = this.img.width;
			var h = this.img.height;

			s.image(this.img, -w/2, -h/2);
		s.pop();
		this.currentFrame += 1;

		s.stroke("white");
		s.line(
			this.center.x,
			this.center.y - this.radius - 15,

			this.center.x,
			this.center.y - this.radius,
		);
		s.noStroke();
	}

	spin() {
		if (this.anim.is_running) { return; }

		this.anim.reset();
		this.on_spin()
	}
}

class Button {
	constructor(x, y, w, h, text, color, strokeColor, alpha) {
		this.x     = x;
		this.y     = y;
		this.w     = w;
		this.h     = h;
		this.text  = text
		this.color = color!==undefined ? color : "red";
		
		this.alpha = alpha!==undefined ? alpha : 255;
		this.color = s.color(this.color);
		this.color.setAlpha(this.alpha);

		this.strokeColor = strokeColor!==undefined ? strokeColor : "white";
		this.isClicked   = false;
		this.wasClicked  = false
	}

	on_click(text) {
		console.log(text, "has been clicked!");
	}

	draw() {
		var roundedCornerRadius = 5;
	
		
		var isHovered = (this.x <= s.mouseX ) && (s.mouseX <= (this.x+this.w)) && (this.y<= s.mouseY) && (s.mouseY <= (this.y+this.h));	
		this.isClicked = isHovered && s.mouseIsPressed;
		
		if (this.isClicked && !this.wasClicked) { this.on_click(this.text); }


		if(isHovered) {
			s.stroke(this.strokeColor);
			s.strokeWeight(2);
		} else {
			s.noStroke();
		}

		s.fill(this.color)
		s.rect(
			this.x,this.y,this.w,this.h,roundedCornerRadius
		);

		s.noStroke();
		s.fill("white");
		s.textAlign(s.CENTER, s.CENTER);
		s.textSize(20);
		s.text(
			this.text,
			this.x + this.w/2,
			this.y + this.h/2,
		);
		
		this.wasClicked = this.isClicked;
	}
}

class BetLogic {
	constructor(balance) {
		if (balance === undefined) { console.error("Please specify a balance."); } 

		this.bets    = {};
		this.balance = balance;
		this.history = [];

		this.betFields = {};
		this.initBetFields();
	}

	initBetFields() {
		for (var i=0; i<=36; i++) {
			this.betFields[i.toString()] = 36;
		}
		for (var key of ["Even", "Odd", "Red", "Black", "1st Half", "2nd Half"]) {
			this.betFields[key] = 2;
		}
		for (var key of ["1st 12", "2nd 12", "3rd 12"]) {
			this.betFields[key] = 3;
		}
	}

	bet(field, amount) {
		if (amount > this.balance) {
			sendRandomBotMessage("insufficient_funds");
			return;
		}

		if (!(field in this.betFields)) {
			console.log("Ungültige Wette!");
			return;
		}

		if (field in this.bets) {
			this.bets[field] += amount;
		} else {
			this.bets[field] = amount;
		}
		this.balance -= amount;
	}

	getStatus(won, bet) {
		if (won > bet) { return "winning" }
		else if (won < bet) { return "losing" }
		else if (won == bet) { return "equal" }
	}

	checkForWin(randomField) {
		var wonMoney = 0;
		var betMoney = 0

		for (var pair of Object.entries(this.bets)) {
			var [f, a] = pair;

			betMoney += a;

			// this.balance -= this.bets[f];
			// console.log("Field:", f, randomField, f === randomField, "mult:", this.betFields[randomField]);
			if (f === randomField.toString() && a != 0) {
				console.log("Direct field");
				wonMoney += a * this.betFields[randomField];
			}

			// Red
			if (f == "Red" && a != 0 && colors[parseInt(randomField)]==RED) {
				wonMoney += a * this.betFields["Red"];
				console.log("red");
			}

			// Black
			if (f == "Black" && a != 0 && colors[parseInt(randomField)]==BLACK) {
				wonMoney += a * this.betFields["Black"];
				console.log("black");
			}

			// Even
			if (f == "Even" && a != 0 && (randomField%2==0)) {
				wonMoney += a * this.betFields["Even"];
				console.log("even");
			}

			// Odd
			if (f == "Odd" && a != 0 && (randomField%2==1)) {
				wonMoney += a * this.betFields["Odd"];
				console.log("odd");
			}

			// 1st 12
			if (f == "1st 12" && randomField > 0 && randomField <= 12) {
				wonMoney += a * this.betFields["1st 12"];
				console.log("1st 12");
			}

			// 2nd 12
			if (f == "2nd 12" && randomField > 12 && randomField <= 24) {
				wonMoney += a * this.betFields["2nd 12"];
				console.log("2nd 12");
			}

			// 3rd 12
			if (f == "3rd 12" && randomField > 24 && randomField <= 36) {
				wonMoney += a * this.betFields["3rd 12"];
				console.log("3rd 12");
			}

			// 1st Half
			if (f == "1st Half" && randomField > 0 && randomField <= 18) {
				wonMoney += a * this.betFields["3rd 12"];
				console.log("1st Half");
			}

			// 2nd Half
			if (f == "2nd Half" && randomField > 18 && randomField <= 36) {
				wonMoney += a * this.betFields["3rd 12"];
				console.log("2nd Half");
			}
		}

		var status = this.getStatus(wonMoney, betMoney);
		this.history.push(status);

		console.log("Won money:", wonMoney);
		this.balance += wonMoney;
		this.bets    = {};

		this.checkForStreaks();
	}

	checkForStreaks() {
		console.log(this.history)

		var streakType;
		var streakCount = 0;

		for (var j=0; j<this.history.length; j++) {
			var i = this.history.length - 1;

			// Last element
			if (j == 0) {
				streakType = this.history[i];
				streakCount = 1;
				continue;
			}

			// Check if any more elements are equal
			if (streakType == this.history[i]) {
				streakCount += 1;
			} else {
				break;
			}
		}

		if (streakCount >= 2) {
			sendRandomBotMessage(streakType + "_streak");
		}

		return [streakType, streakCount]
	}

	draw() {
		s.textAlign(s.LEFT)
		s.text(
			`Deine Kohle: ${this.balance}`,
			20,
			20
		);

		s.textAlign(s.RIGHT)
		s.text(
			"Deine Wetten:",
			width - 20,
			20
		);

		var i = 1;
		for (var pair of Object.entries(this.bets)) {
			var [field, amount] = pair;
			s.text(
				`${amount} Coins auf ${field}`,
				width - 20,
				20 + i*30
			);
			i += 1;
		}
	}
}

class Field {
	constructor() {
		this.center = s.createVector(width/2, 200);

		this.width  = 12;
		this.height = 3;

		var rect_size = 40;
		var padding   = rect_size/8;
		var total_width = this.width * (rect_size + padding) - padding;

		this.buttons = [];
		for (var i=1; i <= (this.width*this.height); i++) {
			var j = i-1;
			const x = Math.floor(j/this.height);
			const y = this.height - (j % this.height);
	
			var pix_x = this.center.x - total_width/2 + x * (rect_size + padding);
			var pix_y = this.center.y + y * (rect_size + padding);
	
			var btn = new Button(
				pix_x, pix_y,
				rect_size, rect_size,
				i.toString(),
				colors[i]
			);
			this.buttons.push(btn);
		}

		// Zero
		this.buttons.push(new Button(
			this.center.x - total_width/2 + -1 * (rect_size + padding),
			this.center.y + 1 * (rect_size + padding),
			rect_size,
			rect_size * 3 + 2*padding,
			"0", "green"
		));

	
		// Dozens
		this.buttons.push(new Button(
			this.center.x - total_width/2 + 0 * (rect_size + padding),
			this.center.y + 4 * (rect_size + padding),
			rect_size * 4 + 3*padding,
			rect_size,
			"1st 12", "gray"
		));
		this.buttons.push(new Button(
			this.center.x - total_width/2 + 4 * (rect_size + padding),
			this.center.y + 4 * (rect_size + padding),
			rect_size * 4 + 3*padding,
			rect_size,
			"2nd 12", "gray"
		));
		this.buttons.push(new Button(
			this.center.x - total_width/2 + 8 * (rect_size + padding),
			this.center.y + 4 * (rect_size + padding),
			rect_size * 4 + 3*padding,
			rect_size,
			"3rd 12", "gray"
		));

		// Even and odd
		this.buttons.push(new Button(
			this.center.x - total_width/2 + 0 * (rect_size + padding),
			this.center.y + 5 * (rect_size + padding),
			rect_size * 2 + 1*padding,
			rect_size,
			"Even", "blue"
		));
		this.buttons.push(new Button(
			this.center.x - total_width/2 + 2 * (rect_size + padding),
			this.center.y + 5 * (rect_size + padding),
			rect_size * 2 + 1*padding,
			rect_size,
			"Odd", "blue"
		));

		// Red and black
		this.buttons.push(new Button(
			this.center.x - total_width/2 + 4 * (rect_size + padding),
			this.center.y + 5 * (rect_size + padding),
			rect_size * 2 + 1*padding,
			rect_size,
			"Red", "red"
		));
		this.buttons.push(new Button(
			this.center.x - total_width/2 + 6 * (rect_size + padding),
			this.center.y + 5 * (rect_size + padding),
			rect_size * 2 + 1*padding,
			rect_size,
			"Black", "black"
		));

		// Halfs
		this.buttons.push(new Button(
			this.center.x - total_width/2 + 8 * (rect_size + padding),
			this.center.y + 5 * (rect_size + padding),
			rect_size * 2 + 1*padding,
			rect_size,
			"1st Half", "blue"
		));
		this.buttons.push(new Button(
			this.center.x - total_width/2 + 10 * (rect_size + padding),
			this.center.y + 5 * (rect_size + padding),
			rect_size * 2 + 1*padding,
			rect_size,
			"2nd Half", "blue"
		));
	

		this.initEvents();
	}

	initEvents() {
		for (var btn of this.buttons) {
			btn.on_click = (field) => { betlogic.bet(field, 10) };
		}
	}

	draw() {
		for ( var btn of this.buttons) {
			btn.draw();
		}
	}
}

class Falling {
	constructor() {
		this.randomize();
	}

	randomize() {
		this.x      = s.random(0, width);
		this.y      = s.random(-50, -800);
		this.rot    = s.random(0, 2*s.PI);
		this.ang    = s.random(-1, 1) * 0.1;
		this.yspeed = s.random(5, 6);
	}

	move() {
		this.y   += this.yspeed;
		this.rot += this.ang;

		if (this.y > height+50) {
			this.randomize();
		}
	}

	draw() {
		s.push();

		s.translate(this.x, this.y);
		s.rotate(this.rot);
		s.fill("red");
		
		// s.rectMode(s.CENTER)
		// s.rect(0, 0, 20, 20)
		var size = 25;
		s.image(coin, -size/2, -size/2, size, size);

		s.pop();
	}
}

class FallingAnimation {
	constructor(count, fallingSpeed, isContinuous) {
		this.falling = [];
		for (let i=0; i<count; i++) {
			this.falling.push(new Falling());
		}
		this.isContinuous = isContinuous;
	}

	updateFalling() {
		for (var f of this.falling) {
			f.move();
		}
	}

	drawFalling() {
		for (var f of this.falling) {
			f.draw();
		}
	}

	draw() {
		this.updateFalling();
		this.drawFalling();
	}
}

class TitleScreen {
	constructor() {
		this.titleScreen  = new LayeredImage([
			"layers/background.png",
			"layers/schriftzug.png",
			"layers/businessman.png"
		]);
		this.btn_play = new Button(300, 400, 200, 50, "Zöcken!", [155, 123, 1], [225, 173, 1]);
		this.btn_play.on_click = () => {
			gamescr = new GameScreen();
			setActiveScreen(gamescr);
		}

		this.btn_tutorial = new Button(300, 330, 200, 50, "Tutorial", [155, 123, 1], [225, 173, 1]);
		this.btn_tutorial.on_click = () => {
			setActiveScreen(new TutorialScreen());
		}

		this.anim = new FallingAnimation(15, 5, true);
	}

	draw() {
		this.titleScreen.drawSingleLayer(0); // Background
		this.anim.draw();
		this.titleScreen.drawSingleLayer(1); // Schriftzug
		this.titleScreen.drawSingleLayer(2); // Businessman

		this.btn_play.draw();
		this.btn_tutorial.draw();
	}
}

class GameScreen {
	constructor() {
		this.wheel = new Wheel();
		this.wheel.on_rest = (num) => { betlogic.checkForWin(num) };

		this.field = new Field();
		this.spinBtn = new Button(50,50,100,30, "Spin!", "blue");
		this.spinBtn.on_click = () => {
			// this.wheel.spin( Math.floor(Math.random() * (36+1)) );
			this.wheel.spin( 1 );
		}
	}

	draw() {
		// s.background(23, 128, 15);
		s.background(22);
		this.spinBtn.draw();
		this.field.draw();
		this.wheel.draw();
		betlogic.draw();

		// Display framerate
		// s.text(Math.round(s.frameRate()), 420, 480);
	}
}

// Reference: https://editor.p5js.org/juhe2229/sketches/4zg6iDbB4
class TutorialScreen {
	constructor() {
		this.text = "Es ist eine hoffnungslose Zeit\nim Land der Fetten Köhle...\nDie Taschen der Leute sind leer\nund ihre Herzen getrübt\nDoch Hoffnung keimt am Horizont auf:\nEinige Glücksspielprofis haben vor\ndie digitale Spielewelt vollkommen zu verändern...\nWenn du schon zu den Meistern gehörst,\nüberspringe dies gerne,\nwenn du den Weg der FETTEN KÖHLE\nnoch lernen musst, heißen wir dich herzlich Willkommen!\n\nDas Herzstück unseres Roulettes\nist das große Rad über der Mitte\nEs dreht sich permanent\nDarunter seht ihr 37 Zahlen\nin rot, schwarz und grün.\nDu erhältst etwas Start-KØHLE,\nGeh sorgfältig damit um!\nMit einem Klick auf\neine der Optionen setzt du 10 Einheiten\nWette schlau,\nDer Ball rollt schon bald\nin das Rad und fällt in ein Feld!\nDamit wird entschieden,\nwer seine KØHLE vervielfacht,\n und wer sie abgibt.\nAm unteren Bildschirmrand\nkannst du mit deinen Mithustlern\nkommunizieren.\n Bleib aber immer nett und respektvoll!\nDas eingebaute System wird\ndeine Mitspieler schon genug nerven.\nAber nun, mein Kind\nbrich auf auf dein Abenteuer\nund fülle deine Taschen mit\nKÖHLE!!!";
		this.y    = 0;
		this.img  = s.loadImage("https://max-weiser.de/static/game/img/layers/schriftzug.png");
		this.button = new Button(
			5, 5, 
			100, 50,
			"Zurück", [155, 123, 1], [225, 173, 1],
			64
		);
		this.button.on_click = () => { this.on_finish(); };
	}

	update() {
		var vel = 35; // pixels/sec
		this.y -= vel / s.frameRate();
	}

	on_finish() {
		// Return to title screen.
		setActiveScreen(titlescr);
	}

	draw() {
		this.update();

		s.background(0);

		// s.fill("white");
		// s.textAlign(s.LEFT, s.TOP);
		// s.text(
		// 	this.y.toFixed(0).toString(),
		// 	50, 50
		// );

		if (this.y < -2800) {
			this.on_finish();
		}

		s.push();
			s.textAlign(s.CENTER, s.TOP);
			s.textSize(40);
			s.noStroke();
 
			s.fill(42, 192, 209); // blue
			s.text(
				"Vor langer, langer Zeit in einem weit, weit entfernten Casino...",
				0, this.y + height*0.5,
				width
			)

			s.image(
				this.img,
				50, this.y + height * 1.25
			);

			s.fill(200,180,0); // yellow
			s.text(
				this.text,
				0,
				this.y + height * 1.75,
				width,
			);
		s.pop();

		this.button.draw();
		
	}
}

document.activeScreen = null;

function setActiveScreen(screen) {
	document.activeScreen = screen;
}

let myp5 = new p5((sketch) => {
	s = sketch; // Set global, so there's access from everywhere.

	function initChatUI() {
		var form = document.getElementById("chat-form");

		form.onsubmit = (event) => {
			event.preventDefault();
				
			data = parseForm(event);
			socket.emit("send-msg", data);
			console.log("Sent:", data);
		};
	}

	s.preload = () => {
		/*
		var namespace = "";
		var uri = "http://localhost:8080/";
		socket = io.connect(uri);
		 socket.on("connect", function() {
			console.log("Connected to socketio");
		});
		initChatUI();
		*/
	}

	s.setup = () => {
		canvas = s.createCanvas(width, height);
		canvas.parent("canvasdiv");
	
		coin = s.loadImage("https://max-weiser.de/static/game/img/coin_small.png");

		betlogic = new BetLogic(100);

		titlescr      = new TitleScreen();
		setActiveScreen(titlescr);
		// titlescr.btn_play.on_click() // Automatically, click "Play".
	}

	s.draw = () => {
		if (document.activeScreen !== undefined) {
			document.activeScreen.draw();
		}
	}

	function keyPressed() {
		// When space is pressed.
		// if (keyCode == 32) {
		// 	if (player.forces.jump === undefined)
		// 		player.jump();
		// 		print("jump")
		// }
	}
});
