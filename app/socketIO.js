var Io = require('socket.io'),
	request = require('request'),
	app_clients = {},
	socket='';


var SocketIO = function(config){
	config = config || {};
	var io = Io.listen(config.server);

	io.sockets.on('connection', function(socket){
		socket.join('some::room');

		socket.on('login', function(data){
			socket.emit('hello', { mensaje :'Socket se ha conectado correctamente'});
		});

		socket.on('disconnect', function(){

		});

	});

	//Se programa el envío automático de notificaciones a los usuarios conectados
	setInterval(function(){
		request({ 	
			method: 'GET',
			url: 'http://localhost:4200/api/cita/notificaciones/'  
		},function (error, response, body) {
			    if(response.statusCode == 200){
			      	var JSONbody = JSON.parse(body);
			     if(JSONbody[0].id != 0){ 	
			      	if(JSONbody.length > 0){
						//Envio los datos al cliente
			      		io.emit('pkgNotificacion',  JSONbody);
			      	}
			      }	
			    } else {
			        console.log('error: '+ response.statusCode);
			        console.log(body);
			    }
			});
	}, 30000);  
}

module.exports = SocketIO;


