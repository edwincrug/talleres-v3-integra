var searchUrl = global_settings.urlCORS + '/api/cotizacion/';

registrationModule.factory('cotizacionEvidenciasRepository', function ($http) {
    return {
        getEvidenciasByCotizacion: function (idCotizacion, idTipoUsuario, idTrabajo) {
            return $http({
                url: searchUrl + 'evidenciasByCotizacion',
                method: "GET",
                params: {
                    idCotizacion: idCotizacion,
                    idTipoUsuario: idTipoUsuario,
                    idTrabajo: idTrabajo
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        }
    };
});