// -- =============================================
// -- Author:      Carlos Adolfo Martinez Diosdado
// -- Create date: 30/08/2016
// -- Description: Reporte Utilidad controller
// -- =============================================

registrationModule.controller('reporteUtilidadController', function ($scope, alertFactory, $rootScope, localStorageService, reporteUtilidadRepository, dashBoardRepository) {
    $scope.zona = null;
    $scope.tar = null;
    $scope.estatus = '';
    $scope.fechaInicio = null;
    $scope.fechaFin = null;
    $scope.fechaMes = null;
    $scope.sumatoriaCosto = 0.00;
    $scope.sumatoriaPrecio = 0.00;
    $scope.sumatoriaUtilidad = 0.00;
    $scope.userData = localStorageService.get('userData');

    //Inicializa la pagina
    $scope.initUtilidad = function () {
       // $scope.limpiaCampos();
        $scope.devuelveZonas();
        $scope.devuelveTars();
       // $scope.getMargenUtilidad($scope.fechaInicio,$scope.fechaFin,$scope.fechaMes,$scope.rangoInicial,$scope.rangoFinal,$scope.zona,$scope.tar,$scope.idTipoCita,$scope.estatus,$scope.numeroTrabajo, 1);
    }

    //Limpia los campos de la pantalla de reporte de utilidad
  /*  $scope.limpiaCampos = function () {
        $scope.fechaInicio = '';
        $scope.fechaFin = '';
        $scope.mes = '';
        $scope.rangoInicial = '';
        $scope.rangoFinal = '';
        $scope.zona = '';
        $scope.tar = '';
        $scope.idTipoCita = '';
        $scope.estatus = '';
        $scope.numeroTrabajo = '';
        $scope.bandera = '';
    }*/

    $scope.fechaRango = function () {
        $scope.fechaMes = null;
    }

    $scope.fechaMess = function () {
        $scope.fechaInicio = null;
        $scope.fechaFin = null;
    }

    //obtiene los scope necesarios para el reporte de utilidad 
    $scope.buscaFiltros = function () {
        $scope.bandera = 1;
        $scope.fechaInicio == '' ? $scope.fechaInicio = null : $scope.fechaInicio;
        $scope.fechaFin == '' ? $scope.fechaFin = null : $scope.fechaFin;
        $scope.fechaMes == '' ? $scope.fechaMes = null : $scope.fechaMes;
        $scope.rangoInicial = $('#rangoi').val();
        $scope.rangoFinal = $('#rangof').val();
        $scope.rangoInicial == '' ? $scope.rangoInicial = null : $scope.rangoInicial;
        $scope.rangoFinal == '' ? $scope.rangoFinal = null : $scope.rangoFinal;
        $scope.zona;
        $scope.tar;
        $scope.idTipoCita == '' ? $scope.idTipoCita = null : $scope.idTipoCita;
        $scope.estatus == '' ? $scope.bandera = 1 : $scope.bandera = 2;
        $scope.numeroTrabajo;
        $scope.getMargenUtilidad($scope.fechaInicio,$scope.fechaFin,$scope.fechaMes,$scope.rangoInicial,$scope.rangoFinal,$scope.zona,$scope.tar,$scope.idTipoCita,$scope.estatus,$scope.numeroTrabajo, $scope.bandera);
    }

    //obtiene los scope necesarios para el reporte de utilidad 
    $scope.buscaOrden = function () {
        $scope.bandera = 3;
        $scope.fechaInicio == '' ? $scope.fechaInicio = null : $scope.fechaInicio;
        $scope.fechaFin == '' ? $scope.fechaFin = null : $scope.fechaFin;
        $scope.fechaMes == '' ? $scope.fechaMes = null : $scope.fechaMes;
        $scope.rangoInicial = $('#rangoi').val();
        $scope.rangoFinal = $('#rangof').val();
        $scope.rangoInicial == '' ? $scope.rangoInicial = null : $scope.rangoInicial;
        $scope.rangoFinal == '' ? $scope.rangoFinal = null : $scope.rangoFinal;
        $scope.zona;
        $scope.tar;
        $scope.idTipoCita == '' ? $scope.idTipoCita = null : $scope.idTipoCita;
       // $scope.estatus == '' ? $scope.estatus == null : $scope.estatus;
        $scope.numeroTrabajo;
        $scope.getMargenUtilidad($scope.fechaInicio,$scope.fechaFin,$scope.fechaMes,$scope.rangoInicial,$scope.rangoFinal,$scope.zona,$scope.tar,$scope.idTipoCita,$scope.estatus,$scope.numeroTrabajo, $scope.bandera);
    }

    //obtiene el resultado de reporte de utilidad 
    $scope.getMargenUtilidad = function (fechaInicio,fechaFin,fechaMes,rangoInicial,rangoFinal,zona,tar,idTipoCita,estatus,numeroTrabajo,bandera) {
        $('.dataTableUtilidad').DataTable().destroy();
        if(fechaMes != '' && fechaMes != null && fechaMes != undefined){
            var fechaPartida = fechaMes.split('-');
            if(fechaPartida[0] == 'Enero'){
                fechaMes = '01/01/' + fechaPartida[1];
            }
            else if(fechaPartida[0] == 'Febrero'){
                fechaMes = '02/01/' + fechaPartida[1];
            }
            else if(fechaPartida[0] == 'Marzo'){
                fechaMes = '03/01/' + fechaPartida[1];
            }
            else if(fechaPartida[0] == 'Abril'){
                fechaMes = '04/01/' + fechaPartida[1];
            }
            else if(fechaPartida[0] == 'Mayo'){
                fechaMes = '05/01/' + fechaPartida[1];
            }
            else if(fechaPartida[0] == 'Junio'){
                fechaMes = '06/01/' + fechaPartida[1];
            }
            else if(fechaPartida[0] == 'Julio'){
                fechaMes = '07/01/' + fechaPartida[1];
            }
            else if(fechaPartida[0] == 'Agosto'){
                fechaMes = '08/01/' + fechaPartida[1];
            }
            else if(fechaPartida[0] == 'Septiembre'){
                fechaMes = '09/01/' + fechaPartida[1];
            }
            else if(fechaPartida[0] == 'Octubre'){
                fechaMes = '10/01/' + fechaPartida[1];
            }
            else if(fechaPartida[0] == 'Noviembre'){
                fechaMes = '11/01/' + fechaPartida[1];
            }
            else if(fechaPartida[0] == 'Diciembre'){
                fechaMes = '12/01/' + fechaPartida[1];
            }
        }

        reporteUtilidadRepository.getUtilidad(fechaInicio,fechaFin,fechaMes,rangoInicial,rangoFinal,zona,tar,idTipoCita,estatus,numeroTrabajo,bandera).then(function (utilidad) { 
           $scope.sumatoriaCosto = 0.00;
            $scope.sumatoriaPrecio = 0.00;
            $scope.sumatoriaUtilidad = 0.00;
            if (utilidad.data.length > 0) {
                $scope.margenUtilidad = utilidad.data;
            
                 for(var i=0;i<utilidad.data.length;i++){
                    $scope.sumatoriaCosto += parseFloat(utilidad.data[i].costoOrden);
                    $scope.sumatoriaPrecio += parseFloat(utilidad.data[i].precioOrden);
                    $scope.sumatoriaUtilidad += parseFloat(utilidad.data[i].utilidad);
                };
                alertFactory.success('Datos encontrados');
                waitDrawDocument("dataTableUtilidad");
            } else {
                alertFactory.info('No se encontraron datos');
            }
        }, function (error) {
            alertFactory.error('Error al obtener los datos');
        });
    }

    //fecha
    $('#fecha .input-group.date').datepicker({
        todayBtn: "linked",
        keyboardNavigation: true,
        forceParse: false,
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true
            //startDate: new Date()
    });
    //Fecha del mes
    $('#fechaMes .input-group.date').datepicker({
        minViewMode: 1,
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true,
        todayHighlight: true,
        format: 'MM-yyyy'
    });
    //Rango de datos
    $('#data_5 .input-daterange').datepicker({
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true
    });
    //Rango de Porcentaje
    $(".touchspin2").TouchSpin({
        min: -1000,
        max: 1000,
        step: 0.1,
        decimals: 2,
        //boostat: 5,
        //maxboostedstep: 10,
        //postfix: '%',
        buttondown_class: 'btn btn-white',
        buttonup_class: 'btn btn-white'
    });

    //espera que el documento se pinte para llenar el dataTable
   /* var waitDrawDocument = function (dataTable) {
        setTimeout(function () {
            $('.' + dataTable).DataTable({
                dom: '<"html5buttons"B>lTfgitp',
                buttons: [
                    {
                        extend: 'excel',
                        title: 'MargenUtilidad'
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
    }*/
    //Devuelve todas las zonas correspondientes
    $scope.devuelveZonas = function () {
        dashBoardRepository.getZonas($scope.userData.idUsuario).then(function (zonas) {
            if (zonas.data.length > 0) {
                $scope.zonas = zonas.data;

            }
        }, function (error) {
            alertFactory.error('No se pudo recuperar información de las zonas');
        });
    }
    //Devuelve todas las tars de su zona correspondiente
    $scope.devuelveTars = function () {
            if ($scope.zona != null) {
                dashBoardRepository.getTars($scope.zona).then(function (tars) {
                    if (tars.data.length > 0) {
                        $scope.tars = tars.data;

                    }
                }, function (error) {
                    alertFactory.error('No se pudo recuperar información de las TARs');
                });
            } else {
                $scope.tar = null;
            }
        }
            //espera que el documento se pinte para llenar el dataTable
            var waitDrawDocument = function (dataTable) {
                setTimeout(function () {
                    var indicePorOrdenar = 0;
                    if (dataTable == 'dataTableUtilidad') {
                        indicePorOrdenar = 11;
                    }

                    $('.' + dataTable).DataTable({
                        order: [[indicePorOrdenar, 'desc']],
                        dom: '<"html5buttons"B>lTfgitp',
                        "iDisplayLength": 100,
                        buttons: [
                            {
                                extend: 'excel',
                                title: 'MargenUtilidad'
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