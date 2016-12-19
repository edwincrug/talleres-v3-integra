// -- =============================================
// -- Author:      Carlos Adolfo Martinez Diosdado
// -- Create date: 30/08/2016
// -- Description: Reporte Cita controller
// -- =============================================

registrationModule.controller('reportePorCobrarController', function ($scope, alertFactory, $rootScope, localStorageService, reportePorCobrarRepository) {
    $scope.userData = localStorageService.get('userData');
        $scope.idTar = 0;
        $scope.idZona = 0; 
    //Inicializa la pagina
    $scope.init = function () {
            $scope.obtieneDatoUrl();
        }
        //obtiene el total de las ordenes por cobrar
    $scope.getNumeroPorCobrar = function () {
        reportePorCobrarRepository.getNumPorCobrar($scope.idZona,$scope.idTar,$scope.userData.idUsuario).then(function (porcobrar) {
            $scope.registroPorcobrar = porcobrar.data;

            porcobrar.data.forEach(function (sumatoria) {
                if (sumatoria.ID == 6) $scope.cobrarsinfactura = sumatoria.total;
                if (sumatoria.ID == 7) $scope.cobrarsincopade = sumatoria.total;
                if (sumatoria.ID == 8) $scope.ordenfacturadas = sumatoria.total;
            });
            $scope.obtenPorcentaje();
            if (porcobrar.data.length > 0) {
                alertFactory.success('Datos encontrados');
            } else {
                alertFactory.info('No se encontraron datos');
            }
        }, function (error) {
            alertFactory.error('Error al obtener los datos');
        });
    }

    //obtiene el procentaje de las ordenes por cobrar
    $scope.obtenPorcentaje = function () {
        var totalPorCobrar = $scope.cobrarsinfactura + $scope.cobrarsincopade + $scope.ordenfacturadas ;
        $scope.porcentajesinfactura = ($scope.cobrarsinfactura * 100) / totalPorCobrar;
        $scope.porcentajecopade = ($scope.cobrarsincopade * 100) / totalPorCobrar;
        $scope.porcentajefacturadas = ($scope.ordenfacturadas * 100) / totalPorCobrar;
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
        $scope.tipoPorCobrar = urlObj.tipoPorCobrar;
        $scope.idTar = urlObj.idTar;
        $scope.idZona = urlObj.idZona;
        urlObj.idTar == 'null' ? $scope.idTar = 0 : $scope.idTar = urlObj.idTar; 
        urlObj.idZona == 'null' ? $scope.idZona = 0 : $scope.idZona = urlObj.idZona;
        if(url==''){
        $scope.idTar = 0;
        $scope.idZona = 0;
        }
        if ($scope.tipoPorCobrar == 0) {
            $scope.ordensinFactura();
            $scope.getNumeroPorCobrar();
        } else if ($scope.tipoPorCobrar == 1) {
            $scope.ordensinCopade();
            $scope.getNumeroPorCobrar();
        } else if ($scope.tipoPorCobrar == 2) {
            $scope.facturada();
            $scope.getNumeroPorCobrar();
        } else {
            $scope.ordensinFactura();
            $scope.getNumeroPorCobrar();
        }
    }

    //espera que el documento se pinte para llenar el dataTable
    var waitDrawDocument = function (dataTable) {
        setTimeout(function () {
            //FAL ordenamiento de columnas 05092016
            var indicePorOrdenar = 0;
            if (dataTable == 'dataTableSinFactura') {
                indicePorOrdenar = 11;
            } else if (dataTable == 'dataTableSinCopade') {
                indicePorOrdenar = 6;
            } else if (dataTable == 'dataTableFacturados') {
                indicePorOrdenar = 6;
            } else {
                indicePorOrdenar = 6;
            }

            $('.' + dataTable).DataTable({
                order: [[indicePorOrdenar, 'desc']],
                dom: '<"html5buttons"B>lTfgitp',
                "iDisplayLength": 100,
                buttons: [
                    {
                        extend: 'excel',
                        title: 'OrdenesPorCobrarRegistradas'
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

        //Muestra el historico de ordenes facturadas
    $scope.facturada = function () {
        $scope.tipoPorCobrar = 2;
        reportePorCobrarRepository.getHistorialPorCobrar(2, $scope.userData.idUsuario,$scope.idZona,$scope.idTar).then(function (facturadas) {
            $('.dataTableFacturados').DataTable().destroy();
            $scope.datafacturada = facturadas.data;
            waitDrawDocument("dataTableFacturados");
            if (facturadas.data.length > 0) {
                alertFactory.success('Exito al obtener las ordenes Facturadas');
            } else {
                alertFactory.info('No se encontraron las ordenes Facturadas');
            }
        }, function (error) {
            alertFactory.error('Error al obtener los datos');
        });
    }

    //Muestra el historico de ordenes sin copade
    $scope.ordensinCopade = function () {
        $scope.tipoPorCobrar = 1;
        reportePorCobrarRepository.getHistorialPorCobrar(1, $scope.userData.idUsuario,$scope.idZona,$scope.idTar).then(function (sincopade) {
            $('.dataTableSinCopade').DataTable().destroy();
            $scope.datasincopade = sincopade.data;
            waitDrawDocument("dataTableSinCopade");
            if (sincopade.data.length > 0) {
                alertFactory.success('Exito al obtener las ordenes preFacturadas');
            } else {
                alertFactory.info('No se encontraron las ordenes preFacturadas');
            }
        }, function (error) {
            alertFactory.error('Error al obtener los datos');
        });
    }

    //Muestra el historico de ordenes sin factura
    $scope.ordensinFactura = function () {
        $scope.tipoPorCobrar = 0;
        reportePorCobrarRepository.getHistorialPorCobrar(24, $scope.userData.idUsuario,$scope.idZona,$scope.idTar).then(function (sinfactura) {
            $('.dataTableSinFactura').DataTable().destroy();
            $scope.datasinfactura = sinfactura.data;
            waitDrawDocument("dataTableSinFactura");
            if (sinfactura.data.length > 0) {
                alertFactory.success('Exito al obtener las ordenes sin COPADE');
            } else {
                alertFactory.info('No se encontraron las ordenes sin COPADE');
            }
        }, function (error) {
            alertFactory.error('Error al obtener los datos');
        });
    }

});