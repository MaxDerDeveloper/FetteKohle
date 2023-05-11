var socket;
var player;
var floor;
var socket;
var username = null;
var canvas;
var s; // Sketch

let width  = 800;
let height = 500;

let RED   = "red";
let BLACK = "black";

var img;

let colors = {
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

class Wheel {
	constructor() {
		this.center = s.createVector(width/2, 115);
		this.radius = 105;

		this.theta = -s.PI;
		this.angular_vel = 0;
	}

	draw() {
		if (this.angular_vel != 0) {
			this.theta += this.angular_vel / (2 * s.PI);
			this.angular_vel *= 0.94933; // Hard coded to ensure this.angular_vel == rotations

			if (this.angular_vel <= 1e-13) {
				this.angular_vel = 0
			}
		}

		// console.log(this.theta)

		s.push();
			s.translate(this.center.x, this.center.y);
			s.rotate(this.theta);

			s.ellipse(
				0,
				0,
				this.radius * 2,
				this.radius * 2,
			);
			s.strokeWeight(1);
			s.stroke("black");
			s.line(0, 0, 0, this.radius);
		s.pop();
	}

	spin(rotations) {
		// 1 = one half rotation
		this.angular_vel += rotations;
	}
}

class Button {
	constructor(x, y, w, h, text, color, strokeColor) {
		this.x     = x;
		this.y     = y;
		this.w     = w;
		this.h     = h;
		this.text  = text
		this.color = color!==undefined ? color : "red";
		this.strokeColor = strokeColor!==undefined ? strokeColor : "white";
		this.isClicked   = false;
		this.wasClicked  = false
	}

	on_click() {
		console.log(this.text, "have been clicked!");
	}

	draw() {
		var roundedCornerRadius = 5;
	
		
		var isHovered = (this.x <= s.mouseX ) && (s.mouseX <= (this.x+this.w)) && (this.y<= s.mouseY) && (s.mouseY <= (this.y+this.h));	
		this.isClicked = isHovered && s.mouseIsPressed;
		
		if (this.isClicked && !this.wasClicked) { this.on_click(); }

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
			"0", "blue"
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
	
	}

	draw() {
		for ( var btn of this.buttons) {
			btn.draw();
		}
	}
}

class Falling {
	constructor() {
		this.x   = s.random(0, width);
		this.y   = s.random(-20,-800);
		this.rot = s.random(0, 2*s.PI);
		this.ang = s.random(-1, 1) * 0.1;
	}

	draw() {
		s.push();

		s.translate(this.x, this.y);
		s.rotate(this.rot);
		s.fill("red");
		s.rectMode(s.CENTER)
		s.rect(0, 0, 20, 20)

		s.pop();
	}
}

class FallingAnimation {
	constructor(count, fallingSpeed, isContinuous) {
		this.falling = [];
		for (let i=0; i<count; i++) {
			this.falling.push(new Falling());
		}
		this.fallingSpeed = fallingSpeed;
		this.isContinuous = isContinuous;
	}

	updateFalling() {
		for (var f of this.falling) {
			f.y += this.fallingSpeed;
			f.rot += f.ang;

		
			if (f.y > height+50) {
				this.falling.splice(this.falling.indexOf(f), 1);

				if (this.isContinuous) { this.falling.push(new Falling()); }
			}
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
		this.titleScreen  = s.loadImage("https://max-weiser.de/static/game/img/title_screen.png");
		this.btn          = new Button(300, 400, 200, 50, "Play!", [155, 123, 1], [225, 173, 1]);
		this.btn.on_click = () => {
			setActiveScreen(new GameScreen());
		}
		this.anim = new FallingAnimation(25, 5, false);
	}

	draw() {
		s.image(this.titleScreen, 0, 0);

		this.btn.draw();
		this.anim.draw();
	}
}

class GameScreen {
	constructor() {
		this.wheel   = new Wheel();
		this.field   = new Field();
		this.spinBtn = new Button(50,50,100,30, "Spin!", "blue");
		this.spinBtn.on_click = () => {
			this.wheel.spin( s.random(5, 7) );
		}
	}

	draw() {
		s.background(23, 128, 15);
		this.spinBtn.draw();
		this.field.draw();
		this.wheel.draw();
	}
}

function setActiveScreen(screen) {
	document.activeScreen = screen;
}

document.activeScreen = null;

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
	
		setActiveScreen(new TitleScreen());
	}

	s.draw = () => {
		document.activeScreen.draw();
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
