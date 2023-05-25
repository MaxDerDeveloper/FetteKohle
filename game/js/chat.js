var chat_ol = document.getElementById("chat-ol");
var input_form = document.getElementById("chat-form");

input_form.onsubmit = (event) => {
	event.preventDefault();

	var msg = event.target.children[0].value;
	appendMessage(document.username, msg);
	event.target.children[0].value = "";
}

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

	scrollToMessage(li);

	return li;
}

botMessages = {
	insufficient_funds: [
		"Du hast nicht genug Köhle!",
		"Ohne Köhle gibt's nichts zu höle!"
	],

	winning_streak: [
		"Das muss das Finanzamt ja nicht wissen...",
		"Harte Arbeit, karger Lohn. Aber wen interessiert das schon",
	],

	losing_streak: [
		"Geh nicht vor Verzweiflung auf alle Viere, verpfände lieber eine Niere!",
		"Sei kein Shrek, leg die Kohle auf's Roulette",
		"Wer jetzt gewinnt, verdient später noch mehr als der Peter."
	],

	equal_streak: [
		"Harte Arbeit, karger Lohn.",
		""
	]
}

function chooseRandomElement(array) {
	return array[Math.floor(Math.random() * array.length)]
}

function sendRandomBotMessage(reason) {
	var choices = botMessages[reason];

	var li = appendMessage(
		"Köhle Bot 🤖",
		chooseRandomElement(choices)
	);
	li.classList.add("bot-username");
}

function scrollToMessage(target_li) {
	var scrollY = 0;

	for (var li of chat_ol.children) {
		if (li == target_li) { break; }

		scrollY += li.offsetHeight;
	}
	chat_ol.scrollTo({
		left:0,
		top:scrollY,
		behavior: "smooth"
	});
}

function main() {
	appendMessage("Max", "Wow, was für ein wohl durchdachtes und gut implementiertes Chatsystem!",);
	appendMessage("Oliver", "Ich stimme dir zu! Wer auch immer das programmiert hat, hat Ahnung von seinem Job!",);
	var target = appendMessage("Peter", "Wer ist dieser charmante Mann auf dem Titel-Bildschirm?",);
	appendMessage("Mika", "Respeeekt 💯",);
}

// setTimeout(main, 1000);
main();

// function dash () Y= 00 # 
// submit/ roll if max= waiser == pro 



