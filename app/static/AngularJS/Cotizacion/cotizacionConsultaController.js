// -- =============================================
// -- Author:      Uriel Godínez Martínez
// -- Create date: 28/03/2016
// -- Description: Cotizacion Controller
// -- Modificó: 
// -- Fecha: 
// -- =============================================
registrationModule.controller('cotizacionConsultaController', function ($scope, $rootScope, localStorageService, alertFactory, globalFactory, cotizacionConsultaRepository) {

    $scope.message = "Buscando...";
    $scope.userData = localStorageService.get('userData');
    $scope.userData.idTipoUsuario != 4 ? $scope.vistaPrecio = 1 : $scope.vistaPrecio = 2;
    $scope.datosCita = {
            idCita: ''
        }

    $scope.init = function () {
        $scope.Maestro();
    }

    //Obtiene el detalle de una cotización
    $scope.Detalle = function (idCotizacion, idTaller, idUsuario) {
        $scope.sumaIvaTotal = 0;
        $scope.sumaPrecioTotal = 0;
        $scope.sumaGranTotal = 0;
        $scope.sumaIvaTotalCliente = 0;
        $scope.sumaPrecioTotalCliente = 0;
        $scope.sumaGranTotalCliente = 0;
       // $rootScope.idUsuario;
       localStorageService.set('usuario', idUsuario);

        cotizacionConsultaRepository.getDetail(idCotizacion, idTaller, idUsuario).then(function (result) {
            if (result.data.length > 0) {
                $scope.total = 0;
                $scope.articulos = [];
                var preArticulos = [];
                
                $scope.articulos = Enumerable.From(result.data).Distinct(function (x) {
                    return x.idItem
                }).ToArray();
                
                for (var i = 0; i < $scope.articulos.length; i++) {
                    
                    //Precios (Admin, Callcenter, Taller)
                    $scope.sumaIvaTotal += ($scope.articulos[i].cantidad * $scope.articulos[i].precio) * ($scope.articulos[i].valorIva / 100);
                    
                    $scope.sumaPrecioTotal += ($scope.articulos[i].cantidad * $scope.articulos[i].precio);
                    
                    
                    //Precios Cliente
                    $scope.sumaIvaTotalCliente += ($scope.articulos[i].cantidad * $scope.articulos[i].precioCliente) * ($scope.articulos[i].valorIva / 100);
                    
                    $scope.sumaPrecioTotalCliente += ($scope.articulos[i].cantidad * $scope.articulos[i].precioCliente);
                }
                //Total (Admin, Callcenter, Taller)
                $scope.sumaGranTotal = ($scope.sumaPrecioTotal + $scope.sumaIvaTotal);
                
                //Total Cliente
                $scope.sumaGranTotalCliente = ($scope.sumaPrecioTotalCliente + $scope.sumaIvaTotalCliente);

                $('#cotizacionDetalle').appendTo('body').modal('show');
                alertFactory.success('Datos cargados.');
            } else {
                alertFactory.info('No se pudo obtener el detalle de esta cotización.');
            }
        }, function (error) {
            alertFactory.info('No se pudo obtener el detalle de esta cotización.');
        });

    }

    //Obtiene las cotizaciones pendientes por autorizar
    $scope.Maestro = function () {
         $('.dataTableCotizaciones').DataTable().destroy();
        $scope.promise =
            cotizacionConsultaRepository.get($scope.userData.idUsuario).then(function (result) {
                    if (result.data.length > 0) {
                        $scope.cotizaciones = result.data;
                        globalFactory.waitDrawDocument("dataTableCotizaciones", "OrdenporCobrar");
                    } else {
                        alertFactory.info('No se encontraron cotizaciones.');
                    }
                },
                function (error) {
                    alertFactory.error('No se encontraron cotizaciones, inténtelo más tarde.');
                });
    }

    
    //Redirige los parametros de la cotización para su aprobación
    $scope.Autorizacion = function (idCita1, idCotizacion1, idUnidad1, numeroCotizacion, idTrabajo1, taller1, idCliente1) {
        localStorageService.set('cita', idCita1);
        localStorageService.set('cotizacion', idCotizacion1);
        localStorageService.set('unidad', idUnidad1);
        localStorageService.set('estado', 1);
        localStorageService.set('desc', numeroCotizacion)
        localStorageService.set('work', idTrabajo1);
        localStorageService.set('taller', taller1);
        localStorageService.set('citaMsg', idCita1);
        localStorageService.set('idCliente1', idCliente1);
        $scope.datosCita.idCita = idCita1;
        localStorageService.set('citaRefacciones', $scope.datosCita);
        location.href = '/cotizacionautorizacion';
    }

    $scope.Nueva = function () {
        location.href = "/cotizacionnueva";
    }
   //Cancelamnos la orden cambiamos el estatus de trabajo a orden cancelada
        $scope.cancelarOrden = function (idTrabajo,idCotizacion) {
       cotizacionConsultaRepository.cancelaOrden(idTrabajo,idCotizacion).then(function (result) {
            if (result.data.length > 0) {
                $scope.ordenCancelada = result.data;
                alertFactory.success('Orden Cancelada Correctamente');
            }
        }, function (error) {
            alertFactory.error('No se pudo resolver la cancelación');
        });
    }
    //Abre la modal para la cancelación de la orden
    $scope.cancelarAprobacion = function (idTrabajo,idCotizacion) {
        $('.btnTerminarTrabajo').ready(function () {
            swal({
                    title: "¿Esta seguro que desea cancelar la cotización?",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#65BD10",
                    confirmButtonText: "Si",
                    cancelButtonText: "No",
                    closeOnConfirm: false,
                    closeOnCancel: false
                },
                function (isConfirm) {
                    if (isConfirm) {
                        $scope.cancelarOrden(idTrabajo,idCotizacion);
                        swal("Trabajo terminado!", "La órden se ha cancelado");
                        location.href = '/cotizacionconsulta';
                    } else {
                        swal("No cancelada");
                    }
                });
        });
    }

});

 