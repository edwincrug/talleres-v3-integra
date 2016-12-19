var reporteOrdenUrl = global_settings.urlCORS + '/api/dashboard/';

registrationModule.factory('reporteOrdenRepository', function ($http) {
    return {        
        getNumOrdenes: function (idZona,idTar,idUsuario) {
            return $http({
                url: reporteOrdenUrl + 'sumatoriaOrdenes/',
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
        getHistorialOrden: function (idEstatus,idUsuario,idZona,idTar) {
            return $http({
                url: reporteCitaUrl + 'ordenesHistorial/',
                method: "GET",
                params: {
                    idEstatus: idEstatus,
                    idUsuario:idUsuario,
                    idZona:idZona,
                    idTar:idTar
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

    };
});