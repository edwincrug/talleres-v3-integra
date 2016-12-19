var reporteCitaUrl = global_settings.urlCORS + '/api/dashboard/';

registrationModule.factory('reporteCitaRepository', function ($http) {
    return {        
        getNumCita: function (idTar,idZona,idUsuario) {
            return $http({
                url: reporteCitaUrl + 'sumatoriaCitas/',
                method: "GET",
                params: {
                    idTar:idTar,
                    idZona: idZona,
                    idUsuario:idUsuario
                    
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getHistorialCita: function (idEstatus,idTaller,idUsuario,idZona,idTar) {
            return $http({
                url: reporteCitaUrl + 'citasHistorial/',
                method: "GET",
                params: {
                    idEstatus: idEstatus,
                    idTaller:idTaller,
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