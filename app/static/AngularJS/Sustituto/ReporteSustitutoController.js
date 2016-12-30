    registrationModule.controller('ReporteSustitutoController', function (MarkerCreatorService, citaRepository,$scope, $modal, $route, $rootScope, $location, localStorageService, alertFactory, globalFactory, sustitutoRepository,ordenServicioRepository, uploadRepository, ordenPorCobrarRepository, commonService, ordenAnticipoRepository, trabajoRepository ) {
    	
        $scope.init = function (){

             $scope.getReporteSustituto();
             //$scope.getUbicacionMapa = function (idUnidad);

        }


     

                
                function refresh(marker) {
                    $scope.map.control.refresh({latitude: marker.latitude,
                        longitude: marker.longitude});
                }

                $scope.info = function () {
                     $('#informacionUnidad').appendTo("body").modal('show');
                }

                $scope.CierraModal = function () {
                     $('#informacionUnidad').modal('hide');
                }




            $scope.posicionUnidad = function (idUnidad, metodo){
                
                 $('#MapaModal').appendTo("body").modal('show');
                 
                 $scope.getUbicacionMapa(idUnidad, metodo);

            }

            $scope.Desvinculacion=function () {
            swal({
                    title: "Advertencia",
                    text: "¿Está seguro en eliminar la Vinculacion ?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#67BF11",
                    confirmButtonText: "Si",
                    cancelButtonText: "No",
                    closeOnConfirm: true,
                    closeOnCancel: true
                },
                function (isConfirm) {
                    if (isConfirm) 
                       {
                            swal("Desvincular", " Desvincular?", "success");
                          } else {
                            swal("Cancelled", "Your imaginary file is safe :)", "error");
                          } 
                });
            }

                //crea funcion getReporteSustituto

        $scope.getReporteSustituto = function () {
            sustitutoRepository.getReporte().then(function (reporte) {//va a mi repository y entra a function getReporte [.then(function (reporte)  es para que devuelva repuesta]
                if (reporte.data.length > 0) { //valida que tenga una caden amayor de cero sino es porque no tiene registros
                    $scope.reporteSustituto = reporte.data;
                    
                    alertFactory.success("Reporte cargado");
                } else {
                    alertFactory.info("No se encontraron Reporte");
                }
            }, function (error) {
                alertFactory.error("Error al cargar Reporte Sustituto");
            });
        }

        $scope.getUbicacionMapa = function (idUnidad, metodo) {
            $scope.validaUnidad = metodo;
            if($scope.validaUnidad==1)
               $scope.Unidad = idUnidad;
            if($scope.validaUnidad==2)
               $scope.Unidad = idUnidad;

            citaRepository.ubicaUnidad($scope.Unidad).then(function (result) {  
          
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


    });
