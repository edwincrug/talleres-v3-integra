var reporteUtilidadUrl = global_settings.urlCORS + '/api/reporte/';

registrationModule.factory('reporteUtilidadRepository', function ($http) {
    return {        
        getUtilidad: function (fechaInicio, fechaFin, fechaMes, rangoInicial, rangoFinal, zona, tar, idTipoCita, estatus, numeroTrabajo, bandera) {
            return $http({
                url: reporteUtilidadUrl + 'reporteUtilidad/',
                method: "GET",
                params: {
                    fechaInicio:fechaInicio,
                    fechaFin:fechaFin,
                    fechaMes:fechaMes,
                    rangoInicial:rangoInicial,
                    rangoFinal:rangoFinal,
                    zona:zona,
                    tar:tar,
                    idTipoCita:idTipoCita,
                    estatus:estatus,
                    numeroTrabajo:numeroTrabajo,
                    bandera:bandera
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});