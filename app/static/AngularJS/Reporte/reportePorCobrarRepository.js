var reportePorCobrarUrl = global_settings.urlCORS + '/api/dashboard/';

registrationModule.factory('reportePorCobrarRepository', function ($http) {
    return {        
        getNumPorCobrar: function (idZona,idTar,idUsuario) {
            return $http({
                url: reportePorCobrarUrl + 'sumatoriaOrdenesPorCobrar/',
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
        getHistorialPorCobrar: function (idEstatus,idUsuario,idZona,idTar) {
            return $http({
                url: reportePorCobrarUrl + 'porCobrarHistorial/',
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