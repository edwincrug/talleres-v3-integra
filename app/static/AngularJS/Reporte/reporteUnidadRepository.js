var reporteUnidadUrl = global_settings.urlCORS + '/api/reporte/';

registrationModule.factory('reporteUnidadRepository', function ($http) {
    return {        
        getCitasUnidad: function (numeroEconomico) {
            return $http({
                url: reporteUnidadUrl + 'citasunidad/',
                method: "GET",
                params: {
                    numeroEconomico: numeroEconomico
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getCotizacionesUnidad: function (numeroEconomico) {
            return $http({
                url: reporteUnidadUrl + 'cotizacionesunidad/',
                method: "GET",
                params: {
                    numeroEconomico: numeroEconomico
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getOrdenesUnidad: function (numeroEconomico) {
            return $http({
                url: reporteUnidadUrl + 'ordenesunidad/',
                method: "GET",
                params: {
                    numeroEconomico: numeroEconomico
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});