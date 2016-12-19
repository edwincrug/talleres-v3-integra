// -- =============================================
// -- Author:      Mario Mejía
// -- Create date: 23/03/2016
// -- Description: trabajo controller
// -- Modificó: Vladimir Juárez Juárez
// -- Fecha: 10/04/2016
// -- =============================================
registrationModule.controller('trabajoController', function ($scope, $modal, $rootScope, localStorageService, alertFactory, globalFactory, trabajoRepository, ordenServicioRepository, cotizacionRepository, uploadRepository, cotizacionAutorizacionRepository, ordenAnticipoRepository, commonService, $location) {
    //this is the first method executed in the view
    $scope.init = function () {
        //configuraciones de dropzone
        Dropzone.autoDiscover = false;
        $scope.dzOptionsFactura = uploadRepository.getDzOptions('text/xml,application/pdf,image/bmp,image/gif,image/jpeg,image/png', 2);
        $scope.userData = localStorageService.get('userData');
        getTrabajo($scope.userData.idUsuario);
        getTrabajoTerminado($scope.userData.idUsuario);
        // getTrabajoAprobado($scope.userData.idUsuario);
        $scope.habilitaBtnAprobar = true;

        $scope.certificadoParams = {
            noReporte: "",
            tad: "",
            gerencia: "",
            solpe: "",
            ordenSurtimiento: "",
            montoOS: "",
            nombreEmisor: "",
            nombreProveedor: "",
            puestoProveedor: ""
        }

        $scope.cleanfecha();
        //$scope.getAdmonOrdenes();
    }

    var obtieneNombreArchivo = function (idTrabajo) {
        cotizacionRepository.obtieneNombreArchivo(idTrabajo).then(function (nombreArchivo) {
            if (nombreArchivo.data != null) {
                $scope.certificadoConformidad = nombreArchivo.data[0];
                trabajoRepository.descargaCerficadoConformidadTrabajo(20, idTrabajo).then(function (certificadoDescargado) {
                    if (certificadoDescargado.data[0].idHistorialProceso > 0) {
                        alertFactory.success("Certificado de conformidad descargado");
                        getTrabajo($scope.userData.idUsuario);
                        getTrabajoTerminado($scope.userData.idUsuario);
                        //getTrabajoAprobado($scope.userData.idUsuario);
                        // $scope.getAdmonOrdenes();
                    }
                }, function (error) {
                    alertFactory.error("Error al cambiar la orden a estatus Certificado descargado");
                })
            }
        }, function (error) {
            alertFactory.error("Error al encontrar nombre de archivo");
        });

    }

    var getTrabajo = function (idUsuario) {
        var sumatoria = 0
        trabajoRepository.getTrabajo(idUsuario).then(function (trabajo) {
            $('.dataTableTrabajo').DataTable().destroy();
            $scope.trabajos = trabajo.data;
            for (var i = 0; i < trabajo.data.length; i++) {
                sumatoria += parseFloat(trabajo.data[i].precioOrden);
            };

            $scope.sumatoriaProceso = sumatoria;
            if (trabajo.data.length > 0) {
                globalFactory.waitDrawDocument("dataTableTrabajo", "OrdenServicio");
                alertFactory.success("Trabajos cargados");
            } else {
                alertFactory.info("No se encontraron trabajos");
            }
        }, function (error) {
            alertFactory.error("Error al cargar trabajos");
        });
    }

    //obtiene los trabajos terminados
    var getTrabajoTerminado = function (idUsuario) {
        var sumatoria = 0
        $scope.trabajosTerminados = [];
        $('.dataTableTrabajoTerminado').DataTable().destroy();
        $('.dataTableTrabajo').DataTable().destroy();
        trabajoRepository.getTrabajoTerminado(idUsuario).then(function (trabajoTerminado) {

            for (var i = 0; i < trabajoTerminado.data.length; i++) {
                sumatoria += parseFloat(trabajoTerminado.data[i].precioOrden);

                obj = new Object();
                obj.idCita = trabajoTerminado.data[i].idCita;
                obj.numeroTrabajo = trabajoTerminado.data[i].numeroTrabajo;
                obj.numEconomico = trabajoTerminado.data[i].numEconomico;
                obj.zona = trabajoTerminado.data[i].zona;
                obj.TAR = trabajoTerminado.data[i].TAR;
                obj.marca = trabajoTerminado.data[i].marca;
                obj.modeloMarca = trabajoTerminado.data[i].modeloMarca;
                obj.trabajo = trabajoTerminado.data[i].trabajo;
                obj.observacion = trabajoTerminado.data[i].observacion;
                obj.descripcionLarga = trabajoTerminado.data[i].descripcionLarga;
                obj.precioOrden = trabajoTerminado.data[i].precioOrden;
                obj.idTrabajo = trabajoTerminado.data[i].idTrabajo;
                obj.montoOrden = trabajoTerminado.data[i].montoOrden;
                obj.estatus = trabajoTerminado.data[i].estatus;
                obj.fecha = trabajoTerminado.data[i].fecha;
                obj.fechaFin = trabajoTerminado.data[i].fechaFin;
                obj.idTrabajo = trabajoTerminado.data[i].idTrabajo;
                obj.idTAR = trabajoTerminado.data[i].idTAR;
                obj.razonSocial = trabajoTerminado.data[i].razonSocial;
                obj.estatusProvision = trabajoTerminado.data[i].estatusProvision;
                obj.estatusBPRO = trabajoTerminado.data[i].estatusBPRO;
                obj.numeroNotas = trabajoTerminado.data[i].numeroNotas;
                obj.cliente = trabajoTerminado.data[i].cliente;
                obj.indice = i;
                obj.class_buttonCeritficado = 'glyphicon glyphicon-file';
                obj.idTipoCita = trabajoTerminado.data[i].idTipoCita;

                $scope.trabajosTerminados.push(obj);
            };

            $scope.sumatoriaEntrega = sumatoria;

            if (trabajoTerminado.data.length > 0) {
                globalFactory.waitDrawDocument("dataTableTrabajoTerminado", "OrdenServicio");
                alertFactory.success("Trabajos terminados cargados");
            } else {
                alertFactory.info("No se encontraron trabajos terminados");
            }
        }, function (error) {
            alertFactory.error("Error al cargar trabajos terminados");
        });
    }

    //obtiene los trabajos aprobados
    /*    var getTrabajoAprobado = function (idUsuario) {
            $('.dataTableTrabajoAprobado').DataTable().destroy();
            trabajoRepository.getTrabajoAprobado(idUsuario).then(function (trabajoAprobado) {
                $scope.trabajosAprobados = trabajoAprobado.data;

                if (trabajoAprobado.data.length > 0) {
                    globalFactory.waitDrawDocument("dataTableTrabajoAprobado", "OrdenServicio");
                    alertFactory.success("Trabajos aprobados cargados");
                } else {
                    alertFactory.info("No se encontraron trabajos aprobados");
                }
            }, function (error) {
                alertFactory.error("Error al cargar trabajos aprobados");
            });
        }*/

    $scope.aprobarTrabajo = function (trabajo, valBotonera) {
        var objBotonera = {};
        objBotonera.accion = valBotonera;
        objBotonera.idCita = trabajo.idCita;
        localStorageService.set('objTrabajo', trabajo);
        localStorageService.set("botonera", objBotonera);
        commonService.idEstatusTrabajo = 5;
        commonService.idCita = trabajo.idCita;
        $location.path('/ordenservicio');
    }

    //actualiza el trabajo a estatus terminado
    $scope.updTerminaTrabajo = function (observacion) {
        trabajoRepository.terminaTrabajo(7, $scope.idTrabajo, observacion).then(function (trabajoTerminado) {
            if (trabajoTerminado.data[0].idHistorialProceso != 0) {
                // getTrabajo($scope.userData.idUsuario);
                // getTrabajoTerminado($scope.userData.idUsuario);
                $('#finalizarTrabajoModal').modal('hide');
            }
        });
    }

    //abre el modal para la finalización del trabajo
    $scope.openFinishingTrabajoModal = function (idTrabajo) {
        $scope.idTrabajo = idTrabajo;

        trabajoRepository.getEstatusCotizacion(idTrabajo).then(function (resp) {
            if (resp.data[0].estatus > 0) {
                swal("No se puede terminar el trabajo porque hay cotizaciones pendientes de autorizar.");
            } else {
                ordenServicioRepository.getEstatusUtilidad(idTrabajo, 2).then(function (estatus) {

                    if (estatus.data.length > 0) {

                        if (estatus.data[0].estatus == 1) {

                            modal_tiket($scope, $modal, estatus.data[0].idAprobacionUtilidad, 'Trabajo', $scope.trabajoTer, '');

                        } else {
                            $scope.trabajoTer();
                        }

                    } else {

                        $scope.trabajos.forEach(function (p, i) {
                            if (p.idTrabajo == idTrabajo) {
                                if (p.fechaServicio != null) {
                                    $('#finalizarTrabajoModal').appendTo("body").modal('show');
                                    $scope.idTrabajo = idTrabajo;
                                } else {
                                    alertFactory.info('Debe ingresar la fecha inicio del trabajo');
                                }
                            }
                        });
                    }
                }, function (error) {
                    alertFactory.error("Error al cargar la orden");
                });
            }

        }, function (error) {
            alertFactory.error("Error al cargar la orden");
        });



    }

    $scope.trabajoTer = function () {
        $scope.updTerminaTrabajo($scope.observacionTrabajo);
        swal("Trabajo Terminado!", "El trabajo se ha terminado", "success");
        $scope.observacionTrabajo = null;
        getTrabajo($scope.userData.idUsuario);
        getTrabajoTerminado($scope.userData.idUsuario);
    }

    //  title: "¿Está seguro de terminar el trabajo?",
    //             text: "Se cambiará el estatus del trabajo a TERMINADO",
    // //confirm del trabajo para su terminación
    $('.btnTerminarTrabajo').click(function () {

        swal({
                title: "Advertencia",
                text: "La orden se enviará a aprobación para permitir la salida de la unidad. ¿Está seguro?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#67BF11",
                confirmButtonText: "Si",
                cancelButtonText: "No",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    ordenServicioRepository.putAprobacionUtilidad($scope.idTrabajo, $scope.userData.idUsuario, 2, null, $scope.observacionTrabajo).then(function (aprobacionUtilidad) {

                        $('#finalizarTrabajoModal').modal('hide');
                        if (aprobacionUtilidad.data[0].id > 0) {
                            //$scope.updTerminaTrabajo($scope.observacionTrabajo);
                            swal("Éxito", "El trabajo se ha enviado a autorización", "success");
                            getTrabajo($scope.userData.idUsuario);
                            getTrabajoTerminado($scope.userData.idUsuario);
                            //$scope.observacionTrabajo = null;
                        }
                    }, function (error) {
                        alertFactory.error("Error al cargar la orden");
                    });
                } else {
                    swal("Cancelado", "", "error");
                    $scope.observacionTrabajo = null;
                }
            });

    });

    //muestra el modal para la carga de archivos
    $scope.adjuntar = function (objOrden, idNombreEspecial, ejecutaMetodo, anticipo) {
        $scope.idTrabajo = objOrden.idTrabajo;
        //LQMA add 19092016
        $scope.idEstatusPorCerrar = objOrden.idEstatus;

        $scope.idCotizacionFactura != null || $scope.idCotizacionFactura != undefined ?
            $scope.idCotizacion = $scope.idCotizacionFactura + '|' + $scope.numeroCotizacion :
            $scope.idCotizacion = 0;

        $scope.idCategoria = 2;
        $scope.idNombreEspecial = idNombreEspecial;
        $scope.ejecutaMetodo = ejecutaMetodo;
        if (anticipo == 1) {
            $scope.anticipo = 1;
            $scope.tituloModal = 'Solicitud de Anticipo';
            $scope.textoBoton = 'Solicitar';
            //$scope.getMontoOrdenTrabajo(objOrden.idCita);
        } else {
            $scope.anticipo = 0;
            $scope.tituloModal = 'Carga Archivo';
            $scope.textoBoton = 'Cargar';
        }
        $('#modalCargaArchivos').appendTo('body').modal('show');
    }

    //cambia el trabajo a estatus a facturado
    var upadateEstatusTrabajo = function (idTrabajo, idNombreEspecial) {
        if (idNombreEspecial == 2) { //Transferencia de custodia
            trabajoRepository.transfResponsabilidadTrabajo(14, idTrabajo).then(function (transferenciaCustodia) {
                if (transferenciaCustodia.data[0].idHistorialProceso > 0) {
                    alertFactory.success("Archivos cargados satisfactoriamente");
                    alertFactory.success("Transferencia de custodia cargada");
                    setTimeout(function () {
                        $scope.dzMethods.removeAllFiles();
                        $('#modalCargaArchivos').appendTo('body').modal('hide');
                    }, 1000);
                    getTrabajo($scope.userData.idUsuario);
                    getTrabajoTerminado($scope.userData.idUsuario);
                    //getTrabajoAprobado($scope.userData.idUsuario);
                    //$scope.getAdmonOrdenes();
                }
            }, function (error) {
                alertFactory.error("Error al cargar la Transferencia de custodia");
            });
        } else if (idNombreEspecial == 3) { //Facturado
            trabajoRepository.facturaTrabajo(12, idTrabajo).then(function (trabajoFacturado) {
                if (trabajoFacturado.data[0].idHistorialProceso > 0) {
                    alertFactory.success("Archivos cargados satisfactoriamente");
                    alertFactory.success("Factura cargada");
                    setTimeout(function () {
                        $scope.dzMethods.removeAllFiles();
                        $('#modalCargaArchivos').appendTo('body').modal('hide');
                    }, 1000);
                    getTrabajo($scope.userData.idUsuario);
                    getTrabajoTerminado($scope.userData.idUsuario);
                    // getTrabajoAprobado($scope.userData.idUsuario);
                    //$scope.getAdmonOrdenes();
                }
            }, function (error) {
                alertFactory.error("Error al cargar la factura");
            });
        } else if (idNombreEspecial == 5) { //certificado cliente
            trabajoRepository.uploadCertificadoCallCenterTrabajo(19, idTrabajo).then(function (certificadoTrabajo1) {
                if (certificadoTrabajo1.data[0].idHistorialProceso > 0) {
                    alertFactory.success("Archivos cargados satisfactoriamente");
                    alertFactory.success("Certificado de conformidad cargada");
                    setTimeout(function () {
                        $scope.dzMethods.removeAllFiles();
                        $('#modalCargaArchivos').appendTo('body').modal('hide');
                    }, 1000);
                    getTrabajo($scope.userData.idUsuario);
                    getTrabajoTerminado($scope.userData.idUsuario);
                    //getTrabajoAprobado($scope.userData.idUsuario);
                    //$scope.getAdmonOrdenes();
                }
            }, function (error) {
                alertFactory.error("Error al cargar el certificado de conformidad");
            });
        } else if (idNombreEspecial == 6) { //trabajo cerrado
            trabajoRepository.uploadCertificadoClienteTrabajo(11, idTrabajo).then(function (certificadoTrabajo2) {
                if (certificadoTrabajo2.data[0].idHistorialProceso > 0) {
                    alertFactory.success("Archivos cargados satisfactoriamente");
                    alertFactory.success("Certificado de conformidad cargada");
                    setTimeout(function () {
                        $scope.dzMethods.removeAllFiles();
                        $('#modalCargaArchivos').appendTo('body').modal('hide');
                    }, 1000);
                    getTrabajo($scope.userData.idUsuario);
                    getTrabajoTerminado($scope.userData.idUsuario);
                    //getTrabajoAprobado($scope.userData.idUsuario);
                    //$scope.getAdmonOrdenes();
                }
            }, function (error) {
                alertFactory.error("Error al cargar el certificado de conformidad");
            });
        }

    }

    //genera el formato para el certificado de conformidad
    $scope.generaCertificadoConformidadPDF = function (idTrabajo, idTAR, montoOrden, indice) {
        var saldo = 0;

        trabajoRepository.getCosecutivoZona(idTrabajo).then(function (res) {
          
            if (res.data.length > 0) {

                $scope.trabajosTerminados[indice].class_buttonCeritficado = 'fa fa-circle-o-notch fa-spin';
                    $scope.generaCertificado = false;
                    trabajoRepository.generaCerficadoConformidadTrabajo(17, idTrabajo).then(function (certificadoGenerado) {
                        if (certificadoGenerado.data.length > 0) {
                            if (certificadoGenerado.data[0].noReporte != 'KO') {
                                $scope.generaCertificado = true;
                                $scope.certificadoParams.noReporte = certificadoGenerado.data[0].noReporte;
                                $scope.certificadoParams.gerencia = certificadoGenerado.data[0].region;
                                $scope.certificadoParams.tad = certificadoGenerado.data[0].tad;
                                $scope.certificadoParams.solpe = certificadoGenerado.data[0].solpe;
                                $scope.certificadoParams.ordenSurtimiento = certificadoGenerado.data[0].osur;
                                $scope.certificadoParams.montoOS = certificadoGenerado.data[0].montoOs;
                                $scope.certificadoParams.nombreEmisor = '';
                                $scope.certificadoParams.nombreProveedor = certificadoGenerado.data[0].nombreProveedor;
                                $scope.certificadoParams.puestoProveedor = certificadoGenerado.data[0].puestoProveedor;
                                $scope.idTrabajo = idTrabajo;
                                var fechaGeneracion = new Date();
                                fechaGeneracion = formatDate(fechaGeneracion);

                                trabajoRepository.getReporteDummy(idTrabajo, $scope.certificadoParams.noReporte, $scope.certificadoParams.gerencia, $scope.certificadoParams.tad, $scope.certificadoParams.solpe, $scope.certificadoParams.ordenSurtimiento, $scope.certificadoParams.montoOS, $scope.certificadoParams.nombreProveedor, $scope.certificadoParams.puestoProveedor, fechaGeneracion).then(function (respuesta) {
                                    var algo = ''
                                    $scope.certificadoParams = {
                                        noReporte: "",
                                        gerencia: "",
                                        tad: "",
                                        solpe: "",
                                        ordenSurtimiento: "",
                                        montoOS: "",
                                        nombreEmisor: "",
                                        nombreProveedor: "",
                                        puestoProveedor: ""
                                    }
                                    $scope.trabajosTerminados[indice].class_buttonCeritficado = 'glyphicon glyphicon-file';
                                    alertFactory.success('Certificado generado correctamente');
                                    getTrabajo($scope.userData.idUsuario);
                                    getTrabajoTerminado($scope.userData.idUsuario);
                                    //getTrabajoAprobado($scope.userData.idUsuario);
                                    //$scope.getAdmonOrdenes();
                                }, function (error) {
                                    alertFactory.error('No se pudo generar el certificado');
                                });
                            } else {
                                alertFactory.success('Información insuficiente para poder generar este certificado');
                            }
                        } else {
                            alertFactory.success('Información insuficiente para poder generar este certificado');
                        }
                    }, function (error) {
                        alertFactory.error("Error al cambiar la orden a estatus Certificado generado");
                    })

            }else{

                 trabajoRepository.getSaldoTar(idTAR).then(function (saldoRes) {

                    if (saldoRes.data.length > 0) {
                        saldo = saldoRes.data[0].saldo;
                        if (saldo > 0) {
                            saldo = saldo - montoOrden;
                        }

                        if (saldo > 0) {
                            $scope.trabajosTerminados[indice].class_buttonCeritficado = 'fa fa-circle-o-notch fa-spin';
                            $scope.generaCertificado = false;
                            trabajoRepository.generaCerficadoConformidadTrabajo(17, idTrabajo).then(function (certificadoGenerado) {
                                if (certificadoGenerado.data.length > 0) {
                                    if (certificadoGenerado.data[0].noReporte != 'KO') {
                                        $scope.generaCertificado = true;
                                        $scope.certificadoParams.noReporte = certificadoGenerado.data[0].noReporte;
                                        $scope.certificadoParams.gerencia = certificadoGenerado.data[0].region;
                                        $scope.certificadoParams.tad = certificadoGenerado.data[0].tad;
                                        $scope.certificadoParams.solpe = certificadoGenerado.data[0].solpe;
                                        $scope.certificadoParams.ordenSurtimiento = certificadoGenerado.data[0].osur;
                                        $scope.certificadoParams.montoOS = certificadoGenerado.data[0].montoOs;
                                        $scope.certificadoParams.nombreEmisor = '';
                                        $scope.certificadoParams.nombreProveedor = certificadoGenerado.data[0].nombreProveedor;
                                        $scope.certificadoParams.puestoProveedor = certificadoGenerado.data[0].puestoProveedor;
                                        $scope.idTrabajo = idTrabajo;
                                        var fechaGeneracion = new Date();
                                        fechaGeneracion = formatDate(fechaGeneracion);

                                        trabajoRepository.getReporteDummy(idTrabajo, $scope.certificadoParams.noReporte, $scope.certificadoParams.gerencia, $scope.certificadoParams.tad, $scope.certificadoParams.solpe, $scope.certificadoParams.ordenSurtimiento, $scope.certificadoParams.montoOS, $scope.certificadoParams.nombreProveedor, $scope.certificadoParams.puestoProveedor, fechaGeneracion).then(function (respuesta) {
                                            var algo = ''
                                            $scope.certificadoParams = {
                                                noReporte: "",
                                                gerencia: "",
                                                tad: "",
                                                solpe: "",
                                                ordenSurtimiento: "",
                                                montoOS: "",
                                                nombreEmisor: "",
                                                nombreProveedor: "",
                                                puestoProveedor: ""
                                            }
                                            $scope.trabajosTerminados[indice].class_buttonCeritficado = 'glyphicon glyphicon-file';
                                            alertFactory.success('Certificado generado correctamente');
                                            getTrabajo($scope.userData.idUsuario);
                                            getTrabajoTerminado($scope.userData.idUsuario);
                                            //getTrabajoAprobado($scope.userData.idUsuario);
                                            //$scope.getAdmonOrdenes();
                                        }, function (error) {
                                            alertFactory.error('No se pudo generar el certificado');
                                        });
                                    } else {
                                        alertFactory.success('Información insuficiente para poder generar este certificado');
                                    }
                                } else {
                                    alertFactory.success('Información insuficiente para poder generar este certificado');
                                }
                            }, function (error) {
                                alertFactory.error("Error al cambiar la orden a estatus Certificado generado");
                            })

                        } else {

                            trabajoRepository.postEstatusOsur(idTAR).then(function (estatusOsur) {

                                if (estatusOsur.data[0].id = 1) {

                                    //regresa
                                    $scope.generaCertificadoConformidadPDF(idTrabajo, idTAR, montoOrden);

                                } else {
                                    //correo

                                    swal({
                                            title: "Advertencia",
                                            text: "No se puede generar el certificado por saldo insuficiente.",
                                            type: "warning",
                                            showCancelButton: false,
                                            confirmButtonColor: "#67BF11",
                                            confirmButtonText: "Aceptar",
                                            closeOnConfirm: false
                                        },
                                        function (isConfirm) {
                                            if (isConfirm) {
                                                trabajoRepository.enviarMailOsur(idTAR).then(function (mail) {

                                                    if (mail.data[0].enviado == 1) {
                                                        swal("Proceso Realizado!");
                                                    }
                                                }, function (error) {
                                                    alertFactory.error("Error al cargar enviar mail");
                                                });
                                            }
                                        });
                                }


                            }, function (error) {
                                console.log('error ' + error)
                                alertFactory.error("Error al cambiar el estatus ");
                            })



                        }

                        /*if ($scope.certificadoParams.noReporte != '' && $scope.certificadoParams.tad != '' && $scope.certificadoParams.gerencia != '' && $scope.certificadoParams.solpe != '' && $scope.certificadoParams.ordenSurtimiento != '' && $scope.certificadoParams.montoOS != '' && $scope.certificadoParams.nombreProveedor != '' && $scope.certificadoParams.puestoProveedor != '') {*/

                    } else {
                        //correo

                        swal({
                                title: "Advertencia",
                                text: "No se puede generar el certificado por saldo insuficiente. Se enviará Mail para nueva Osur.",
                                type: "warning",
                                showCancelButton: false,
                                confirmButtonColor: "#67BF11",
                                confirmButtonText: "Aceptar",
                                closeOnConfirm: true
                            },
                            function (isConfirm) {
                                if (isConfirm) {
                                    trabajoRepository.enviarMailOsur(idTAR).then(function (mail) {

                                        if (mail.data[0].enviado == 1) {
                                            swal("Proceso Realizado!");
                                        }
                                    }, function (error) {
                                        alertFactory.error("Error al cargar enviar mail");
                                    });
                                }
                            });
                    }
                }, function (error) {
                    alertFactory.error("Error del precio");
                })
            }

         }, function (error) {
            alertFactory.error("Error del precio");
        })   
        //idTAR= 31; 
       
    }

    //realiza el cambio de estatus de la orden a certificado de conformidad descargada
    $scope.descargaCertificadoConformidadPDF = function (idTrabajo) {
        obtieneNombreArchivo(idTrabajo);
    }

    //abre la modal para los datos de entrada del certificado de conformidad
    $scope.datosEntradaCertificadoModal = function (idTrabajo) {
        $scope.idTrabajo = idTrabajo;
        $('#datosEntradaCertificadoModal').appendTo("body").modal('show');
    }

    $scope.ordenGarantia = function (idEstatus, idTrabajo, observacion) {
        trabajoRepository.ordenServicioGarantia(idEstatus, idTrabajo, observacion).then(function (orden) {
            $scope.ordens = orden.data;
            alertFactory.success("Se rachazo el trabajo");
        }, function (error) {
            alertFactory.error("Error al rechazar el trabajo");
        });
        trabajoRepository.getOrdenEmail(idTrabajo).then(function (email) {
            $scope.emails = email.data;
            alertFactory.success("Se envio email satisfactoriamente");
            location.href = '/trabajo';
        }, function (error) {
            alertFactory.error("Error al enviar el email");
        });

    }

    $scope.openOrdenTrabajoModal = function (idEstatus, idTrabajo) {
        $('#finalizarTrabajoModal2').appendTo("body").modal('show');
        $scope.idEstatus = idEstatus;
        $scope.idTrabajo = idTrabajo;
    }

    $('.btnTerminarTrabajo2').click(function () {
        swal({
                title: "¿Esta seguro que desea rechazar el trabajo?",
                text: "Se cambiará el estatus a 'Orden de Servicio en Garantia'",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#65BD10",
                confirmButtonText: "Si",
                cancelButtonText: "No",
                closeOnConfirm: false,
                closeOnCancel: false
            },
            function (isConfirm) {
                if (isConfirm) {
                    $scope.ordenGarantia($scope.idEstatus, $scope.idTrabajo, $scope.observacionRechazo);
                    swal("Trabajo Rechazado!", "El trabajo se ha rechzado", "success");
                    $scope.observacionRechazo = null;
                } else {
                    swal("Rechazo Cancelado", "", "error");
                    $('#finalizarTrabajoModal').modal('hide');
                    $scope.observacionRechazo = null;
                }
            });
    });

    //call backs of drop zone
    $scope.dzCallbacks = {
        'addedfile': function (file) {
            $scope.newFile = file;
        },
        'sending': function (file, xhr, formData) {
            formData.append('idTrabajo', $scope.idTrabajo);
            formData.append('idCotizacion', $scope.idCotizacion);
            formData.append('idCategoria', $scope.idCategoria);
            formData.append('idNombreEspecial', $scope.idNombreEspecial);
            //LQMA  add 15092016  --idEstatus , define si crea el archivo de forma temporal
            formData.append('idEstatus', $scope.idEstatusPorCerrar);
        },
        'completemultiple': function (file, xhr) {
            var checkErrorFile = file.some(checkExistsError);
            if (!checkErrorFile) {
                var allSuccess = file.every(checkAllSuccess);
                if (allSuccess) {
                    if ($scope.ejecutaMetodo == 1) {
                        if ($scope.idNombreEspecial == 3) {
                            trabajoRepository.getGuardaFactura($scope.idTrabajo, $scope.idCotizacionFactura, $scope.userData.idUsuario, $scope.idEstatusPorCerrar).then(function (result) { //LQMA add idEstatusPorCerrar
                                if (result.data.length > 0) {
                                    $scope.lecturaFactura = result.data;
                                    $scope.totalxml = $scope.lecturaFactura[4].value;
                                    // alertFactory.success("Proceso Correcto");
                                    if ((($scope.totalxml - 1) <= $scope.totalCotizacionBD) && ($scope.totalCotizacionBD <= ($scope.totalxml + 1))) {
                                        result.data.forEach(function (sumatoria) {
                                            if (sumatoria.name == 'idCotizacion') $scope.idCotizacionFac = sumatoria.value;
                                            if (sumatoria.name == 'numFactura') $scope.numFacturaFac = sumatoria.value;
                                            if (sumatoria.name == 'UUID') $scope.UUIDFac = sumatoria.value;
                                            if (sumatoria.name == 'fechaFactura') $scope.fechaFacturaFac = sumatoria.value;
                                            if (sumatoria.name == 'total') $scope.totalFac = sumatoria.value;
                                            if (sumatoria.name == 'subtotal') $scope.subtotalFac = sumatoria.value;
                                            if (sumatoria.name == 'idUsuario') $scope.idUsuarioFac = sumatoria.value;
                                            if (sumatoria.name == 'xmlFactura') $scope.xmlFacturaFac = sumatoria.value;
                                        });
                                        $scope.guardaDatosFactura($scope.idCotizacionFac, $scope.numFacturaFac, $scope.UUIDFac, $scope.fechaFacturaFac, $scope.totalFac, $scope.subtotalFac, $scope.idUsuarioFac, $scope.xmlFacturaFac);
                                        if ($scope.idEstatusTrabajo == 11) {
                                            upadateEstatusTrabajo($scope.idTrabajo, $scope.idNombreEspecial);
                                        } else {
                                            setTimeout(function () {
                                                $scope.dzMethods.removeAllFiles();
                                                $('#modalCargaArchivos').appendTo('body').modal('hide');
                                            }, 1000);
                                            alertFactory.success("Factura Cargada Correctamente");
                                        }
                                        //LQMA ADD 20092016, borra solo temporales: idOpcion = 2
                                        $scope.eliminaFactura($scope.idTrabajo, $scope.idCotizacionFactura, 2);
                                        setTimeout(function () {
                                            $scope.renombraFacturaTemporal($scope.idTrabajo, $scope.idCotizacionFactura);
                                        }, 500);


                                    } else {
                                        //if($scope.idEstatusTrabajo==11 || $scope.idEstatusPorCerrar == 12){
                                        //LQMA ADD 20092016, borra solo temporales: idOpcion = 1
                                        $scope.eliminaFactura($scope.idTrabajo, $scope.idCotizacionFactura, 1);
                                        //   }
                                        setTimeout(function () {
                                            $scope.dzMethods.removeAllFiles();
                                            $('#modalCargaArchivos').appendTo('body').modal('hide');
                                        }, 1500);
                                        alertFactory.info("El monto de la orden seleccionada rebasa el rango especificado de (+- $1.00 MXN), seleccione una orden que se adecúe con el monto de la Factura");
                                    }
                                }
                            }, function (error) {
                                alertFactory.error("Error al cargar la prefactura");
                            });
                        } else {
                            upadateEstatusTrabajo($scope.idTrabajo, $scope.idNombreEspecial);
                        }
                    } else if ($scope.anticipo == 1) {
                        setTimeout(function () {
                            $scope.dzMethods.removeAllFiles();
                            $('#modalCargaArchivos').appendTo('body').modal('hide');
                        }, 1000);
                        $scope.anticipo = 0;
                        ordenAnticipoRepository.putAnticipo($scope.idCotizacionFactura).then(function (ordenAnticipo) {
                            alertFactory.success("Anticipo registrado");
                        }, function (error) {
                            alertFactory.error("Error al insertar el anticipo");
                        });
                    } else {
                        setTimeout(function () {
                            $scope.dzMethods.removeAllFiles();
                            $('#modalCargaArchivos').appendTo('body').modal('hide');
                        }, 1000);
                        //$scope.getAdmonOrdenes();
                    }
                }
            }
        },
        'error': function (file, xhr) {
            if (!file.accepted) {
                $scope.dzMethods.removeFile(file);
            } else {
                $scope.dzMethods.removeAllFiles(true);
                alertFactory.info("No se pudieron subir los archivos");
            }
        },
    };

    //valida si todos son success
    function checkAllSuccess(file, index, array) {
        return file.status === 'success';
    }

    //valida si existe algún error
    function checkExistsError(file) {
        return file.status === 'error';
    }

    $('#fechaTrabajo .input-group.date').datepicker({
        todayBtn: "linked",
        keyboardNavigation: true,
        forceParse: false,
        calendarWeeks: true,
        autoclose: true,
        todayHighlight: true
    });

    //Devuelve la fecha inicio real de trabajos para su edicion
    $scope.cargaFecha = function (idTrabajo) {
            $('#cargafechainIciorealTrabajo').appendTo("body").modal('show');
            $scope.idTrabajo = idTrabajo;
            trabajoRepository.getFechaRealTrabajo($scope.idTrabajo).then(function (result) {
                $scope.resultado = result.data[0];
                $scope.fecha = $scope.resultado.fecha;
                $scope.hora = $scope.resultado.hora;
            }, function (error) {
                alertFactory.error("Error al buscar la fecha");
            });
        }
        //Guardamos la fecha capturable de inicio real de trabajos
    $scope.guardaFecha = function () {
            $scope.idTrabajo;
            $scope.fechaServicio = $scope.fecha + ' ' + $scope.hora;;
            if ($scope.fecha != '') {
                if ($scope.hora != '') {
                    trabajoRepository.putFechaRealTrabajo($scope.idTrabajo, $scope.fechaServicio).then(function (result) {
                        $scope.resultado = result.data[0];
                        if ($scope.resultado.fechaServicio == 1) {
                            alertFactory.success("Se actualizo correctamente la fecha");
                        } else {
                            alertFactory.success("Se inserto correctamente la fecha");
                        }
                        $scope.cleanfecha();
                        $('#finalizarTrabajoModal').modal('hide');
                        $('#cargafechainIciorealTrabajo').appendTo("body").modal('hide');
                        getTrabajo($scope.userData.idUsuario);
                        getTrabajoTerminado($scope.userData.idUsuario);
                        //location.href = '/trabajo';
                    }, function (error) {
                        alertFactory.error("Error al insertar la fecha");
                    });
                } else {
                    alertFactory.info('Debe ingresar una hora');
                }
            } else {
                alertFactory.info('Debe ingresar una fecha');
            }

        }
        //Limpia en campo de la fecha para su edicion
    $scope.cleanfecha = function () {
        $scope.fecha = '';
        $scope.hora = '';
    }

    $('.clockpicker').clockpicker();

    /*    $scope.getAdmonOrdenes = function () {
            $('.dataTableOrdenporVerificar').DataTable().destroy();
            trabajoRepository.getAdmonOrdenes().then(function (admonOrden) {
                $scope.admonOrdenes = admonOrden.data;
                if (admonOrden.data.length > 0) {
                    globalFactory.waitDrawDocument("dataTableOrdenporVerificar", "OrdenServicio");
                    alertFactory.success("Ordenes por verificar cargados");
                } else {
                    alertFactory.info("No se encontraron Ordenes por verificar");
                }
            }, function (error) {
                alertFactory.error("Error al cargar la orden");
            });
        }*/

    //visualizacion de facturas ADOLFO 15092016
    $scope.verFactura = function (idCotizacion, idTrabajo, numeroCotizacion) {
        trabajoRepository.encuentraFactura(idCotizacion, idTrabajo, numeroCotizacion).then(function (resp) {
            if (resp.data == 1) {
                window.open($rootScope.vIpServer + '/uploads/files/' + idTrabajo + '/' + idCotizacion + '/documentos/factura/Factura_' + numeroCotizacion + '.xml', '_blank', 'Factura');
                window.open($rootScope.vIpServer + '/uploads/files/' + idTrabajo + '/' + idCotizacion + '/documentos/factura/Factura_' + numeroCotizacion + '.pdf', '_blank', 'Factura');
            } else if (resp.data == 2) {
                window.open($rootScope.vIpServer + '/uploads/files/' + idTrabajo + '/documentos/factura/Factura.xml', '_blank', 'Factura');
                window.open($rootScope.vIpServer + '/uploads/files/' + idTrabajo + '/documentos/factura/Factura.pdf', '_blank', 'Factura');
            } else {
                alertFactory.info("No se encontraron Facturas");
            }
        }, function (error) {
            alertFactory.error('Factura no se pudo obtener');
        });
    }

    //visualiza la orden de servicio
    $scope.lookAt = function (trabajo, valBotonera) {
            var objBotonera = {};
            objBotonera.accion = valBotonera;
            objBotonera.idCita = trabajo.idCita;
            localStorageService.set('objTrabajo', trabajo);
            localStorageService.set("botonera", objBotonera);
            localStorageService.set('actualizaCosto', trabajo.numeroTrabajo)
            location.href = '/ordenservicio?state=1';
        }
        //Cambiamos el estatus a Orden verificada
    $scope.verificaOrden = function (idTrabajo, sinProveedor) {
        //LQMA 14092016
        if (sinProveedor > 0) {
            swal("Existen proveedores sin asignar para todas o algunas de las cotizaciones");
        } else {
            $('.btnVerificarOrden').ready(function () {
                swal({
                        title: "¿Está seguro de verificar la Orden?",
                        text: "Pasara a Orden por Cobrar",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#67BF11",
                        confirmButtonText: "Si",
                        cancelButtonText: "No",
                        closeOnConfirm: false,
                        closeOnCancel: false
                    },
                    function (isConfirm) {
                        if (isConfirm) {
                            trabajoRepository.updEstatusVerificado(24, idTrabajo).then(function (ordenVerificada) {
                                if (ordenVerificada.data[0].idHistorialProceso > 0) {
                                    swal("Proceso Realizado!");
                                    location.href = '/ordenesporcobrar';
                                }
                            }, function (error) {
                                alertFactory.error("Error al verificar la orden");
                            });
                        } else {
                            swal("Cancelacion de Orden");
                        }
                    });
            });
        }
    }

    //Obtiene el monto de la órden de servicio
    /*$scope.getMontoOrdenTrabajo = function (idCita) {
        $scope.sumaIvaTotal = 0;
        $scope.sumaPrecioTotal = 0;
        $scope.sumaGranTotal = 0;
        $scope.sumaIvaTotalCliente = 0;
        $scope.sumaPrecioTotalCliente = 0;
        $scope.sumaGranTotalCliente = 0;
        $scope.tasaIva = 0;

        cotizacionAutorizacionRepository.getCotizacionByTrabajo(idCita, $scope.userData.idUsuario).then(function (result) {
                if (result.data.length > 0) {
                    $scope.total = 0;
                    $scope.articulos = result.data;
                    for (var i = 0; i < result.data.length; i++) {
                        //Sumatoria Taller
                        $scope.sumaIvaTotal += (result.data[i].cantidad * result.data[i].precio) * (result.data[i].valorIva / 100);
                        $scope.tasaIva = result.data[i].valorIva;

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
            function (error) {
                alertFactory.error('No se pudo obtener el monto de la órden');
            });
    }*/

    $scope.items = [{
        name: "Action"
    }, {
        name: "Another action"
    }, {
        name: "Something else here"
    }];

    $scope.shouldDisplayPopover = function () {
        return $scope.displayPopover;
    }

    $scope.getCotizacionesOrden = function (idTrabajo) {
        ordenAnticipoRepository.getCotizacionesOrden(idTrabajo).then(function (ordenAnticipo) {
            if (ordenAnticipo.data.length > 0) {
                alertFactory.success("Cotizaciones cargadas");
                $scope.cotizacionesOrden = ordenAnticipo.data;
            }
        }, function (error) {
            alertFactory.error("Error al obtener las cotizaciones de la orden");
        })
    }

    //LQMA 13092016 Obtiene el popopo que corresponde a su cotizacion por trabajo
    $scope.getCotizacionesOrdenAprobado = function (idTrabajo, idEstatus) {
        trabajoRepository.getCotizacionesOrdenAprobado(idTrabajo, idEstatus).then(function (ordenAnticipo) {
            if (ordenAnticipo.data.length > 0) {
                alertFactory.success("Cotizaciones cargadas");
                $scope.cotizacionesOrden = ordenAnticipo.data;
            }
        }, function (error) {
            alertFactory.error("Error al obtener las cotizaciones de la orden");
        })
    }


    //obtiene el idCotizacion
    $scope.getIdCotizacion = function (idCotizacion, numeroCotizacion) {
        $scope.idCotizacionFactura = idCotizacion;
        $scope.numeroCotizacion = numeroCotizacion;
    }

    //obtiene el idCotizacion
    $scope.getCotizacion = function (idCotizacion, Total, existe, numeroCotizacion, idEstatus) {
        $scope.idCotizacionFactura = idCotizacion;
        $scope.totalCotizacionBD = Total;
        $scope.existeCotizacionFactura = existe;
        $scope.numeroCotizacion = numeroCotizacion;
        $scope.idEstatusTrabajo = idEstatus;
    }

    //  guardamos datos de la factura
    $scope.guardaDatosFactura = function (idCotizacion, numFactura, UUID, fechaFactura, total, subtotal, idUsuario, xmlFactura) {
            trabajoRepository.insertaFactura(idCotizacion, numFactura, UUID, fechaFactura, total, subtotal, idUsuario, xmlFactura).then(function (result) {
                if (result.data.length > 0) {
                    alertFactory.success("Registro Exitoso");
                }
            }, function (error) {
                alertFactory.error("Error al generar la prefactura");
            });
        }
        //eliminamos la factura de la ruta si no coincide el costo
    $scope.eliminaFactura = function (idTrabajo, idCotizacion, idOpcion) {
        trabajoRepository.removeFactura(idTrabajo, idCotizacion, idOpcion).then(function (orden) {
            if (orden.data.length > 0) {
                $scope.cotizacionesOrden = orden.data;
                //alertFactory.info("");
            }
        }, function (error) {
            alertFactory.error("Error al procesar la informacion");
        })
    }

    //LQMA add 20092016 renombra factura
    $scope.renombraFacturaTemporal = function (idTrabajo, idCotizacion) {
        trabajoRepository.renombraFacturaTemporal(idTrabajo, idCotizacion).then(function (orden) {
            if (orden.data.length > 0) {
                $scope.cotizacionesOrden = orden.data;
                //alertFactory.info("Cargue nuevamente la Factura");
            }
        }, function (error) {
            alertFactory.error("Error al procesar la informacion Temporal");
        })
    }

    $scope.cancelarOrden = function (idCita, numeroOrden) {
        swal({
                title: "Advertencia",
                text: "¿Está seguro en eliminar la orden: " + numeroOrden + "? ",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#67BF11",
                confirmButtonText: "Si",
                cancelButtonText: "No",
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function (isConfirm) {
                if (isConfirm) {
                    trabajoRepository.postEliminaOrden(numeroOrden).then(function (ordenEliminada) {
                        if (ordenEliminada.data[0].id > 0) {
                            alertFactory.success('Orden eliminada correctamente');
                            location.href = "/administracionordenes";
                        }
                    }, function (error) {
                        alertFactory.error("Error al eliminar la orden");
                    });
                }
            });
    }

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

});