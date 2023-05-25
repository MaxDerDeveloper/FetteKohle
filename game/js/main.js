var   form;
const isProduction = window.location.host === "max-weiser.de";
const AUTO_INIT    = false;

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

	if (AUTO_INIT) { init({username:"dev"}) }
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
	document.username = data.username;
	include("js/game_main.js");
	deleteForm();

	// Greeting message
	// var p = document.querySelector("div#canvasdiv p");
	// p.innerText = `Willkommen, ${data.username}!`;

	// When all changes were applied, show them.
	canvasDiv.hidden = false;

	// Show Chat-UI
	document.querySelector("div.chat-wrapper").hidden = false;

	// Intentionally after revealing the Chat-UI: showing off with smooth animations!
	include("js/chat.js");
}


function deleteForm() {
	form.remove();
}

function include(src) {
	var script = document.createElement("script");
	script.src = src;

	document.head.appendChild(script);
}