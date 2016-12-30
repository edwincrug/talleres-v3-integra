    registrationModule.controller('ReporteSustitutoController', function (MarkerCreatorService, citaRepository,$scope, $modal, $route, $rootScope, $location, localStorageService, alertFactory, globalFactory, sustitutoRepository,ordenServicioRepository, uploadRepository, ordenPorCobrarRepository, commonService, ordenAnticipoRepository, trabajoRepository ) {
    	
        $scope.init = function (){

             $scope.getReporteSustituto();

        }
   
        $scope.posicionUnidad = function (idUnidad){

            modal_detalle_ubicacion($scope, $modal, idUnidad, '', '');

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

    });
