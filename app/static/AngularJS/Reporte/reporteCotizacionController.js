// -- =============================================
// -- Author:      Carlos Adolfo Martinez Diosdado
// -- Create date: 30/08/2016
// -- Description: Reporte Cita controller
// -- =============================================

registrationModule.controller('reporteCotizacionController', function ($scope, alertFactory, $rootScope, localStorageService, reporteCotizacionRepository) {
        $scope.userData = localStorageService.get('userData');
        $scope.idTar = 0;
        $scope.idZona = 0; 
    //Inicializa la pagina
    $scope.init = function () {
            $scope.obtieneDatoUrl();
        }
        //obtiene el total de las cotizaciones
    $scope.getNumeroCotizaciones = function () {
        reporteCotizacionRepository.getNumCotizacion($scope.idZona,$scope.idTar,$scope.userData.idUsuario).then(function (cotizaciones) {
            $scope.registroCotizaciones = cotizaciones.data;

            cotizaciones.data.forEach(function (sumatoria) {
                if (sumatoria.ID == 8) $scope.cotizacionaprovacion = sumatoria.total;
                if (sumatoria.ID == 15) $scope.sincotizacion = sumatoria.total;
            });
            $scope.obtenPorcentaje();
            if (cotizaciones.data.length > 0) {
                alertFactory.success('Datos encontrados');
            } else {
                alertFactory.info('No se encontraron datos');
            }
        }, function (error) {
            alertFactory.error('Error al obtener los datos');
        });
    }

    //obtiene el procentaje de las cotizaciones
    $scope.obtenPorcentaje = function () {
        var totalCotizacion = $scope.cotizacionaprovacion + $scope.sincotizacion;
        $scope.porcentajeaprovacion = ($scope.cotizacionaprovacion * 100) / totalCotizacion;
        $scope.porcentajecotizacion = ($scope.sincotizacion * 100) / totalCotizacion;
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
        $scope.tipoCotizacion = urlObj.tipoCotizacion;
        $scope.idTar = urlObj.idTar;
        $scope.idZona = urlObj.idZona;
        urlObj.idTar == 'null' ? $scope.idTar = 0 : $scope.idTar = urlObj.idTar; 
        urlObj.idZona == 'null' ? $scope.idZona = 0 : $scope.idZona = urlObj.idZona;
        if(url==''){
        $scope.idTar = 0;
        $scope.idZona = 0;
        }
        if ($scope.tipoCotizacion == 0) {
           $scope.cotizacionPendiente();
             $scope.getNumeroCotizaciones();
       //} else 
        //  if ($scope.tipoCotizacion == 0) {
         //   $scope.cotizacionSinCotizar();
         //    $scope.getNumeroCotizaciones();
        } else {
            $scope.cotizacionSinCotizar();
             $scope.getNumeroCotizaciones();
        }
    }

    //espera que el documento se pinte para llenar el dataTable
    var waitDrawDocument = function (dataTable) {
        setTimeout(function () {

            //FAL ordenamiento de columnas 05092016
            var indicePorOrdenar = 0;
            
            if (dataTable == 'dataTablePendiente') {
                indicePorOrdenar = 12;
            } else if (dataTable == 'dataTableSinCotizar') {
                indicePorOrdenar = 12;
            } 

            $('.' + dataTable).DataTable({
                dom: '<"html5buttons"B>lTfgitp',
                "iDisplayLength": 100,
                buttons: [
                    {
                        extend: 'excel',
                        title: 'CotizacionesRegistradas'
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

    //Muestra el historico de sin cotizar
    $scope.cotizacionSinCotizar = function () {
        $scope.tipoCotizacion = 1;
        reporteCotizacionRepository.getHistorialCotizacion($scope.idZona,$scope.idTar,15,$scope.userData.idUsuario).then(function (sincotizar) {
            $('.dataTableSinCotizar').DataTable().destroy();
            $scope.datasincotizacion = sincotizar.data;
            waitDrawDocument("dataTableSinCotizar");
            if (sincotizar.data.length > 0) {
                alertFactory.success('Exito al obtener las cotizaciones pendientes');
            } else {
                alertFactory.info('No se encontraron las cotizaciones pendientes');
            }
        }, function (error) {
            alertFactory.error('Error al obtener los datos');
        });
    }

    //Muestra el historico de cotizaciones pendientes
    $scope.cotizacionPendiente = function () {
        $scope.tipoCotizacion = 0;
        reporteCotizacionRepository.getHistorialCotizacion($scope.idZona,$scope.idTar,8,$scope.userData.idUsuario).then(function (pendiente) {
            $('.dataTablePendiente').DataTable().destroy();
            $scope.datapendiente = pendiente.data;
            waitDrawDocument("dataTablePendiente");
            if (pendiente.data.length > 0) {
                alertFactory.success('Exito al obtener cotizaciones pendientes de aprobar');
            } else {
                alertFactory.info('No se encontraron cotizaciones pendientes de aprobar');
            }
        }, function (error) {
            alertFactory.error('Error al obtener los datos');
        });
    }

});