registrationModule.controller('dashBoardController', function ($scope, alertFactory, $rootScope, localStorageService, $route, dashBoardRepository) {
    $scope.zonaSelected = null;
    $scope.tarSelected = null;
    $scope.totalCitas = 0;
    $scope.totalCotizaciones = 0;
    $scope.totalOrdenes = 0;
    $scope.totalOrdenesPorCobrar = 0;
    $scope.userData = localStorageService.get('userData');

    $scope.init = function () {
        $scope.devuelveZonas();
        $scope.sumatoriaCitas();
        $scope.sumatoriaCotizaciones();
        $scope.sumatoriaOrdenes();
        $scope.sumatoriaOrdenesPorCobrar();
    }

    $scope.sumatoriaCitas = function () {
        dashBoardRepository.getTotalCitas($scope.tarSelected, $scope.userData.idUsuario, $scope.zonaSelected).then(function (datos) {
            if (datos.data.length > 0) {
                $('#morris-donut-citas').empty();
                var solicitadas = 0;
                var agendadas = 0;
                var confirmadas = 0;
                var canceladas = 0;

                $scope.citas = datos.data;
                $scope.totalHorasCitas = 0;

                datos.data.forEach(function (sumatoria) {
                        if (sumatoria.estatus == 'Solicitadas por Cliente') solicitadas = sumatoria.total;
                        /*if (sumatoria.estatus == 'Falta recepción de unidad') agendadas = sumatoria.total;*/
                        if (sumatoria.estatus == 'Falta cotizar orden') confirmadas = sumatoria.total;
                        if (sumatoria.estatus == 'Canceladas') canceladas = sumatoria.total;

                        $scope.totalHorasCitas = $scope.totalHorasCitas + sumatoria.promedio;

                    }

                );

                $scope.totalCitas = solicitadas + confirmadas + canceladas;

                Morris.Donut({
                    element: 'morris-donut-citas',
                    data: [
                        {
                            label: "Solicitadas por Cliente",
                            value: solicitadas
                        },
                        {
                            label: "Falta cotizar orden",
                            value: confirmadas
                        },
                        /*{
                            label: "Falta recepción de unidad",
                            value: confirmadas
                        },*/
                        {
                            label: "Canceladas",
                            value: canceladas
                        }
                    ],
                    resize: true,
                    colors: ['#00BFFF', '#074F7D', '#5B86A6'],
                    /*colors: ['#591FCE', '#0C9CEE', '#3DBDC2', '#A1F480'],*/
                }).on('click', function (i, row) {
                    location.href = '/reportecita?tipoCita=' + i + '&idZona=' + $scope.zonaSelected + '&idTar=' + $scope.tarSelected;
                });
            }
        }, function (error) {
            alertFactory.error('No se pudo recuperar información de las citas');
        });
    }

    $scope.sumatoriaCotizaciones = function () {
        dashBoardRepository.getTotalCotizaciones($scope.zonaSelected, $scope.tarSelected, $scope.userData.idUsuario).then(function (cotizaciones) {
            if (cotizaciones.data.length > 0) {
                $('#morris-donut-cotizaciones').empty();
                var pendientes = 0;
                var sinCotizacion = 0;

                $scope.cotizacionesD = cotizaciones.data;
                $scope.totalHorasCotizaciones = 0;

                cotizaciones.data.forEach(function (sumatoria) {
                    if (sumatoria.estatus == 'Falta autorización de diagnóstico') pendientes = sumatoria.total;
                    /*if (sumatoria.estatus == 'Falta validación de diagnóstico') sinCotizacion = sumatoria.total;*/

                    $scope.totalHorasCotizaciones = $scope.totalHorasCotizaciones + sumatoria.promedio;
                });


                $scope.totalCotizaciones = pendientes;

                Morris.Donut({
                    element: 'morris-donut-cotizaciones',
                    data: [
                        {
                            label: "Falta autorización de diagnóstico",
                            value: pendientes
                        }
                       /* ,{
                            label: "Falta validación de diagnóstico",
                            value: sinCotizacion
                        }*/
                    ],
                    resize: true,
                    colors: ['#2EE9FF'],
                    /*colors: ['#FF889A', '#CA4B7C', '#7A2E7A'],*/
                }).on('click', function (i, row) {
                    location.href = '/reportecotizacion?tipoCotizacion=' + i + '&idZona=' + $scope.zonaSelected + '&idTar=' + $scope.tarSelected;
                });
            }
        }, function (error) {
            alertFactory.error('No se pudo recuperar información de las cotizaciones');
        });
    }

    $scope.devuelveZonas = function () {
        dashBoardRepository.getZonas($scope.userData.idUsuario).then(function (zonas) {
            if (zonas.data.length > 0) {
                $scope.zonas = zonas.data;

            }
        }, function (error) {
            alertFactory.error('No se pudo recuperar información de las citas');
        });
    }

    $scope.devuelveTars = function () {
        if ($scope.zonaSelected != null) {
            dashBoardRepository.getTars($scope.zonaSelected).then(function (tars) {
                if (tars.data.length > 0) {
                    $scope.tars = tars.data;

                }
            }, function (error) {
                alertFactory.error('No se pudo recuperar información de las citas');
            });
        } else {
            $scope.tarSelected = null;
        }
        $scope.sumatoriaCitas();
        $scope.sumatoriaCotizaciones();
        $scope.sumatoriaOrdenes();
        $scope.sumatoriaOrdenesPorCobrar();
    }

    $scope.getDashBoard = function () {
        $scope.sumatoriaCitas();
        $scope.sumatoriaCotizaciones();
        $scope.sumatoriaOrdenes();
        $scope.sumatoriaOrdenesPorCobrar();
    }

    $scope.sumatoriaOrdenes = function () {
        dashBoardRepository.getTotalOrdenes($scope.zonaSelected, $scope.tarSelected, $scope.userData.idUsuario).then(function (ordenes) {
            if (ordenes.data.length > 0) {
                $('#morris-donut-ordenes').empty();
                var proceso = 0;
                var terminados = 0;
                var custodia = 0;
                var conformidad = 0;
                var garantia = 0;

                $scope.ordenesServicio = ordenes.data;
                $scope.totalHorasOrdenesServicio = 0;

                $scope.ordenesServicio.splice(5, 3);

                ordenes.data.forEach(function (sumatoria) {
                        if (sumatoria.estatus == 'En proceso de reparación') proceso = sumatoria.total;
                        if (sumatoria.estatus == 'Falta recoger unidad') terminados = sumatoria.total;
                        if (sumatoria.estatus == 'Falta generar certificado') custodia = sumatoria.total;
                        if (sumatoria.estatus == 'Falta aceptación de trabajo') conformidad = sumatoria.total;
                        if (sumatoria.estatus == 'Con reclamación de cliente') garantia = sumatoria.total;

                        $scope.totalHorasOrdenesServicio = $scope.totalHorasOrdenesServicio + sumatoria.promedio;
                    }

                );

                $scope.totalOrdenes = proceso + terminados + custodia + conformidad + garantia;

                Morris.Donut({
                    element: 'morris-donut-ordenes',
                    data: [
                        {
                            label: "Con reclamación de cliente",
                            value: garantia
                        },
                        {
                            label: "Falta aceptación de trabajo",
                            value: conformidad
                        },
                        {
                            label: "Falta generar certificado",
                            value: custodia
                        },
                        {
                            label: "Falta recoger unidad",
                            value: terminados
                        },
                        {
                            label: "En proceso de reparación",
                            value: proceso
                        }
                    ],
                    resize: true,
                    colors: ['#4D4040', '#E3D494', '#FFBF75', '#F09090', '#C45C75'],
                }).on('click', function (i, row) {
                    location.href = '/reporteorden?tipoOrden=' + i + '&idZona=' + $scope.zonaSelected + '&idTar=' + $scope.tarSelected;
                });
            }
        }, function (error) {
            alertFactory.error('No se pudo recuperar información de las ordenes');
        });
    }

    $scope.sumatoriaOrdenesPorCobrar = function () {
        dashBoardRepository.getTotalOrdenesPorCobrar($scope.zonaSelected, $scope.tarSelected, $scope.userData.idUsuario).then(function (ordenesCobrar) {
            if (ordenesCobrar.data.length > 0) {
                $('#morris-donut-cobrar').empty();
                var sinFactura = 0;
                var facturado = 0;
                var esperaCopade = 0;

                $scope.ordenesCobrarD = ordenesCobrar.data;
                $scope.totalHorasOrdenesCobrar = 0;

                $scope.ordenesCobrarD.splice(0, 5);

                ordenesCobrar.data.forEach(function (sumatoria) {
                        if (sumatoria.estatus == 'Ordenes sin COPADE') sinFactura = sumatoria.total;
                        if (sumatoria.estatus == 'PreFactura generada') esperaCopade = sumatoria.total;
                        if (sumatoria.estatus == 'Factura enviada al cliente') facturado = sumatoria.total;
                        /*if (sumatoria.estatus == 'ESPERA COPADE') revision = sumatoria.total;*/
                        $scope.totalHorasOrdenesCobrar = $scope.totalHorasOrdenesCobrar + sumatoria.promedio;
                    }

                );

                $scope.totalOrdenesPorCobrar = sinFactura + facturado + esperaCopade;

                Morris.Donut({
                    element: 'morris-donut-cobrar',
                    data: [
                        {
                            label: "Ordenes sin COPADE",
                            value: sinFactura
                        },
                        /*{
                            label: "EN REVISION",
                            value: revision
                        },*/
                        {
                            label: "PreFactura generada",
                            value: esperaCopade
                        },
                        {
                            label: "Factura enviada al cliente",
                            value: facturado
                        }
                    ],
                    resize: true,
                    colors: ['#ECDCCC', '#CB6501', '#C03427'],
                }).on('click', function (i, row) {
                    location.href = '/reporteporcobrar?tipoPorCobrar=' + i + '&idZona=' + $scope.zonaSelected + '&idTar=' + $scope.tarSelected;
                });
            }
        }, function (error) {
            alertFactory.error('No se pudo recuperar información de las ordenes por cobrar');
        });
    }

});