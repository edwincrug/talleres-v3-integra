var searchUrl = global_settings.urlCORS + '/api/cotizacion/';
var ruta = global_settings.uploadPath;
//var ruta = 'C:/Users/Mario/Documents/FileUpload';

registrationModule.factory('cotizacionRepository', function ($http) {
    return {
        buscarPieza: function (idTaller, nombrePieza, refaccion, idUsuario, idCliente) {
            return $http({
                url: searchUrl + 'buscarPieza',
                method: "GET",
                params: {
                    idTaller: idTaller,
                    nombrePieza: nombrePieza,
                    refaccion:refaccion,
                    idUsuario:idUsuario,
                    idCliente:idCliente
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        insertCotizacionMaestro: function (idCita, idUsuario, observaciones, idUnidad, idTipoCotizacion, idTaller, idEstatus) {
            var msgObj = {
                idCita: idCita,
                idUsuario: idUsuario,
                observaciones: observaciones,
                idUnidad: idUnidad,
                idTipoCotizacion: idTipoCotizacion,
                idTaller: idTaller,
                idEstatus: idEstatus
            }
            return $http({
                url: searchUrl + 'cotizacionMaestro',
                method: "POST",
                data: msgObj,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        insertCotizacionDetalle: function (idCotizacion, idTipoElemento, idElemento, precio, cantidad, idEstatus, idNivelAutorizacion, idUsuario) {
            var msgObj = {
                idCotizacion: idCotizacion,
                idTipoElemento: idTipoElemento,
                idElemento: idElemento,
                precio: precio,
                cantidad: cantidad,
                idNivelAutorizacion: idNivelAutorizacion,
                idEstatus: idEstatus,
                idUsuario:idUsuario
            }
            return $http({
                url: searchUrl + 'cotizacionDetalle',
                method: "POST",
                data: msgObj,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        insertEvidencia: function (idTipoEvidencia, idTipoArchivo, idUsuario, idProcesoEvidencia, nombreArchivo, idCategoria, idNombreEspecial) {
            var msgObj = {
                idTipoEvidencia: idTipoEvidencia,
                idTipoArchivo: idTipoArchivo,
                idUsuario: idUsuario,
                idProcesoEvidencia: idProcesoEvidencia,
                nombreArchivo: nombreArchivo,
                idCategoria: idCategoria,
                idNombreEspecial: idNombreEspecial
            }
            return $http({
                url: searchUrl + 'evidencia',
                method: "POST",
                data: msgObj,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        editarCotizacion: function (idCotizacion, idTaller, idUsuario) {
            return $http({
                url: searchUrl + 'detail',
                method: "GET",
                params: {
                    idCotizacion: idCotizacion,
                    idTaller: idTaller,
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        updateCotizacion: function (idCotizacion, idTipoElemento, idElemento, precio, cantidad, observaciones, idEstatus, idTaller, idTipoCotizacion) {
            var msgObj = {
                idCotizacion: idCotizacion,
                idTipoElemento: idTipoElemento,
                idElemento: idElemento,
                precio: precio,
                cantidad: cantidad,
                observaciones: observaciones,
                idEstatus: idEstatus,
                idTaller : idTaller,
                idTipoCotizacion : idTipoCotizacion
            }
            return $http({
                url: searchUrl + 'updateCotizacion',
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
        datosUnidad: function (idCotizacion, idTrabajo) {
            var msgObj = {
                idCotizacion: idCotizacion,
                idTrabajo: idTrabajo
            }
            return $http({
                url: searchUrl + 'datosUnidad',
                method: "GET",
                params: msgObj,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        obtieneNombreArchivo: function (idTrabajo) {
            return $http({
                url: searchUrl + 'namefileserver',
                method: "GET",
                params: {
                    idTrabajo: idTrabajo
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        obtieneTipoCotizaciones: function () {
            return $http({
                url: searchUrl + 'tipoCotizaciones',
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        precioItemCliente: function (idItem) {
            return $http({
                url: searchUrl + 'precioItemCliente',
                method: "GET",
                params: {
                    idItem: idItem
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        obtieneTallerCotizaciones: function (datoTaller, isPreCotizacion, idCita, idUsuario) {
            return $http({
                url: searchUrl + 'tallerCotizacion',
                method: "GET",
                params: {
                    datoTaller: datoTaller,
                    isPrecotizacion: isPreCotizacion,
                    idCita: idCita,
                    idUsuario:idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getDatosTallerByCotizacion: function (idTaller) {
            return $http({
                url: searchUrl + 'datosTallerByCotizacion',
                method: "GET",
                params: {
                    idTaller: idTaller
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getcitaRefaccion: function (idCita) {
            return $http({
                url: searchUrl + 'citabyRefaccion',
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