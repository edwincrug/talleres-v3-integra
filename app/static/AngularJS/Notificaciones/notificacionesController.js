registrationModule.controller('notificacionesController', function ($scope, $route, $modal, $rootScope, localStorageService, alertFactory, sustitutoRepository, uploadRepository, ordenPorCobrarRepository, ordenAnticipoRepository, trabajoRepository) {
 

    $scope.fechaInicio = '';
    $scope.fechaFin = '';
    $scope.unidad ='';
    $scope.selectedTipo = '';
    $scope.notificaciones=[];

 	$scope.init = function (){

         $scope.getNotificaciones();
         $scope.tipo();

	}


    $scope.getNotificaciones = function () {
        
        var tipo = null;
        $scope.notificaciones=[];

        $scope.fechaInicio == '' ? $scope.fechaInicio = null : $scope.fechaInicio;
        $scope.fechaFin == '' ? $scope.fechaFin = null : $scope.fechaFin;
        $scope.unidad == '' ? $scope.unidad = null : $scope.unidad;
        $scope.selectedTipo == '' ? $scope.selectedTipo = null : $scope.selectedTipo;

        if ($scope.selectedTipo != null) {
            tipo = $scope.selectedTipo.id;
        };
    	
        sustitutoRepository.getNotificaciones(tipo, $scope.unidad, $scope.fechaInicio,  $scope.fechaFin).then(function (rest) {
        	
            if (rest.data.length > 0) {
                $scope.notificaciones = rest.data;
                
                alertFactory.success("Datos cargados");
            } else {
                alertFactory.info("No se encontraron datos");
            }
        }, function (error) {
            alertFactory.error("Error al cargar datos");
        });
    }

    $scope.buscaFiltros = function (){

       $scope.getNotificaciones (); 
    }

    $scope.tipo = function (){

        $scope.tipos = [];

        obj=new Object();
        obj.nombre='Llegada';
        obj.id=0;
        $scope.tipos.push(obj);

        obj=new Object();
        obj.nombre='Salida';
        obj.id=1;
        $scope.tipos.push(obj);
    }

    //Rango de datos
    /*$('#data_5 .input-daterange').datepicker({
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true
    });*/

 });