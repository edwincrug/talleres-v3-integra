// -- =============================================
// -- Author:      Anel Candi Pérez pérez
// -- Create date: 18/11/2016
// -- Description: Arobación de provisión
// -- Modificó: 
// -- Fecha: 
// -- Modificó: 
// -- Fecha:
// -- =============================================


registrationModule.controller('aprobacionProvisionController', function ($scope, $modal, $route, $rootScope, $location, localStorageService, alertFactory, globalFactory, ordenServicioRepository, uploadRepository, ordenPorCobrarRepository, commonService, ordenAnticipoRepository, trabajoRepository ) {
  	

  	$scope.init =function(){
  		$scope.getAprobacionProvision();
  	}	

  	$scope.getAprobacionProvision = function () {

        $scope.aprobacionProvision =[];
        $('.dataTableAprobacionProvision').DataTable().destroy();
        ordenServicioRepository.getAprobacionProvision().then(function (res) {
        
            if (res.data.length > 0) {
               $scope.aprobacionProvision=res.data;
               globalFactory.waitDrawDocument("dataTableAprobacionProvision", "Provisión");
               
            } else {
                alertFactory.info("No se encontrarón datos");
            }
        }, function (error) {
            alertFactory.error("Error al cargar la orden");
        });
    }


    $scope.aprobarProvision = function (provision){

    	swal({
            title: "Advertencia",
            text: "¿Está seguro de aprobar la provisión de la orden?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#67BF11",
            confirmButtonText: "Si",
            cancelButtonText: "No",
            closeOnConfirm: false,
            closeOnCancel: true
        },
         function (isConfirm) {
            if (isConfirm) {

            	ordenServicioRepository.putAprobacionProvision(provision.idTrabajo, $scope.userData.idUsuario ).then(function (res) {
        
		            if (res.data[0].id == 1) {
		            	 swal("Proceso Realizado!");
		            	$scope.getAprobacionProvision();
		            }else if (res.data[0].id  == 2) {
		            	 swal("Ya se encuentra procesada");
		            }
		        }, function (error) {
		            alertFactory.error("Error al cargar la orden");
		        });
            }
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

    $scope.aprobarTrabajo = function (trabajo, valBotonera) {
        var objBotonera = {};
        objBotonera.accion = valBotonera;
        objBotonera.idCita = trabajo.idCita;
        localStorageService.set('objTrabajo', trabajo);
        localStorageService.set("botonera", objBotonera);        
        commonService.idEstatusTrabajo = 5;  
        commonService.idCita = trabajo.idCita;
        $location.path ('/ordenservicio');
    }



  });