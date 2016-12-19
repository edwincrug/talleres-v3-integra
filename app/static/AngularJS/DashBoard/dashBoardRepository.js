var tableroUrl = global_settings.urlCORS + '/api/dashboard/';

registrationModule.factory('dashBoardRepository', function ($http) {
    return {
        getTotalCitas: function (idTar, idUsuario, idZona) {
            return $http({
                url: tableroUrl + 'sumatoriaCitas/',
                method: "GET",
                params: {
                    idTar: idTar,
                    idUsuario: idUsuario,
                    idZona: idZona
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getTotalCotizaciones: function (idZona,idTar,idUsuario) {
            return $http({
                url: tableroUrl + 'sumatoriaCotizaciones/',
                method: "GET",
                params: {
                    idZona:idZona,
                    idTar: idTar,
                    idUsuario:idUsuario
                   },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getZonas: function (idUsuario) {
            return $http({
                url: tableroUrl + 'zonas/',
                method: "GET",
                params: {
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getTars: function (idZona, idUsuario) {
            return $http({
                url: tableroUrl + 'tars',
                method: "GET",
                params: {
                    idZona: idZona,
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getTotalOrdenes: function (idZona,idTar,idUsuario) {
            return $http({
                url: tableroUrl + 'sumatoriaOrdenes',
                method: "GET",
                params: {
                    idZona:idZona,
                    idTar: idTar,
                    idUsuario:idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getTotalOrdenesPorCobrar: function (idZona,idTar,idUsuario) {
            return $http({
                url: tableroUrl + 'sumatoriaOrdenesPorCobrar',
                method: "GET",
                params: {
                    idZona:idZona,
                    idTar: idTar,
                    idUsuario:idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});