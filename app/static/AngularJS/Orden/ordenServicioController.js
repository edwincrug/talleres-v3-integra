registrationModule.controller('ordenServicioController', function ($scope, $rootScope, localStorageService, alertFactory, cotizacionAutorizacionRepository, citaRepository, cotizacionRepository, cotizacionMailRepository, ordenServicioRepository, commonService, $location) {

    var cDetalles = [];
    var cPaquetes = [];
    $scope.chat = [];
    $scope.newCotizacion = commonService.idEstatusTrabajo;
    $scope.userData = localStorageService.get('userData');
    $scope.objBotonera = localStorageService.get('botonera');
    $scope.idTrabajoOrden = localStorageService.get('objTrabajo');
    $scope.cita = localStorageService.get('objCita');
    $scope.setInterval = 5000;
    $scope.message = "Obteniendo información ...";
    $scope.descripcion = $scope.idTrabajoOrden.numeroTrabajo;
    var tipoEvidencia = 1; //Trabajo
    $scope.vistaPrecio = 1;
    $scope.userData.idTipoUsuario != 4 ? $scope.vistaPrecio = 1 : $scope.vistaPrecio = 2;
    $scope.onText = 'Taller';
    $scope.offText = 'Cliente';
    $scope.size = 'mini';
    $scope.isSelected = 'yep';
    $scope.inverse = true;
    localStorageService.get('actualizaCosto') != null ? $scope.urlReturn = 1 : $scope.urlReturn = 0;
    if (window.location.href.indexOf('state') > -1) {
        $scope.vistaEditaPrecio = 1;
    } else {
        $scope.vistaEditaPrecio = 0;
    }

    $scope.init = function () {
        $scope.cargaFicha();
        $scope.cargaDatosCliente($scope.objBotonera.idCita);
        $scope.getCotizacionByTrabajo();
        $rootScope.showChat = 1;
        $scope.cargaChat();
        $scope.obtieneNota();
    }

    $scope.cargaChat = function () {
        cotizacionAutorizacionRepository.getChat($scope.idTrabajoOrden.idCita).then(function (result) {
            if (result.data.length > 0) {
                $scope.chat = result.data;
            } else {
                $scope.chat = null;
            }
        }, function (error) {});
    }

    //Obtiene la ficha técnica de la unidad
    $scope.cargaFicha = function () {
        cotizacionAutorizacionRepository.getFichaTecnica($scope.objBotonera.idCita).then(function (result) {
            if (result.data.length > 0) {
                $scope.unidadInfo = result.data[0];
                localStorageService.set('objFicha', $scope.unidadInfo);
            } else {
                alertFactory.info('No se pudo obtener información de la unidad');
            }
        }, function (error) {
            alertFactory.error('No se pudo obtener información de la unidad, inténtelo más tarde');
        });
    }

    $scope.EnviarComentario = function (comentarios) {
        cotizacionAutorizacionRepository.putMessage(3, comentarios, $scope.idTrabajoOrden.idCita).then(function (result) {
                $scope.algo = result.data;
                $scope.cargaChat();
            },
            function (error) {});
    }

    //Obtiene todas las cotizaciones del trabajo
    $scope.getCotizacionByTrabajo = function () {
        $scope.sumaIvaTotal = 0;
        $scope.sumaPrecioTotal = 0;
        $scope.sumaGranTotal = 0;
        $scope.sumaIvaTotalCliente = 0;
        $scope.sumaPrecioTotalCliente = 0;
        $scope.sumaGranTotalCliente = 0;

        cotizacionAutorizacionRepository.getCotizacionByTrabajo($scope.objBotonera.idCita, $scope.userData.idUsuario).then(function (result) {
                if (result.data.length > 0) {
                    $scope.total = 0;
                    $scope.articulos = result.data;
                    for (var i = 0; i < result.data.length; i++) {
                        //Sumatoria Taller
                        $scope.sumaIvaTotal += (result.data[i].cantidad * result.data[i].precio) * (result.data[i].valorIva / 100);

                        $scope.sumaPrecioTotal += (result.data[i].cantidad * result.data[i].precio);


                        //Sumatoria Cliente
                        $scope.sumaIvaTotalCliente += (result.data[i].cantidad * result.data[i].precioCliente) * (result.data[i].valorIva / 100);

                        $scope.sumaPrecioTotalCliente += (result.data[i].cantidad * result.data[i].precioCliente);
                    }
                    //Total Taller
                    $scope.sumaGranTotal = ($scope.sumaPrecioTotal + $scope.sumaIvaTotal);

                    //Total Cliente
                    $scope.sumaGranTotalCliente = ($scope.sumaPrecioTotalCliente + $scope.sumaIvaTotalCliente);
                }
            },
            function (error) {});
    }

    $('#myTabs a').click(function (e) {
        e.preventDefault()
        $(this).tab('show')
    });

    //obtiene los tabajos de la cita
    $scope.lookUpTrabajo = function (idCita) {
        $scope.promise =
            citaRepository.getTrabajo(idCita).then(function (trabajo) {
                if (trabajo.data.length > 0) {
                    $scope.existsTrabajo = true;
                    //$scope.cita = cita;
                    alertFactory.success('Trabajo cargado');
                    //obtiene las cotizaciones(servicios) de la unidad
                    citaRepository.getCotizacion(trabajo.data[0].idTrabajo).then(function (cotizacion) {
                        if (cotizacion.data.length > 0) {
                            citaRepository.getCotizacionDetalle(trabajo.data[0].idTrabajo).then(function (cotizacionDetalle) {
                                citaRepository.getPaquete(trabajo.data[0].idTrabajo).then(function (cotPaquete) {
                                    getCotizacionDetallePaquete(trabajo.data, cotizacion.data, cotizacionDetalle.data, cotPaquete.data);
                                });
                            });
                        } else {
                            alertFactory.info('No se encontraron cotizaciones');
                        }
                    }, function (error) {
                        alertFactory('Error al obtener las cotizaciones');
                    });
                } else {
                    alertFactory.info('No se encontraron datos del trabajo');
                    $scope.trabajo = [];
                    //$scope.cita = [];
                    //$scope.existsTrabajo = false;
                }

            }, function (error) {
                alertFactory.error("Error al obtener datos del trabajo");
            })
    };

    //Obtiene la lista de trabajo/cotizaciones/detalle/paquete por unidad
    var getCotizacionDetallePaquete = function (trabajo, cotizacion, cotizacionDetalle, paquetes) {
        $scope.trabajo = [];

        //crea una propiedad trabajo y agrega los objetos en el array
        trabajo.forEach(function (t) {
            $scope.trabajo.push({
                trabajo: t
            });
            $scope.trabajo[0].trabajo.cotizacion = cotizacion;
            $scope.trabajo[0].trabajo.cotizacion.forEach(function (c, i) {

                //consulta de cotizaciones detalle
                cDetalles = Enumerable.From(cotizacionDetalle)
                    .Where(function (x) {
                        return x.idCotizacion == c.idCotizacion
                    })
                    .Select(function (x) {
                        return x
                    })
                    .ToArray();
                //añade detalles por cotización
                $scope.trabajo[0].trabajo.cotizacion[i].cotizacionDetalle = cDetalles;

                $scope.trabajo[0].trabajo.cotizacion[i].cotizacionDetalle.forEach(function (cd, j) {
                    //consulta de paquetes de cotización detalle
                    cPaquetes = Enumerable.From(paquetes)
                        .Where(function (x) {
                            return x.idCotizacion == c.idCotizacion && cd.idTipoElemento == 1
                        })
                        .Select(function (x) {
                            return x
                        })
                        .ToArray();
                    if (cPaquetes.length > 0) {
                        $scope.trabajo[0].trabajo.cotizacion[i].cotizacionDetalle[j].paquete = cPaquetes;
                    }
                });
            });
        });
    };

    //expande y contrae las filas de las tablas
    $(function () {
        $('body').on('click', '.CX button', function () {
            if ($(this).text() == '+') {
                $(this).text('-');
            } else {
                $(this).text('+');
            }
            $(this).closest('tr')
                .next('tr')
                .toggle();
        });
    });

    $scope.cargaEvidencias = function () {
        cotizacionAutorizacionRepository.getEvidenciasByCotizacion($scope.idTrabajoOrden.idCotizacion).then(function (result) {
            if (result.data.length > 0) {
                $scope.slides = result.data;
            } else {
                $scope.alerta = 1;
            }
        }, function (error) {});
    }

    //Redirige a pantalla de Nueva Cotización
    $scope.nuevaCotizacion = function () {
        /*var objOrden = {};
        objOrden.idTaller = 1;
        objOrden.idUsuario = $scope.userData.idUsuario;
        objOrden.idTrabajo = $scope.idTrabajoOrden.idTrabajo;
        objOrden.idUnidad = 1;
        objOrden.idCita = $scope.idTrabajoOrden.idCita;

        if (localStorageService.get('objEditCotizacion') != null) {
            localStorageService.remove('objEditCotizacion');
        }
        if (localStorageService.get('cita') != null) {
            localStorageService.remove('cita');
        }        
        localStorageService.set('orden', objOrden);*/

        localStorageService.set('isNuevaCotizacion', 1);
        $scope.getDatosCita();
        $location.path('/cotizacionnueva');
    }

    $scope.Adjuntar = function () {
        $('#modal').appendTo('body').modal('show');
    }

    //Se realiza la carga de archivos
    $scope.cargarArchivos = function () {
        //Se obtienen los datos de los archivos a subir
        formArchivos = document.getElementById("uploader");
        contentForm = (formArchivos.contentWindow || formArchivos.contentDocument);
        if (contentForm.document)
            btnSubmit = contentForm.document.getElementById("submit2");
        elements = contentForm.document.getElementById("uploadForm").elements;
        idTrabajoEdit = contentForm.document.getElementById("idTrabajo");

        idTrabajoEdit.value = $scope.idTrabajoOrden.idTrabajo;

        for (var i = 0; i < elements.length; i++) {
            if (elements[i].value.lastIndexOf(".") > 0) {
                $scope.nombreArchivo = elements[i].value;
                $scope.tipoArchivo = obtenerExtArchivo($scope.nombreArchivo);
                $scope.idTipoArchivo = obtenerTipoArchivo($scope.tipoArchivo);
                cotizacionRepository.insertEvidencia(tipoEvidencia,
                        $scope.idTipoArchivo,
                        $scope.userData.idUsuario,
                        $scope.idTrabajoOrden.idTrabajo,
                        $scope.nombreArchivo)
                    .then(function (result) {
                        alertFactory.success('Evidencia Guardada Correctamente');
                    }, function (error) {
                        alertFactory.error('Error');
                    });
            }
        }
        //Submit del botón del Form para subir los archivos        
        btnSubmit.click();
        $scope.cargaEvidencias();
        $('#modal').modal('hide');
    }

    //Se obtiene la extensión del archivo
    var obtenerExtArchivo = function (file) {
        $scope.file = file;
        var res = $scope.file.substring($scope.file.length - 4, $scope.file.length)
        return res;
    }

    //Obtener el tipo de archivo
    var obtenerTipoArchivo = function (ext) {
        if (ext == '.pdf' || ext == '.doc' || ext == '.xls' || ext == '.docx' || ext == '.xlsx' ||
            ext == '.PDF' || ext == '.DOC' || ext == '.XLS' || ext == '.DOCX' || ext == '.XLSX' || ext == '.ppt' || ext == '.PPT') {
            type = 1;
        } else if (ext == '.jpg' || ext == '.png' || ext == '.gif' || ext == '.bmp' || ext == '.JPG' || ext == '.PNG' || ext == '.GIF' || ext == '.BMP') {
            type = 2;
        } else if (ext == '.mp4') {
            type = 3;
        }
        return type;
    }

    //Se obtienen los archivos de la cotización (documentos)
    $scope.cargaDocs = function (idCotizacion) {
        $scope.promise =
            cotizacionAutorizacionRepository.getDocs(idCotizacion).then(function (result) {
                $scope.docs = result.data;
            }, function (error) {});
    }

    //Obtiene los datos del cliente
    $scope.cargaDatosCliente = function (idCita) {
        cotizacionAutorizacionRepository.getDatosCliente(idCita).then(function (result) {
            if (result.data.length > 0) {
                $scope.ClienteData = result.data[0];
            } else {
                alertFactory.info('No se pudo obtener los datos del cliente');
            }
        }, function (error) {
            alertFactory.error('No se pudo obtener los datos del cliente, inténtelo más tarde');
        });
    }

    $scope.Detalle = function (idCotizacion, idTaller) {
        cotizacionConsultaRepository.getDetail(idCotizacion, idTaller).then(function (result) {
            if (result.data.length > 0) {
                $scope.total = 0;
                $scope.articulos = result.data;
                for (var i = 0; i < result.data.length; i++) {
                    $scope.total += (result.data[i].precio * result.data[i].cantidad)
                }

                alertFactory.success('Datos cargados.');
            } else {
                alertFactory.info('No se pudo obtener el detalle de esta cotización.');
            }
        }, function (error) {
            alertFactory.info('No se pudo obtener el detalle de esta cotización.');
        });

    }

    //Devuelve las órdenes por cobrar
    $scope.getOrdenesPorCobrar = function () {
        ordenServicioRepository.getOrdenesPorCobrar().then(function (result) {
            if (result.data.lenght > 0) {
                var algo = result.data;
            }
        }, function (error) {
            alertFactory.error("No se pudieron obtener las órdenes por cobrar");
        });
    }

    $scope.$watch('isSelected', function () {
        if ($scope.userData.idTipoUsuario != 4) {
            if ($scope.isSelected == 'yep') {
                $scope.vistaPrecio = 1;
            } else {
                $scope.vistaPrecio = 2;
            }
        }
    });

    //Invoca popup para editar el precio
    $scope.editarPrecio = function (partida) {
        $scope.pieza = partida;
        $scope.precioActual = partida.precio;
        $('#editaPrecio').appendTo('body').modal('show');

    };

    //Actualiza el precio de la partida en la bd
    $scope.precioEditado = function (partida) {
        ordenServicioRepository.putPrecioEditado(partida.idCotizacion, partida.idItem, $scope.precioActual).then(function (result) {
            if (result.data.length > 0) {
                alertFactory.info("El precio se actualizo correctamente");
                $scope.getCotizacionByTrabajo();
            }
        }, function (error) {
            alertFactory.error(error);
        });
    }

    //Devuelve la información de una Cita
    $scope.getDatosCita = function () {
        citaRepository.getDatosCita(commonService.idCita).then(function (result) {
            if (result.data.length > 0) {
                localStorageService.set('cita', result.data[0]);
            }
        }, function (error) {

        });
    }

        //Obtiene las notas por Usuario del trabajo seleccionado
    $scope.obtieneNota = function () {
        ordenServicioRepository.getNotas($scope.idTrabajoOrden.idTrabajo).then(function (result) {
            if (result.data.length > 0) {
                $scope.notaTrabajo = result.data;
            }
        }, function (error) {
            alertFactory.error('No se pudo obtener información de la unidad, inténtelo más tarde');
        });
    }
     //Envia las notas para cada conversacion
    $scope.enviaNota = function () {
            if($scope.texto != null && $scope.texto != '' && $scope.texto != undefined){
            ordenServicioRepository.enviarNotas($scope.idTrabajoOrden.idTrabajo, $scope.userData.idUsuario, $scope.texto).then(function (result) {
                if (result.data.length > 0) {
                    alertFactory.success('Nota enviada correctamente');
                    $scope.obtieneNota();
                    $scope.texto = '';
                } else {
                    alertFactory.info('No se envio la nota correctamente');
                }
            }, function (error) {
                alertFactory.error('No se pudo enviar la nota, porfavor intente mas tarde');
            });
        }else{
             alertFactory.info('Porfavor ingrese algun texto para porder enviar la Nota');
        }
    }


});