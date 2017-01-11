registrationModule.controller('mainController', function ($scope, $rootScope, $location, localStorageService, mainRepository, alertFactory) {
    $rootScope.showChat = 0;
     var citaMsg = localStorageService.get('citaMsg');

    $scope.descripcion = localStorageService.get('desc');
    $scope.comentarios = '';
    $scope.comentario = '';

    //Gestiona la conexión con el socket
    $scope.socket = null;
    $scope.connected = false;


    $scope.init = function () {
         $scope.cargaChatTaller();
         $scope.cargaChatCliente();
        $rootScope.userData = localStorageService.get('userData');

    //Valida que el socket este encendido 
    setInterval(function() {
           if (!$scope.connected) {
               console.log('Intentando reconexión...');
               SocketConnect();
           }
    }, 10000);

    }

    $scope.cargaChatTaller = function () {
        if (citaMsg !== null) {
            mainRepository.getChat(citaMsg, 1).then(function (result) {
                if (result.data.length > 0) {
                    $scope.chattaller = result.data;
                }
            }, function (error) {});
        }
    }

$scope.cargaChatCliente = function () {
        if (citaMsg !== null) {
            mainRepository.getChat(citaMsg, 2).then(function (result) {
                if (result.data.length > 0) {
                    $scope.chatcliente = result.data;
                }
            }, function (error) {});
        }
    }

    $scope.EnviarComentario1 = function (comentarios, idTipoChat) {
        mainRepository.putMessage($rootScope.userData.idUsuario, comentarios, citaMsg, idTipoChat).then(function (result) {
                $scope.algo = result.data;
                $scope.clearComments();
                $scope.cargaChatTaller();
            },
            function (error) {});
    }

     $scope.EnviarComentario2 = function (comentario) {
        mainRepository.putMessage($rootScope.userData.idUsuario, comentario, citaMsg, 2).then(function (result) {
                $scope.algo = result.data;
                $scope.BorraComentario();
                $scope.cargaChatCliente();
            },
            function (error) {});
    }

    $scope.clearComments = function () {
        $scope.comentarios = '';
    }
    $scope.BorraComentario = function () {
        $scope.comentario = '';
    }


    /////////////////////////////////////////////////////////////////////
    // FUNCIONES DE SOCKET
    ////////////////////////////////////////////////////////////////////

    //Conecta el socket
    var SocketConnect = function() {
            //Inicio sesión en el socket para recibir actualizaciones
        $scope.socket = io.connect('http://localhost:4200/');
            if ($scope.socket != null) {
                SocketJoin();
            }
    };

          //Declara los mensajes principales del socket
    var SocketJoin = function() {
            //Envío mis datos de usuario  
        $scope.socket.emit('login', {user: 'Integra'});

        $scope.socket.on('hello', function(data) {
             $scope.connected = true;
         });

        $scope.socket.on('pkgNotificacion', function(data) {
            // console.log(data.length)
            var txt="";
        setTimeout(function(){ 
            for (var i = 0; i < data.length; i++) {
                if (data[i].tipoAcceso==0) {
                    txt=' al taller';
                }else{
                    txt=' del taller';
                }

                   alertFactory.notification('La unidad '+ data[i].numEconomico +' a '+data[i].descripcionTipoAcceso+txt);

                
            };
                        }, 9000);
        });

        $scope.socket.on('disconnect', function() {
            $scope.connected = false;
        });
     };
       
});
