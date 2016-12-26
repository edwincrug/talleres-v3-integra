registrationModule.controller('asignacionSustitutoController', function ($scope, $modal, $route, $rootScope, $location, localStorageService, alertFactory, globalFactory, ordenServicioRepository, uploadRepository, ordenPorCobrarRepository, commonService, ordenAnticipoRepository, trabajoRepository ) {
	
	$scope.motivos= [];

	$scope.init_asignacion = function (){

		obj=new Object();
        obj.nombre='Por orden';
        $scope.motivos.push(obj);
        obj=new Object();
        obj.nombre='Seguro (accidentado, .. )';
        $scope.motivos.push(obj);
        obj=new Object();
        obj.nombre='Robada';
        $scope.motivos.push(obj);
	}

});