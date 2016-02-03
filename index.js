var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var gameDataReader = require('./gameDataReader');
var gameEngine = require('./play');
var timeoutIds = [];



gameDataReader.readGameData(function(err, gameData){

	if(err) throw err;

	//sets up public folder to serve static assests including html, css and what not.
	app.use('/static', express.static(path.join(__dirname,'/public')));

	//after game data is loaded, fire up the server and get ready for action
	app.get('/', function( req,res ){
		res.sendFile(path.join(__dirname, '/public/index.html'));
	});

	io.on('connection', function(socket){

		//close socket on user disconnect. TODO:: Lots to do here. 
		socket.on('disconnect', function(){
    		console.log('User disconnected');
    		//clear timeouts
    		timeoutIds.forEach( function( id ){
    			console.log( ' Clearing Timeout ID '+ id);
    			clearInterval( id );
    		});
  		});

		gameEngine.start( gameData );

		
		function emitMessage(message){
			socket.emit('msg', {message : message});
		}

		function emitEndOfMessage( nodeId ){
			socket.emit('eom', { buttonChoices : gameEngine.fetchOptions( nodeId )});
		}

		//Function to fetch messages and call socket.emit at specified intervals.
		//TODO: make the wait time variable. 
		function playNode( nodeId ){

			var i=0; messages = gameEngine.fetchMessagesForNode(nodeId), l = messages.length;
			
			(function emitNodeMessages(){
				console.log( messages[i] );
				emitMessage( messages[i] );
				if( ++i< l){
					timeoutIds.push(setTimeout(emitNodeMessages, 1000));
				}else{
					emitEndOfMessage( nodeId );
				}
			})();
		
		}

		socket.on('nextNode', function( req ){
			console.log( req.nodeId );
			playNode( req.nodeId );
		});
		
		

	});

	http.listen( 3000, function(){
		console.log('App started ...');
	});

})