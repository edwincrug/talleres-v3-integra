var citaUrl = global_settings.urlCORS + '/api/cita/';

registrationModule.factory('citaRepository', function ($http, $q) {
    var deferred = $q.defer();

    return {
        getCliente: function (idUsuario) {
            return $http({
                url: citaUrl + 'cliente/',
                method: "GET",
                params: {
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        },
        getUnidadInformation: function (datoUnidad, idUsuario) {
            return $http({
                url: citaUrl + 'unidad/',
                method: "GET",
                params: {
                    datoUnidad: datoUnidad,
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getCita: function (idUnidad, idUsuario) {
            return $http({
                url: citaUrl + 'cita/',
                method: "GET",
                params: {
                    idUnidad: idUnidad,
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getTaller: function (datoTaller, idUsuario) {
            return $http({
                url: citaUrl + 'taller/',
                method: "GET",
                params: {
                    datoTaller: datoTaller,
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getPaquete: function (idTrabajo) {
            return $http({
                url: citaUrl + 'paquete/',
                method: "GET",
                params: {
                    datoTaller: idTrabajo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        enviarMailConfirmacion: function (idCita, tipoCorreo) {
            return $http({
                url: citaUrl + 'enviaremailcita/',
                method: "GET",
                params: {
                    idCita: idCita,
                    tipoCorreo: tipoCorreo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getCitaTaller: function (fecha, idCita, idUsuario) {
            return $http({
                url: citaUrl + 'buscaCita/',
                method: "GET",
                params: {
                    fecha: fecha,
                    idCita: idCita,
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        addCita: function (taller) {
            return $http({
                url: citaUrl + 'addcita/',
                method: "POST",
                data: taller,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        addCitaServicioDetalle: function (item) {
            return $http({
                url: citaUrl + 'addcitaserviciodetalle/',
                method: "POST",
                data: item,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        validaConfirmacionCita: function (idCita) {
            return $http({
                url: citaUrl + 'validaconfirmacioncita/',
                method: "GET",
                params: {
                    idCita: idCita
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getTrabajo: function (idCita) {
            return $http({
                url: citaUrl + 'trabajo/',
                method: "GET",
                params: {
                    idCita: idCita
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getTipoCita: function () {
            return $http({
                url: citaUrl + 'tipocita/',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        updateCita: function (taller) {
            return $http({
                url: citaUrl + 'updateCita',
                method: "POST",
                data: taller,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getidCita: function (idCita) {
            return $http({
                url: citaUrl + 'citamodificar',
                method: "GET",
                params: {
                    idCita: idCita
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        dropCita: function (idCita) {
            var msgObj = {
                idCita: idCita
            }
            return $http({
                url: citaUrl + 'BorraCita',
                method: "POST",
                data: msgObj,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        busquedaServicioDetalle: function (idCita) {
            return $http({
                url: searchUrl + 'servicioDetalle',
                method: "GET",
                params: {
                    idCita: idCita
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        addCitaDetalle: function (item) {
            return $http({
                url: citaUrl + 'agregacitaServiciodetalle/',
                method: "POST",
                data: item,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getEstadoAutotanque: function () {
            return $http({
                url: citaUrl + 'estadoAutotanque',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getTrasladoUnidad: function () {
            return $http({
                url: citaUrl + 'trasladoUnidad',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getPreOrden: function (idCita) {
            return $http({
                url: citaUrl + 'preOrden/',
                method: "GET",
                params: {
                    idCita: idCita
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        eliminaPreCotizacion: function (idCita, idCotizacion) {
            var objPreCotizacion = {
                idCita: idCita,
                idCotizacion: idCotizacion
            }
            return $http({
                url: citaUrl + 'eliminaPreCotizacion',
                method: "POST",
                data: objPreCotizacion,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        enviaAprobacion: function (idCita) {
            var aprobacionObj = {
                idCita: idCita
            }
            return $http({
                url: citaUrl + 'enviaAprobacion',
                method: "POST",
                data: aprobacionObj,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getDatosCita: function (idCita) {
            return $http({
                url: citaUrl + 'datosCita',
                method: "GET",
                params: {
                    idCita: idCita
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});