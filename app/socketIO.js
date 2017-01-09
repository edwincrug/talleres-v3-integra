
var Io = require('socket.io'),
	app_user = {};

var SocketIO = function(config){
	config = config || {};
	var io = Io.listen(config.server);

	io.sockets.on('connection', function(socket){

		socket.on('peticionInicio', function(data){
			console.log(data);
   		//setInterval(function(){
			socket.emit('notificacion', {camion:'Monitoreo de Unidad'});
		//},90000);
		});

		socket.emit('notificacion', {camion:'Entrada Salida Unidad'});

	});
}

module.exports = SocketIO;