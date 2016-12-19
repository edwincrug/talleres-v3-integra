// -- =============================================
// -- Author:      V. Vladimir Juárez Juárez
// -- Create date: 25/08/2016
// -- Description: repositorio para los anticipos de las órdenes
// -- Modificó: 
// -- Fecha: 
// -- =============================================
var ordenAnticipoUrl = global_settings.urlCORS + '/api/ordenanticipo/';

registrationModule.factory('ordenAnticipoRepository', function ($http) {

    return {
        getOrdenesAnticipoPendiente: function () {
            return $http({
                url: ordenAnticipoUrl + 'ordenanticipopendiente/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        },
        getOrdenesAnticipoAplicado: function () {
            return $http({
                url: ordenAnticipoUrl + 'ordenanticipoaplicado/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        },
        putAnticipo: function (idCotizacion) {
            return $http({
                url: ordenAnticipoUrl + 'registraAnticipo',
                method: "POST",
                data: {idCotizacion: idCotizacion},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getCotizacionesOrden: function (idTrabajo) {
            return $http({
                url: ordenAnticipoUrl + 'cotizacionesorden/',
                method: "GET",
                params: {
                    idTrabajo : idTrabajo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }
    };
});