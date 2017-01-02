registrationModule.controller('notificacionesController', function ($scope, $route, $modal, $rootScope, localStorageService, alertFactory, sustitutoRepository, uploadRepository, ordenPorCobrarRepository, ordenAnticipoRepository, trabajoRepository) {
 

 	$scope.init = function (){

         $scope.getNotificaciones();

	}


    $scope.getNotificaciones = function () {
    	
        sustitutoRepository.getNotificaciones().then(function (rest) {
        	
            if (rest.data.length > 0) {
                $scope.notificaciones = rest.data;
                
                alertFactory.success("Motivos cargados");
            } else {
                alertFactory.info("No se encontraron notificaciones");
            }
        }, function (error) {
            alertFactory.error("Error al cargar motivos");
        });
    }

 });