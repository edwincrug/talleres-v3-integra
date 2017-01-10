
/*var Io = require('socket.io'),
	app_user = {};

var SocketIO = function(config){
	config = config || {};
	var io = Io.listen(config.server);

	io.sockets.on('connection', function(socket){

	
   		setInterval(function(){
	
		},90000);


		socket.emit('notificacion', {camion:'Entrada Salida Unidad'});

	});
}*/

var Io = require('socket.io'),
	request = require('request'),
	app_clients = {};


var SocketIO = function(config){
	config = config || {};
	var io = Io.listen(config.server);

	io.sockets.on('connection', function(socket){
		socket.join('some::room');

		socket.on('login', function(data){
			if(data.user != ''){
				//data.user.socketid = socket.id;
				//app_clients[data.user.idusuario] = data.user
				//io.to(data.user.socketid).emit('hello', { mensaje :'Conectado correctamente: ' + (new Date().toString()) + ' ID: ' });
			    socket.emit('hello', { mensaje :'Conectado correctamente: ' + (new Date().toString()) + ' ID: ' + socket.id });
				console.log('------Usuarios conectados--------');
				console.log(app_clients);
			}

		});
		// socket.on('app_user',function(user){
		// 	app_clients[user.id] = user
		// });

		/*socket.on('disconnect', function(){
			// delete app_user[socket.store.id];
			//array.splice(index, 1);
			console.log('Desconectado ' + socket.id );
		})*/
	});

	//Se programa el envío automático de notificaciones a los usuarios conectados
	setInterval(function(){
  		for(key in app_clients)
		{
			  request(
			    { 	
			    	method: 'GET',
			    	uri: 'http://localhost:4200/api/cita/get_notificaciones'  
			    }
			  , function (error, response, body) {
			      if(response.statusCode == 200){
			      	var JSONbody = JSON.parse(body);
			      	if(JSONbody.length > 0){
						//Envio los datos al usuario
			      		io.to('').emit('pkgNotificacion',  JSONbody);
			      		console.log('Paquete enviado a empleado : ');
			      	}
			      } 
			      else {
			        console.log('error: '+ response.statusCode);
			        console.log(body);
			      }
			    }
			  );
		}
	}, 10000); 
}
module.exports = SocketIO;