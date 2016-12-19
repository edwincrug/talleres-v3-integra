var reporteCotizacionUrl = global_settings.urlCORS + '/api/dashboard/';

registrationModule.factory('reporteCotizacionRepository', function ($http) {
    return { 
        getNumCotizacion: function (idZona,idTar,idUsuario) {
            return $http({
                url: reporteCotizacionUrl + 'sumatoriaCotizaciones/',
                method: "GET",
                params: {
                    idZona: idZona,
                    idTar:idTar,
                    idUsuario:idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getHistorialCotizacion: function (idZona,idTar,idEstatus,idUsuario) {
            return $http({
                url: reporteCotizacionUrl + 'cotizacionesHistorial/',
                method: "GET",
                params: {
                    idZona:idZona,
                    idTar:idTar,
                    idEstatus: idEstatus,
                    idUsuario:idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }       

    };
});