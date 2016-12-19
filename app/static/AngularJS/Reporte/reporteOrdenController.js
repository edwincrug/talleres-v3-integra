// -- =============================================
// -- Author:      Carlos Adolfo Martinez Diosdado
// -- Create date: 30/08/2016
// -- Description: Reporte Orden controller
// -- =============================================
registrationModule.controller('reporteOrdenController', function ($scope, alertFactory, $rootScope, localStorageService, reporteOrdenRepository) {
        $scope.userData = localStorageService.get('userData');
        $scope.idTar = 0;
        $scope.idZona = 0; 
    $scope.init = function () {
     $scope.obtieneDatoUrl();
    }
    //obtiene el total de las citas
    $scope.getNumeroOrdenes = function () {
            reporteOrdenRepository.getNumOrdenes($scope.idZona,$scope.idTar,$scope.userData.idUsuario).then(function (ordenes) {
                $scope.registroOrdenes = ordenes.data;

              ordenes.data.forEach(function (sumatoria) {
                    if (sumatoria.ID == 4) $scope.ordencertificado = sumatoria.total;
                    if (sumatoria.ID == 5) $scope.ordengarantia = sumatoria.total;
                    if (sumatoria.ID == 3) $scope.ordencustodia = sumatoria.total;
                    if (sumatoria.ID == 2) $scope.ordenterminado = sumatoria.total;
                    if (sumatoria.ID == 1) $scope.ordenproceso = sumatoria.total;
                });

                $scope.obtenPorcentaje();
                if (ordenes.data.length > 0) {
                    alertFactory.success('Datos encontrados');
                } else {
                    alertFactory.info('No se encontraron datos');
                }
            }, function (error) {
                alertFactory.error('Error al obtener los datos');
            });
        }

        //obtiene el procentaje de las ordenes
    $scope.obtenPorcentaje = function () {
    var totalOrdenes = $scope.ordengarantia+$scope.ordencertificado+$scope.ordencustodia+$scope.ordenterminado+$scope.ordenproceso;
    $scope.porcentajegarantia = ($scope.ordengarantia*100)/totalOrdenes;
    $scope.porcentajecertificado = ($scope.ordencertificado*100)/totalOrdenes;
    $scope.porcentajecustodia = ($scope.ordencustodia*100)/totalOrdenes;
    $scope.porcentajeterminado = ($scope.ordenterminado*100)/totalOrdenes;
    $scope.porcentajeproceso = ($scope.ordenproceso*100)/totalOrdenes;
        } 

            //Muestra el historico de ordenes en Proceso
    $scope.ordenProceso = function () {
            $scope.tipoOrden = 4;
   				reporteOrdenRepository.getHistorialOrden(5,$scope.userData.idUsuario,$scope.idZona,$scope.idTar).then(function (ordenproces) {
   				$('.dataTableProceso').DataTable().destroy();
                $scope.proceso = ordenproces.data;
                waitDrawDocument("dataTableProceso");
                if (ordenproces.data.length > 0) {
                    alertFactory.success('Exito al obtener ordenes en proceso');
                } else {
                    alertFactory.info('No se encontraron ordenes en proceso');
                }
            }, function (error) {
                alertFactory.error('Error al obtener los datos');
            });
        }
        //Muestra el historico de ordenes Terminadas
    $scope.ordenTerminada = function () {
            $scope.tipoOrden = 3;
                reporteOrdenRepository.getHistorialOrden(7,$scope.userData.idUsuario,$scope.idZona,$scope.idTar).then(function (ordentermina) {
                $('.dataTableTerminada').DataTable().destroy();
                $scope.terminada = ordentermina.data;
                waitDrawDocument("dataTableTerminada");
                if (ordentermina.data.length > 0) {
                    alertFactory.success('Exito al obtener ordenes terminadas');
                } else {
                    alertFactory.info('No se encontraron ordenes terminadas');
                }
            }, function (error) {
                alertFactory.error('Error al obtener los datos');
            });
        }
        //Muestra el historico de ordenes Transferencia Custodia
    $scope.ordenCustodia = function () {
        $scope.tipoOrden = 2;
            reporteOrdenRepository.getHistorialOrden(14,$scope.userData.idUsuario,$scope.idZona,$scope.idTar).then(function (ordencustodia) {
            	$('.dataTableCustodia').DataTable().destroy();
                $scope.custodia = ordencustodia.data;
                waitDrawDocument("dataTableCustodia");
                if (ordencustodia.data.length > 0) {
                    alertFactory.success('Exito al obtener transferencia de custodia');
                } else {
                    alertFactory.info('No se encontraron transferencia de custodia');
                }
            }, function (error) {
                alertFactory.error('Error al obtener los datos');
            });
    }
            //Muestra el historico de ordenes certificado Conformidad
    $scope.ordenCertificado = function () {
            $scope.tipoOrden = 1;
                reporteOrdenRepository.getHistorialOrden(19,$scope.userData.idUsuario,$scope.idZona,$scope.idTar).then(function (ordenconformidad) {
                $('.dataTableCertificado').DataTable().destroy();
                $scope.conformidad = ordenconformidad.data;
                waitDrawDocument("dataTableCertificado");
                if (ordenconformidad.data.length > 0) {
                    alertFactory.success('Exito al obtener certificado de conformidad');
                } else {
                    alertFactory.info('No se encontraron certificado de conformidad');
                }
            }, function (error) {
                alertFactory.error('Error al obtener los datos');
            });
        }
        
                //Muestra el historico de ordnes en garantia
    $scope.ordenGarantia = function () {
        $scope.tipoOrden = 0;
            reporteOrdenRepository.getHistorialOrden(23,$scope.userData.idUsuario,$scope.idZona,$scope.idTar).then(function (ordengarantia) {
            	$('.dataTableGarantia').DataTable().destroy();
                $scope.garantia = ordengarantia.data;
                waitDrawDocument("dataTableGarantia");
                if (ordengarantia.data.length > 0) {
                    alertFactory.success('Exito al obtener ordenes en garantia');
                } else {
                    alertFactory.info('No se encontraron ordenes en garantia');
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
        $scope.tipoOrden = urlObj.tipoOrden;
        $scope.idTar = urlObj.idTar;
        $scope.idZona = urlObj.idZona;
        urlObj.idTar == 'null' ? $scope.idTar = 0 : $scope.idTar = urlObj.idTar; 
        urlObj.idZona == 'null' ? $scope.idZona = 0 : $scope.idZona = urlObj.idZona;
        if(url==''){
        $scope.idTar = 0;
        $scope.idZona = 0;
        }
        if($scope.tipoOrden==0){
      		$scope.ordenGarantia();
                 $scope.getNumeroOrdenes();
        }else if($scope.tipoOrden==1){
            $scope.ordenCertificado();
                 $scope.getNumeroOrdenes();	
        }else if($scope.tipoOrden==2){
            $scope.ordenCustodia();		
                 $scope.getNumeroOrdenes();
        }else if($scope.tipoOrden==3){
            $scope.ordenTerminada();
                 $scope.getNumeroOrdenes();
        }else if($scope.tipoOrden==4){
            $scope.ordenProceso();
                 $scope.getNumeroOrdenes();
                      $scope.getNumeroOrdenes();
        }else{
        	$scope.ordenProceso();
                 $scope.getNumeroOrdenes();
        }
    }

        //espera que el documento se pinte para llenar el dataTable
    var waitDrawDocument = function (dataTable) {
        setTimeout(function () {
            
            var indicePorOrdenar = 0;
           if (dataTable == 'dataTableGarantia') {
                indicePorOrdenar = 12;
            } else if (dataTable == 'dataTableCertificado') {
                indicePorOrdenar = 12;
            } else if (dataTable == 'dataTableCustodia') {
                indicePorOrdenar = 12;
            } 

            else if (dataTable == 'dataTableTerminada') {
                indicePorOrdenar = 12;
            }
                else if (dataTable == 'dataTableProceso') {
                indicePorOrdenar = 13;
            }
            else {
                indicePorOrdenar = 11;
            }


            $('.' + dataTable).DataTable({
                order: [[indicePorOrdenar, 'desc']],
                dom: '<"html5buttons"B>lTfgitp',
                "iDisplayLength": 100,
                buttons: [
                    {
                        extend: 'excel',
                        title: 'OrdenesRegistradas'
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