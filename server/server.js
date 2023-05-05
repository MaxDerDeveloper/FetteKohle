const http = require("http");
const path = require('path');
const fs   = require('fs');

function getMimetype(filepath) {
	var extname = path.extname(filepath);
	switch (extname) {
		case '.html':
			return 'text/html';
			break;
		case '.js':
			return 'text/javascript';
			break;
		case '.css':
			return 'text/css';
			break;
	}
	return 'text/plain';
}


httpServer = http.createServer((request, response) => {
	var filepath = '.' + request.url;
	
	if (filepath == './')
		filepath = './game/index.html';

		contentType = getMimetype(filepath);

	fs.readFile(filepath, (error, content) => {
		if (error) {
			if(error.code == 'ENOENT'){
				fs.readFile('./404.html', function(error, content) {
					response.writeHead(200, { 'Content-Type': contentType });
					response.end(content, 'utf-8');
				});
			}
			else {
				response.writeHead(500);
				response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
				response.end(); 
			}
		}
		else {
			response.writeHead(200, { 'Content-Type': contentType });
			response.end(content, 'utf-8');
		}
	});

});

var port = 8080;

const socketio = require("socket.io");
const io = new socketio.Server(httpServer, {
  cors: {
	origin: "http://localhost:" + port.toString(),
  },
});


io.on("connection", (socket) => {
	console.log("Connected:", socket.id);
});

io.on("send-msg", (socket, data) => {
	console.log("Chat message by", socket.id, ":", data);
});

httpServer.listen(port);