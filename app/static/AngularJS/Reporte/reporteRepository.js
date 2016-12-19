var reporteGralUrl = global_settings.urlCORS + '/api/reporte/';

registrationModule.factory('reporteRepository', function ($http) {
    return {        
        reporteGral: function () {
            return $http({
                url: reporteGralUrl + 'reportegral',
                method: "GET"
            });
        },
    };
});