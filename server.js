var https = require('https');
var fs = require('fs'); // Using the filesystem module

// Database to store data
var Datastore = require('nedb');
var db = new Datastore({filename: "data.db", autoload: true});

const express = require('express');
var siofu = require('socketio-file-upload');
var app = express();
app.use(express.static(__dirname+"/uploads"));
app.use(siofu.router);
app.listen(8000, () => {
    console.log('Server is running on port 8000');
});

var credentials = {
key: fs.readFileSync('/etc/letsencrypt/live/sc7436.itp.io/privkey.pem'),
cert: fs.readFileSync('/etc/letsencrypt/live/sc7436.itp.io/cert.pem')
};


// Tell Express to look in the "public" folder for any files first
app.use(express.static('public'));

// If the user just goes to the "route" / then run this function
app.get('/', function (req, res) {
//   res.send('Hello World!')
    res.sendFile(__dirname + "/index.html");
});


// Here is the actual HTTP server 
//var http = require('http');
// We pass in the Express object
var httpsServer = https.createServer(credentials, app);

// Default HTTPS Port
httpsServer.listen(443);

// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(httpsServer);

const path = require('path');




// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection', 
	// We are given a websocket object in our function
	function (socket) {
	
		console.log("We have a new client: " + socket.id);

        socket.on("video", function(data) {
            // io.emit("video", data);
            var filename = Date.now() + ".webm";
            fs.writeFile('public/' + filename, data, function(err){
                if (err) console.log(err);
                console.log("It's saved!")
                io.emit("video", filename);
            });      
          });

        //test upload file
        var uploader = new siofu();
        uploader.dir = "uploads";
        uploader.listen(socket);

        uploader.on('saved',function(event){
            console.log(event.file.name);
            event.file.clientDetail.imageName = event.file.name;
        })


        socket.on('uploads',function(data){
			var datatosave = {
				src: data.src,
				uploadTime: data.uploadTime
			}
		
			db.insert(datatosave, function (err, newDocs){
				console.log("err: " + err);
				console.log("newDocs: " + newDocs);
			});
			
            socket.broadcast.emit('uploads', data);

        })




		socket.on('history', function() {
			db.find({}, function(err, docs) {
				for (var i = 0; i < docs.length; i++) {
					socket.emit('uploads', docs[i]);
				}
			})
		});

        socket.on('gif', function (ImageURLS) {
            console.log('Received image URLs:', ImageURLS.length); // Log received image URLs
            socket.broadcast.emit('gif', ImageURLS);
        });

        socket.on('photo', function (imgData) {
            var datatosave = {
				src: imgData,
				uploadTime: new Date()
			}
		
			// Insert the data into the database
			db.insert(datatosave, function (err, newDocs){
				console.log("err: " + err);
				console.log("newDocs: " + newDocs);
			});
            // socket.broadcast.emit('photo', imgData);
			socket.broadcast.emit('uploads', imgData);

        });


		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
		});
	}
);


