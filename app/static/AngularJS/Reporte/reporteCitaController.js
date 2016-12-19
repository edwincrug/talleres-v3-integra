// -- =============================================
// -- Author:      Carlos Adolfo Martinez Diosdado
// -- Create date: 30/08/2016
// -- Description: Reporte Cita controller
// -- =============================================

registrationModule.controller('reporteCitaController', function ($scope, alertFactory, $rootScope, localStorageService, reporteCitaRepository) {
    $scope.userData = localStorageService.get('userData');
    $scope.idTar = 0;
    $scope.idZona = 0;

    //Inicializa la pagina
    $scope.init = function () {
        $scope.obtieneDatoUrl();
    }

    //obtiene el total de las citas
    $scope.getNumeroCitas = function () {
            reporteCitaRepository.getNumCita($scope.idTar, $scope.idZona, $scope.userData.idUsuario).then(function (citas) {
                $scope.registroCitas = citas.data;

                citas.data.forEach(function (sumatoria) {
                    if (sumatoria.ID == 1) $scope.citasolicitadas = sumatoria.total;
                    if (sumatoria.ID == 2) $scope.citasagendadas = sumatoria.total;
                    if (sumatoria.ID == 3) $scope.citasconfirmadas = sumatoria.total;
                    if (sumatoria.ID == 4) $scope.citascanceladas = sumatoria.total;
                });

                $scope.obtenPorcentaje();
                if (citas.data.length > 0) {
                    alertFactory.success('Datos encontrados');
                } else {
                    alertFactory.info('No se encontraron datos');
                }
            }, function (error) {
                alertFactory.error('Error al obtener los datos');
            });
        }
        //obtiene el procentaje de las citas
    $scope.obtenPorcentaje = function () {
            var totalCitas = $scope.citasolicitadas + $scope.citasagendadas + $scope.citasconfirmadas + $scope.citascanceladas;
            $scope.porcentajesolicitado = ($scope.citasolicitadas * 100) / totalCitas;
            $scope.porcentajeagendado = ($scope.citasagendadas * 100) / totalCitas;
            $scope.porcentajeconfirmado = ($scope.citasconfirmadas * 100) / totalCitas;
            $scope.porcentajecancelada = ($scope.citascanceladas * 100) / totalCitas;
        }
        //Muestra el historico de citas canceldas
    $scope.citaCancelada = function () {
            $scope.tipoCita = 3;
            $('.dataTableCancelada').DataTable().destroy();
            reporteCitaRepository.getHistorialCita(22, null, $scope.userData.idUsuario, $scope.idZona, $scope.idTar).then(function (citacancela) {
               
                $scope.cancelacion = citacancela.data;
                waitDrawDocument("dataTableCancelada");
                if (citacancela.data.length > 0) {
                    alertFactory.success('Exito al obtener citas canceladas');
                } else {
                    alertFactory.info('No se encontraron citas canceladas');
                }
            }, function (error) {
                alertFactory.error('Error al obtener los datos');
            });
        }
        //Muestra el historico de citas confirmadas
    $scope.citaConfirmada = function () {
            $scope.tipoCita = 2;
            $('.dataTableConfirmada').DataTable().destroy();
            reporteCitaRepository.getHistorialCita(2, null, $scope.userData.idUsuario, $scope.idZona, $scope.idTar).then(function (citaconfirma) {
               
                $scope.confirmacion = citaconfirma.data;
                waitDrawDocument("dataTableConfirmada");
                if (citaconfirma.data.length > 0) {
                    alertFactory.success('Exito al obtener citas confirmadas');
                } else {
                    alertFactory.info('No se encontraron citas confirmadas');
                }
            }, function (error) {
                alertFactory.error('Error al obtener los datos');
            });
        }
        //Muestra el historico de citas agendadas
    $scope.citaAgendada = function () {
            $scope.tipoCita = 1;
            $('.dataTableAgendada').DataTable().destroy();
            reporteCitaRepository.getHistorialCita(1, null, $scope.userData.idUsuario, $scope.idZona, $scope.idTar).then(function (citaagenda) {
                
                $scope.agendacion = citaagenda.data;
                waitDrawDocument("dataTableAgendada");
                if (citaagenda.data.length > 0) {
                    alertFactory.success('Exito al obtener citas agendadas');
                } else {
                    alertFactory.info('No se encontraron citas agendadas');
                }
            }, function (error) {
                alertFactory.error('Error al obtener los datos');
            });
        }
        //Muestra el historico de citas solicitadas
    $scope.citaSolicitada = function () {
        $scope.tipoCita = 0;
        $('.dataTableSolicitar').DataTable().destroy();
        reporteCitaRepository.getHistorialCita(1, 0, $scope.userData.idUsuario, $scope.idZona, $scope.idTar).then(function (citasolicita) {
            
            $scope.solicitacion = citasolicita.data;
            waitDrawDocument("dataTableSolicitar");
            if (citasolicita.data.length > 0) {
                alertFactory.success('Exito al obtener citas solicitadas');
            } else {
                alertFactory.info('No se encontraron citas solicitadas');
            }
        }, function (error) {
            alertFactory.error('Error al obtener los datos');
        });
    }

    //Regresa la variable de la url
    $scope.obtieneDatoUrl = function () {
        var url = location.search.replace("?", "");
        var arrUrl = url.split("&");
        var urlObj = {};
        for (var i = 0; i < arrUrl.length; i++) {
            var x = arrUrl[i].split("=");
            urlObj[x[0]] = x[1]
        }
        $scope.tipoCita = urlObj.tipoCita;
        $scope.idTar = urlObj.idTar;
        $scope.idZona = urlObj.idZona;
        urlObj.idTar == 'null' ? $scope.idTar = 0 : $scope.idTar = urlObj.idTar;
        urlObj.idZona == 'null' ? $scope.idZona = 0 : $scope.idZona = urlObj.idZona;
        if (url == '') {
            $scope.idTar = 0;
            $scope.idZona = 0;
        }
        if ($scope.tipoCita == 0) {
            $scope.citaSolicitada();
            $scope.getNumeroCitas();
      //  } else if ($scope.tipoCita == 1) {
       //     $scope.citaAgendada();
       //     $scope.getNumeroCitas();
        } else if ($scope.tipoCita == 1) {
            $scope.citaConfirmada();
            $scope.getNumeroCitas();
        } else if ($scope.tipoCita == 2) {
            $scope.citaCancelada();
            $scope.getNumeroCitas();
        } else {
            $scope.citaSolicitada();
            $scope.getNumeroCitas();
        }
    }

    //espera que el documento se pinte para llenar el dataTable
    var waitDrawDocument = function (dataTable) {
        setTimeout(function () {
            var indicePorOrdenar = 0;
            if (dataTable == 'dataTableSolicitar') {
                indicePorOrdenar = 10;
            } else if (dataTable == 'dataTableAgendada') {
                indicePorOrdenar = 11;
            } else if (dataTable == 'dataTableConfirmada') {
                indicePorOrdenar = 10;
            } else {
                indicePorOrdenar = 10;
            }

            $('.' + dataTable).DataTable({
                order: [[indicePorOrdenar, 'desc']],
                dom: '<"html5buttons"B>lTfgitp',
                "iDisplayLength": 100,
                buttons: [
                    {
                        extend: 'excel',
                        title: 'CitasRegistradas'
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
        }, 2500);
    }



});