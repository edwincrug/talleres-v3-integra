registrationModule.controller('reporteController', function ($scope, alertFactory, $rootScope, localStorageService, reporteRepository) {
    $scope.message = "Buscando...";
    
    $scope.init = function () {
        $scope.getReporte();
        $rootScope.userData = localStorageService.get('userData');
    }

    $scope.getReporte = function () {
        $scope.promise =
        reporteRepository.reporteGral()
            .then(function (result) {
                if (result.data.length > 0) {                    
                    $scope.datos = result.data;
                    
                    setTimeout(function () {
                        
                            $('.dataTableReporte').DataTable({
                                dom: '<"html5buttons"B>lTfgitp',
                                buttons: [
                                    {
                                        extend: 'excel',
                                        title: 'ReporteGeneral'
                                    },
                                    {
                                        extend: 'print',
                                        customize: function (win) {
                                            $(win.document.body).addClass('white-bg');
                                            $(win.document.body).css('font-size', '10px');

                                            $(win.document.body).find('table')
                                                .addClass('compact')
                                                .css('font-size', 'inherit');
                                        }
                            }
                        ]
                            });
                        }, 1000);
                } 
            }, function (error) {
                alertFactory.error('Error');
            });
    }
});

