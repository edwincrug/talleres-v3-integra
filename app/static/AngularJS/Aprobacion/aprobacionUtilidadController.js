// -- =============================================
// -- Author:      Anel Candi Pérez pérez
// -- Create date: 10/10/2016
// -- Description: Arobación de utilidad
// -- Modificó: 
// -- Fecha: 
// -- Modificó: 
// -- Fecha:
// -- =============================================

registrationModule.controller('aprobacionutilidadController', function ($scope, $modal, $route, $rootScope, localStorageService, alertFactory, globalFactory, ordenServicioRepository, uploadRepository, ordenPorCobrarRepository, ordenAnticipoRepository, trabajoRepository ) {
        $scope.idTipoCotizacion=0;
        $scope.ideTaller=0;
    //init del controller
    $scope.init = function () {

        if ($scope.userData.idUsuario == 190) {
            $scope.titulo="Aprobaciones";
        }else if ($scope.userData.idUsuario == 213) {
            $scope.titulo="Aprobación de Salida de Unidades";
        }

        $scope.getAprobacionUtilidad();

    }

    $scope.getAprobacionUtilidad = function () {

        $scope.aprobacionUtilidades =[];
         $scope.aprobacionTrabajos =[];
        $('.dataTableAprobacionUtilidad').DataTable().destroy();
        $('.dataTableSalidaTrabajo').DataTable().destroy();

        ordenServicioRepository.getAprobacionUtilidad().then(function (aprobacionUtilidad) {
     
            if (aprobacionUtilidad.data.length > 0) {
               // alertFactory.success("Orden encontrada");
               for (var i = 0; i < aprobacionUtilidad.data.length; i++) {
                   if (aprobacionUtilidad.data[i].tipoAprobacion == 1) {
                        //$scope.aprobacionUtilidades += aprobacionUtilidad.data[i];
                        $scope.aprobacionUtilidades.push(aprobacionUtilidad.data[i]);
                   }else{
                        $scope.aprobacionTrabajos.push(aprobacionUtilidad.data[i]);
                   }
               };
                
               globalFactory.waitDrawDocument("dataTableAprobacionUtilidad", "Utilidad");
               globalFactory.waitDrawDocument("dataTableSalidaTrabajo", "SalidaTrabajo");
               
            } else {
                alertFactory.info("No se encontrarón datos");
            }
        }, function (error) {
            alertFactory.error("Error al cargar la orden");
        });
    }

     //visualiza la orden de servicio
    $scope.lookAt = function (trabajo, valBotonera) {
        var objBotonera = {};
        objBotonera.accion = valBotonera;
        objBotonera.idCita = trabajo.idCita;
        localStorageService.set('objTrabajo', trabajo);
        localStorageService.set("botonera", objBotonera);
        localStorageService.set('actualizaCosto', trabajo.numeroTrabajo)
        location.href = '/ordenservicio?state=1';
    }

     $scope.aprobar = function (utilidad) {
       $scope.idAprobacionUtilidad=utilidad.idAprobacionUtilidad; 

       if (utilidad.intentos>1) {
            modal_detalle_cotizacion($scope, $modal, utilidad.idTrabajo, 'Orden', utilidad.margenAnterior, $scope.aprobarUtilidad, '');  
       }else{
            modal_detalle_cotizacion($scope, $modal, utilidad.idTrabajo, 'Aprobacion', '', $scope.aprobarUtilidad, '');  
       }
        
    }

    $scope.aprobarUtilidad = function (){
         $('.modal-dialog').css('width','600px'); 
         modal_tiket($scope, $modal, $scope.idAprobacionUtilidad, 'Aprobacion', $scope.getAprobacionUtilidad, '');         
    }

    $scope.aprobarTrabajo = function (trabajo){
        
         modal_tiket($scope, $modal, trabajo.idAprobacionUtilidad, 'Aprobacion', $scope.getAprobacionUtilidad, '');    
    }

});



