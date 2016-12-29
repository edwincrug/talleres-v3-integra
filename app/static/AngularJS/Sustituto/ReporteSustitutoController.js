registrationModule.controller('ReporteSustitutoController', function (MarkerCreatorService,$scope, $modal, $route, $rootScope, $location, localStorageService, alertFactory, globalFactory, sustitutoRepository,ordenServicioRepository, uploadRepository, ordenPorCobrarRepository, commonService, ordenAnticipoRepository, trabajoRepository ) {
	
    $scope.init = function (){

         $scope.getReporteSustituto();

    }


MarkerCreatorService.createByCoords(19.4353367, -99.1379815, function (marker) {
        marker.options.labelContent = 'Posición';
        $scope.autentiaMarker = marker;
    });
    
    $scope.map = {
        center: {
            latitude: $scope.autentiaMarker.latitude,
            longitude: $scope.autentiaMarker.longitude
        },
        zoom: 12,
        markers: [],
        control: {},
        options: {
            scrollwheel: false
        }
    }

    $scope.map.markers.push($scope.autentiaMarker);

    $scope.addCurrentLocation = function () {
        MarkerCreatorService.createByCurrentLocation(function (marker) {
            marker.options.labelContent = 'Usted se encuentra Aqui';
            $scope.map.markers.push(marker);
            refresh(marker);
        });
    }

        $scope.posicionUnidad = function (){
            //debugger;
             $('#MapaModal').appendTo("body").modal('show');
        }

         $scope.posicionSustituto = function (){
            //debugger;
             $('#MapaModal').appendTo("body").modal('show');



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






