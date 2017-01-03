
registrationModule.controller('semaforoDetalle_controller', function ($scope, $modalInstance,  $modal, origen, $http, $sce, $window, citaRepository, MarkerCreatorService, alertFactory) {

    $scope.show_cita=false;
    $scope.show_trabajo=false;
	
    $scope.init = function(){
        if (origen == 'cita') {
            $scope.show_cita=true;  
        }else{
            $scope.show_trabajo=true;
        }
    }


     
       

     $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };

    

});	