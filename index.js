const express = require('express')
const app = express();
var path = require('path');
var users = [];




app.all('/', function (req, res) {
    console.log("Got a GET request for the homepage");
    res.sendFile(path.join(__dirname + '/views/index.html'));
});



//middlewares
app.use(express.static('public'))


//routes
app.get('/', (req, res) => {
    res.render('index')
})

//Listen on port 3000
server = app.listen(process.env.PORT || 3000);



//socket.io instantiation
const io = require("socket.io")(server)






io.on('connection', function (socket) {
    console.log('a user connected');
    
    //default username
    socket.username = "Anonymous"

    //ADDED NICKNAME
    socket.on('send-nickname', function (data) {
        socket.username = data;
        users.push(socket.username);
        io.sockets.emit('allUsers', users);
        
    });
    console.log(users);

    //DISCONNECTION
    socket.on('disconnect', function () {
        var index = users.indexOf(socket.username);
        if (index > -1) {
            users.splice(index, 1);
        }
        io.sockets.emit('allUsers', users);
    });
    //listen on new_message
    socket.on('new_message', (data) => {
        //broadcast the new message
        io.sockets.emit('new_message', { message: data.message, username: socket.username });
    })
    

    //listen on typing
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', { username: socket.username })
    })
});
