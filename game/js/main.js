var form;
const AUTO_INIT = true;

window.onload = () => {
	form = document.getElementById("username-form");
	form.onsubmit = (event) => {
		event.preventDefault();
		setTimeout(initWithData, 5, event);
		return false
	};

	// Fix iOS touch-drag.
	document.body.addEventListener("ontouchmove", e=>{
		e.preventDefault();
	})

	if (AUTO_INIT) { init({username:"test123"}) }
};

function parseForm(event) {
	var fd = new FormData(event.target)
	return Object.fromEntries(fd.entries());
}

function initWithData(event) {
	var data = parseForm(event);
	init(data);
}

function init(data) {
	var canvasDiv = document.getElementById("canvasdiv");
	window.username = event.username;
	include("js/game_main.js");
	include("js/chat.js");
	deleteForm();

	// Greeting message
	var p = document.querySelector("div#canvasdiv p");
	p.innerText = `Willkommen, ${data.username}!`;

	// When all changes were applied, show them.
	canvasDiv.hidden = false;
}


function deleteForm() {
	form.remove();
}

function include(src) {
	var script = document.createElement("script");
	script.src = src;

	document.head.appendChild(script);
}