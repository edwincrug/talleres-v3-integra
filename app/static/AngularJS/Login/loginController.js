registrationModule.controller('loginController', function ($scope, alertFactory, $rootScope, localStorageService, loginRepository, $route, citaRepository) {
    $rootScope.sesion = 0;
    $rootScope.showChat = 0;

    $scope.init = function () {}

    $scope.login = function (username, password) {
        loginRepository.login(username, password)
            .then(function (result) {
                if (result.data.length > 0) {
                    alertFactory.success('Bienvenido a Talleres: ' + result.data[0].nombreCompleto);
                    $scope.login = result.data[0];
                    localStorageService.set('userData', $scope.login);
                    if ($route.current.params.confCita != undefined) {
                        var idConfCita = Number($route.current.params.confCita);
                        if (idConfCita != 0) {
                            citaRepository.validaConfirmacionCita(idConfCita).then(function (exists) {
                                if (exists.data[0].existe == 1) {
                                    alertFactory.info("La cita ya ha sido confirmada");
                                } else {
                                    alertFactory.success("Cita confirmada");
                                }
                            });
                        }
                    }
                    location.href = '/dashboardgeneral';
                    /*  if ($scope.login.idTipoUsuario == 3) {
                          location.href = '/tallercita';
                      } else if ($scope.login.idTipoUsuario == 1) {
                          location.href = '/dashboardgeneral';
                      } else {
                          location.href = '/cita';
                      }*/
                } else {
                    alertFactory.info('Valide el usuario y/o contraseña');
                }
            }, function (error) {
                alertFactory.error('Error');
            });
    }
});