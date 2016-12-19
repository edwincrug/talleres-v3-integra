// -- =============================================
// -- Author:      V. Vladimir Juárez Juárez
// -- Create date: 25/08/2016
// -- Description: controlador para los anticipos de las órdenes
// -- Modificó: 
// -- Fecha: 
// -- =============================================

registrationModule.controller('ordenAnticipoController', function ($scope,$rootScope, localStorageService, alertFactory, globalFactory, ordenAnticipoRepository) {

    //método de inicio en la pantalla en relación
    $scope.init = function () {
        getOrdenesAnticipoPendiente();
        getOrdenesAnticipoAplicado();
    }
    
    //obitiene las órdenes pendiente de atincipo
    var getOrdenesAnticipoPendiente = function(){
        $scope.promise = ordenAnticipoRepository.getOrdenesAnticipoPendiente().then(function(anticipoPendiente){
            if(anticipoPendiente.data.length){
                $('.dataTablePendienteAnticipo').DataTable().destroy();
                $scope.ordenesAticipoPendiente = anticipoPendiente.data;
                globalFactory.waitDrawDocument("dataTablePendienteAnticipo", "ÓrdenAnticipo");
                alertFactory.success("Órdenes con anticipos pendientes cargados");
            }
            else{
                alertFactory.info("No existen órdenes con anticipos pendientes");
            }
        }, function(error){
            alertFactory.error("Error al obtener órdenes con anticipo pendiente");
        });
    }
    
    //obtiene las órdenes con anticipos aplicados
    var getOrdenesAnticipoAplicado = function(){
        $scope.promise = ordenAnticipoRepository.getOrdenesAnticipoAplicado().then(function(anticipoAplicado){
            if(anticipoAplicado.data.length){
                $('.dataTableAnticipoAplicado').DataTable().destroy();
                $scope.ordenesAticipoAplicado = anticipoPendiente.data;
                globalFactory.waitDrawDocument("dataTableAnticipoAplicado", "ÓrdenAnticipo");
                alertFactory.success("Órdenes con anticipos aplicados cargados");
            }
            else{
                alertFactory.info("No existen órdenes con anticipos aplicados");
            }
        }, function(error){
            alertFactory.error("Error al obtener órdenes con anticipo aplicado");
        });
    }
    
    //visualiza las prefacturas del anticipo
    $scope.verPreFactura = function (idTrabajo) {
        window.open($rootScope.vIpServer + '/uploads/files/' + idTrabajo + '/documentos/preFactura/ComprobantePreFactura.xml', '_blank', 'PreFactura');
        window.open($rootScope.vIpServer + '/uploads/files/' + idTrabajo + '/documentos/preFactura/ComprobantePreFactura.pdf', '_blank', 'PreFactura');
    }
});