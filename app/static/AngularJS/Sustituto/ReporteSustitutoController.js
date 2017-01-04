registrationModule.controller('ReporteSustitutoController', function (MarkerCreatorService, citaRepository,$scope, $modal, $route, $rootScope, $location, localStorageService, alertFactory, globalFactory, sustitutoRepository,ordenServicioRepository, uploadRepository, ordenPorCobrarRepository, commonService, ordenAnticipoRepository, trabajoRepository ) {
        	
    $scope.init = function (){
        $scope.getReporteSustituto();
        $scope.getMotivo();
    }
       
    $scope.posicionUnidad = function (idUnidad){
        modal_detalle_ubicacion($scope, $modal, idUnidad, '', '');
    }

    $scope.Desvinculacion=function (idUnidadSustituto) {
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
            if (isConfirm){
                sustitutoRepository.putUnidadDesvicula(idUnidadSustituto).then(function (unidadSustituto) {//va a mi repository y entra a function getReporte [.then(function (reporte)  es para que devuelva repuesta]
                    if (unidadSustituto.data.length > 0) { //valida que tenga una caden amayor de cero sino es porque no tiene registros 
                        swal("Exito", " La unidad a sido Desvinculada", "success");
                        $scope.getReporteSustituto();
                    } else {
                        alertFactory.info("Fallo el Proceso de desvincular");
                    }
                }, function (error) {
                    alertFactory.error("Error al desvincular la unidad");
                });
                    } else {
                        swal("Proceso Cancelado", "Unidad no Desvinculada");
                    } 
                });
            }

           $scope.validaMotivo = function (motivo){
            $('.dataTableReporteSustituto').DataTable().destroy();
            $scope.reporteSustituto=[];
            if(motivo != null){
                $scope.idMotivoUnidad=motivo.idMotivo;
            }else{
                 $scope.idMotivoUnidad=null;
            }  
             $scope.getReporteSustituto();
            }

            //crea funcion getReporteSustituto
            $scope.getReporteSustituto = function () {
                sustitutoRepository.getReporte($scope.idMotivoUnidad).then(function (reporte) {//va a mi repository y entra a function getReporte [.then(function (reporte)  es para que devuelva repuesta]
                    if (reporte.data.length > 0) { //valida que tenga una caden amayor de cero sino es porque no tiene registros
                        $scope.reporteSustituto = reporte.data;
                         globalFactory.waitDrawDocument("dataTableReporteSustituto", "ReporteSustituto");
                        alertFactory.success("Reporte cargado");
                    } else {
                        alertFactory.info("No se encontraron Reporte");
                    }
                }, function (error) {
                    alertFactory.error("Error al cargar Reporte Sustituto");
                });
            }

            //Funcion que devuelve la descripcion de los motivos de las asignacion de sustitutos  
        $scope.getMotivo = function () {
            sustitutoRepository.getMotivo().then(function (motivo) {
                if (motivo.data.length > 0) {
                    $scope.motivos = motivo.data;
                    
                    alertFactory.success("Motivos cargados");
                } else {
                    alertFactory.info("No se encontraron motivos");
                }
            }, function (error) {
                alertFactory.error("Error al cargar motivos");
            });
        }

        });
