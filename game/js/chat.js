var chat_ol = document.getElementById("chat-ol");
// var input_form = document.getElementById( ... ); // Stopped here

function appendMessage(author, message) {
	var author_p = document.createElement("p");
	author_p.innerHTML = author;
	author_p.classList.add("chat-message-author");

	var content_p = document.createElement("p");
	content_p.innerHTML = message;  
	content_p.classList.add("chat-message-content")

	var li = document.createElement("li");
	li.classList.add("message-wrapper");

	li.appendChild(author_p);
	li.appendChild(content_p);
	chat_ol.appendChild(li);

	li.scrollIntoView({behavior: "smooth"});
}

function main() {
	appendMessage("Peter", "Wer ist dieser charmante Mann auf dem Titel-Bildschirm?");
}

setTimeout(
	main,
	5000
);