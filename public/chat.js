
$(function(){
   	//make connection
	var socket = io.connect('http://localhost:3000')

	//buttons and inputs
	var message = $("#message")
	var username = $("#username")
	var send_message = $("#send_message")
	var send_username = $("#send_username")
	var chatroom = $("#chatroom")
	var feedback = $("#feedback")
	var onlineUsers =$("#userOnline")
	var onlineRoom =$("#onlineRoom")
	
	


	//Emit message
	send_message.click(function(){
		socket.emit('new_message', {message : message.val()})
	})

	//Listen on new_message
	socket.on("new_message", (data) => {
		feedback.html('');
		message.val('');
		if(data.username == username){
            $('#chatRoom').append( '<p style="text-align:right" ><b>' +
        data.username + '</b> : ' + data.message + '</p>');
        }else {
        $('#message-container').append('<p><b>' +
        data.username + '</b> : ' + data.message + '</p>');
        }
		chatroom.append("<p class='message'>" + data.username + ": " + data.message + "</p>")
		
		
	})
	


	//Emit a username
	send_username.click(function(){
		var userx  = $(".form-control").val();
		onlineUsers.html('');
		username.val('');
		// onlineRoom.append("<p class='message'>" +userx+ " is online"  + "</p>");
	
		socket.emit('send-nickname',userx);
	})
	socket.on('allUsers', function (users) {
		$('#onlineRoom').html(users.join(", ").replace(/,/g," is online"+"<br>"));
	});
	//Emit typing
	message.bind("keypress", () => {
		socket.emit('typing')
	})
	//Listen on typing
	socket.on('typing', (data) => {
		feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
	})
});


