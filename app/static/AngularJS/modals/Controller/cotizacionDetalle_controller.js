
registrationModule.controller('cotizacionDetalle_controller', function ($scope, $modalInstance, $modal, idTrabajo, origen, utilidad, callback, error, $http, $sce, $window, ordenServicioRepository, alertFactory) {

	
    $scope.init = function(){
        $scope.show_Aprobacion= false; 
        $scope.show_cita= false; 
        $scope.show_orden= false; 

         if (origen == 'Aprobacion') {
            $scope.show_Aprobacion= true;
        }else if (origen == 'Cita') {
            $scope.show_cita= true; 
        }else if (origen == 'Orden') {
            $scope.show_orden= true; 
        }

        $scope.utilidad=utilidad;

         ordenServicioRepository.getDetalleOrden(parseInt(idTrabajo)).then(function (detalle) {
          
            $scope.detalleOrden=detalle.data;
            $scope.sumaIvaTotal = 0;
            $scope.sumaPrecioTotal =0;
            $scope.sumaIvaTotalCliente =0;
            $scope.sumaPrecioTotalCliente =0;
            $scope.sumaGranTotal =0;
            $scope.sumaGranTotalCliente =0;
            $scope.detalleOrden=detalle.data;
             for (var i = 0; i < detalle.data.length; i++) {
                //Sumatoria Taller
                $scope.sumaIvaTotal += (detalle.data[i].cantidad * detalle.data[i].precio) * (detalle.data[i].valorIva / 100);
                $scope.sumaPrecioTotal += (detalle.data[i].cantidad * detalle.data[i].precio);

                //Sumatoria Cliente
                $scope.sumaIvaTotalCliente += (detalle.data[i].cantidad * detalle.data[i].precioCliente) * (detalle.data[i].valorIva / 100);
                $scope.sumaPrecioTotalCliente += (detalle.data[i].cantidad * detalle.data[i].precioCliente);
            }
            //Total Taller
            $scope.sumaGranTotal = ($scope.sumaPrecioTotal + $scope.sumaIvaTotal);

            //Total Cliente
            $scope.sumaGranTotalCliente = ($scope.sumaPrecioTotalCliente + $scope.sumaIvaTotalCliente);

            $('.modal-dialog').css('width','1050px'); 

        }, function (error) {
           alertFactory.error("Error al cargar la orden");
        });

    }

     $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };

     $scope.aprobarUtilidad = function (){
         $('.modal-dialog').css('width','600px'); 
         callback();
         $scope.close();         
    }

});	