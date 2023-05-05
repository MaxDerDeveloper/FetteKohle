import mimetypes
import eventlet
import socketio
import os


f = lambda path: {
	"content_type": mimetypes.guess_type(os.path.basename(path)),
	"filename": path
}

# create a Socket.IO server
sio = socketio.Server()
app = socketio.WSGIApp(sio, static_files={
	"/game/index.html":		f("game/index.html"),
	"/game/js/main.js":     f("game/js/main.js"),
	"/game/js/game_main.js":f("game/js/game_main.js"),
	"/game/css/style.css":  f("game/css/style.css"),
})

# wrap with a WSGI application
# app = socketio.WSGIApp(sio)


@sio.event
def connect(sid, data):
	print("Connect:", sid)

@sio.event
def update(sid, data):
	print(sid, data)

if __name__ == "__main__":
	eventlet.wsgi.server(eventlet.listen(('', 5000)), app)