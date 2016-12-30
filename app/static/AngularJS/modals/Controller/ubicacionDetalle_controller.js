
registrationModule.controller('ubicacionDetalle_controller', function ($scope, $modalInstance,  $modal, idUnidad, callback, error, $http, $sce, $window, citaRepository, MarkerCreatorService, alertFactory) {

	
    $scope.init = function(){

        $scope.getUbicacionMapa();
    }


     $scope.getUbicacionMapa = function () {

            citaRepository.ubicaUnidad(idUnidad).then(function (result) {  
                
                 if (result.data.length > 0) {
                   
                   alertFactory.info('La unidad ha sido ubicada exitosamente');
                   $scope.latitud = result.data[0].lat;
                   $scope.longitud = result.data[0].long;
                   $scope.direccion = result.data[0].direccion;
                    $scope.bandera = 0;

                    MarkerCreatorService.createByCoords(parseFloat($scope.latitud), parseFloat($scope.longitud), function (marker) {
                        marker.options.labelContent = $scope.direccion;
                        $scope.autentiaMarker = marker;
                    });
                            $scope.map = {
                            center: {
                                latitude: $scope.autentiaMarker.latitude,
                                longitude: $scope.autentiaMarker.longitude
                            },
                            zoom: 17,
                            markers: [],
                            control: {},
                            options: {
                                scrollwheel: false
                            }
                        }    
                                             
                            $scope.map.markers.push($scope.autentiaMarker);    
                


                }else{
                    alertFactory.info('La unidad aun no tiene ubicacion GPS');
                    $scope.bandera = 1
                }   

                         
            }, function (error) {
                alertFactory.error("Error al cargar ubicación de la unidad");
            });
        }
       

     $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };

    

});	