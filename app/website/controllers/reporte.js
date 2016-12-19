var TrabajoView = require('../views/ejemploVista'),
    TrabajoModel = require('../models/dataAccess2'),
    moment = require('moment'),
    PDFDocument = require('pdfkit'),
    fecha = require("fecha");
var fs = require('fs');

fecha.i18n = {
    monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
}

var Reporte = function (conf) {
    this.conf = conf || {};

    this.view = new TrabajoView();
    this.model = new TrabajoModel({
        parameters: this.conf.parameters
    });

    this.response = function () {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    }
}

//obtiene los tipos de citas
Reporte.prototype.get_reportegral = function (req, res, next) {
    //Con req.query se obtienen los parametros de la url
    //Ejemplo: ?p1=a&p2=b
    //Retorna {p1:'a',p2:'b'}
    //Objeto que envía los parámetros
    //Referencia a la clase para callback
    var self = this;
    //Obtención de valores de los parámetros del request
    var params = [];

    this.model.query('SEL_REPORTE_GRAL_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

Reporte.prototype.get_conformidadpdf = function (req, res, next) {
    var object = {}; 
    var self = this;
    var montoOS = parseFloat(req.query.montoOS.replace(/[^0-9| ./]/g, ''));
    var params = [
        {
            name: 'numeroReporte',
            value: req.query.noReporte,
            type: self.model.types.STRING
        },
        {
            name: 'region',
            value: req.query.gerencia,
            type: self.model.types.STRING
        },
        {
            name: 'tad',
            value: req.query.tad,
            type: self.model.types.STRING
        },
        {
            name: 'solpe',
            value: req.query.solpe,
            type: self.model.types.STRING
        },
        {
            name: 'ordenSurtimiento',
            value: req.query.ordenSurtimiento,
            type: self.model.types.STRING
        },
        {
            name: 'montoOS',
            value: montoOS,
            type: self.model.types.DECIMAL
        },
        {
            name: 'nombreEmisor',
            value: '',
            type: self.model.types.STRING
        },
        {
            name: 'nombreProveedor',
            value: req.query.nombreProveedor,
            type: self.model.types.STRING
        },
        {
            name: 'puestoProveedor',
            value: req.query.puestoProveedor,
            type: self.model.types.STRING
        },
        {
            name: 'idTrabajo',
            value: req.query.idTrabajo,
            type: self.model.types.INT
        },
        {
            name: 'fechaGeneracion',
            value: req.query.fechaGeneracion,
            type: self.model.types.STRING
        }
    ];
    var data = {};
    var fechaFinal = Date.parse(req.query.fechaGeneracion + 'T10:20:30Z');
    data = {
        noReporte: req.query.noReporte,
        gerencia: req.query.gerencia,
        tad: req.query.tad,
        solpe: req.query.solpe,
        ordenSurtimiento: req.query.ordenSurtimiento,
        montoOS: req.query.montoOS,
        nombreEmisor: '',
        nombreProveedor: req.query.nombreProveedor,
        puestoProveedor: req.query.puestoProveedor,
        fecha: new Date(fechaFinal),
        idTrabajo: req.query.idTrabajo
    }

    this.model.query('SEL_ORDEN_DETALLE_SP', [params[9]], function (error, result) {
        if (result.length > 0) {
            data.data = result;
            var total = 0;
            for (var i in data.data) {
                total = total + (data.data[i].cantidad * data.data[i].importe);
            }
            data.total = "$ " + parseFloat(total).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","); + " M.N.";
            generateConfomidadReporte(data);

            setTimeout(function () {
                self.view.expositor(res, {
                    error: error,
                    result: 1
                });
            }, 2000);


            /*object.error = err;            
            object.result = 1;            
            self.view.expositor(res, object);*/
            /* self.model.query('SEL_EXISTE_CERTIFICADO_SP', params, function (error, result) {
                 if (result[0].existeCertificado > 0) {
                     console.log("Certificado existente");
                 } else {
                     console.log("Certificado creado");
                 }

                 object.error = err;            
                 object.result = 1;            
                 self.view.expositor(res, object);
             });*/
        }
    });
}

//Obtiene todas las citas no canceladas generadas para cierta unidad
Reporte.prototype.get_citasunidad = function (req, res, next) {
    //Con req.query se obtienen los parametros de la url
    //Ejemplo: ?p1=a&p2=b
    //Retorna {p1:'a',p2:'b'}
    //Objeto que envía los parámetros
    //Referencia a la clase para callback
    var self = this;
    //Obtención de valores de los parámetros del request
    var params = [
        {
            name: 'numeroEconomico',
            value: req.query.numeroEconomico,
            type: self.model.types.STRING
        }
    ];

    this.model.query('SEL_HISTORIAL_CITAS_UNIDAD_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//Obtiene todas las cotizaciones que no están canceladas generadas para cierta unidad
Reporte.prototype.get_cotizacionesunidad = function (req, res, next) {
    //Con req.query se obtienen los parametros de la url
    //Ejemplo: ?p1=a&p2=b
    //Retorna {p1:'a',p2:'b'}
    //Objeto que envía los parámetros
    //Referencia a la clase para callback
    var self = this;
    //Obtención de valores de los parámetros del request
    var params = [
        {
            name: 'numeroEconomico',
            value: req.query.numeroEconomico,
            type: self.model.types.STRING
        }
    ];

    this.model.query('SEL_HISTORIAL_COTIZACIONES_UNIDAD_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//Obtiene todas las órdenes que no están canceladas generadas para cierta unidad
Reporte.prototype.get_ordenesunidad = function (req, res, next) {
    //Con req.query se obtienen los parametros de la url
    //Ejemplo: ?p1=a&p2=b
    //Retorna {p1:'a',p2:'b'}
    //Objeto que envía los parámetros
    //Referencia a la clase para callback
    var self = this;
    //Obtención de valores de los parámetros del request
    var params = [
        {
            name: 'numeroEconomico',
            value: req.query.numeroEconomico,
            type: self.model.types.STRING
        }
    ];

    this.model.query('SEL_HISTORIAL_ORDENES_UNIDAD_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//Detalle Utilidad
Reporte.prototype.get_reporteUtilidad = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [
        {
            name: 'fechaInicio',
            value: req.query.fechaInicio,
            type: self.model.types.STRING
        },
        {
            name: 'fechaFin',
            value: req.query.fechaFin,
            type: self.model.types.STRING
        },
        {
            name: 'fechaMes',
            value: req.query.fechaMes,
            type: self.model.types.STRING
        },
        {
            name: 'rangoInicial',
            value: req.query.rangoInicial,
            type: self.model.types.STRING
        },
        {
            name: 'rangoFinal',
            value: req.query.rangoFinal,
            type: self.model.types.STRING
        },
        {
            name: 'zona',
            value: req.query.zona,
            type: self.model.types.STRING
        },
        {
            name: 'tar',
            value: req.query.tar,
            type: self.model.types.STRING
        },
        {
            name: 'idTipoCita',
            value: req.query.idTipoCita,
            type: self.model.types.STRING
        },
        {
            name: 'estatus',
            value: req.query.estatus,
            type: self.model.types.STRING
        },
        {
            name: 'numeroTrabajo',
            value: req.query.numeroTrabajo,
            type: self.model.types.STRING
        },
        {
            name: 'bandera',
            value: req.query.bandera,
            type: self.model.types.STRING
        }
    ];

    this.model.query('SEL_REPORTE_MARGEN_UTILIDAD_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}


//Reporte Certificado de Conformidad
Reporte.prototype.get_reporteCertificadoConformidad = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [
        {
            name: 'idZona',
            value: req.query.idZona,
            type: self.model.types.INT
        },
        {
            name: 'idTar',
            value: req.query.idTar,
            type: self.model.types.INT
        },
        {
            name: 'fechaInicial',
            value: req.query.fechaInicial,
            type: self.model.types.STRING
        },
        {
            name: 'fechaFinal',
            value: req.query.fechaFinal,
            type: self.model.types.STRING
        },
        {
            name: 'idUsuario',
            value: req.query.idUsuario,
            type: self.model.types.INT
        }

    ];

    this.model.query('SEL_REPORTE_CERTIFICADO_CONFORMIDAD_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}


module.exports = Reporte;

function generateConfomidadReporte(data) {
    var paginas = 0;
    var initTabla = 0;

    var doc = new PDFDocument({
        size: [612.00, 792.00],
        margin: 30
    })

    var dirCertificado = 'app/static/uploads/files/' + data.idTrabajo;
    if (!fs.existsSync(dirCertificado + '/documentos')) {
        fs.mkdirSync(dirCertificado + '/documentos');
    }
    
    if (!fs.existsSync(dirCertificado + '/documentos' + '/certificadoConformidad')) {
        fs.mkdirSync(dirCertificado + '/documentos' + '/certificadoConformidad');
    }

    doc.pipe(fs.createWriteStream(dirCertificado + '/documentos/certificadoConformidad/' + 'CConformidadOriginal.pdf'));

    /*doc.pipe(res)*/
    doc.fontSize(7)
    doc.lineWidth(1)

    doc.rect(30, 40, 570, 710).stroke()
    doc.rect(40, 50, 535, 690).stroke()

    doc.image('app/static/image/pemex_logo.png', 50, 55, {
        width: 90,
        height: 45
    })
    doc.text("FI-001", 290, 70)
    doc.text("\"REPORTE DE CONFORMIDAD \"", 255, 80)

    doc.text("ORGANISMO: PEMEX LOGISTICA", 50, 110)
    doc.text("GERENCIA: LOGISTICA REGIONAL " + data.gerencia, 50, 124)
    doc.text("SUBGERENCIA: OPERACION Y MANTTO DE TERMINALES", 50, 146)
    doc.text("SUPTCIA/DEPTO: Terminales de Almacenamieto y Despacho ", 50, 167)
    doc.text(data.tad, 50, 176)

    doc.rect(48, 107, 210, 12).stroke()
    doc.rect(48, 119, 210, 22).stroke()
    doc.rect(48, 141, 210, 22).stroke()
    doc.rect(48, 163, 210, 22).stroke()

    doc.text("CONTRATO: 5400027380 ", 50, 198)
    doc.text("SOLPE: " + data.solpe, 50, 210)
    doc.text("ORDEN DE SURTIMEINTO: " + data.ordenSurtimiento.trim(), 50, 222)
    doc.text("MONTO DEL CONTRATO: $382,427,879.00 M.N. ", 50, 234)
    doc.text("MONTO OS: " + data.montoOS, 50, 246)
    doc.text("PEDIDO ASOCIADO: " + data.data[0].noRemFac, 50, 258)

    doc.rect(48, 195, 180, 12).stroke()
    doc.rect(48, 207, 180, 12).stroke()
    doc.rect(48, 219, 180, 12).stroke()
    doc.rect(48, 231, 180, 12).stroke()
    doc.rect(48, 243, 180, 12).stroke()
    doc.rect(48, 255, 180, 12).stroke()

    doc.text("REPORTE No.  ___________________________", 400, 88)
    doc.text(data.noReporte, 470, 88)
    doc.text("LUGAR:  ________________________________________________________", 310, 110)
    doc.fontSize(4);
    doc.text("DIA                      MES                  AÑO", 485, 123)
    doc.fontSize(7);
    doc.text("CDMX", 400, 110)
    doc.text(fecha.format(data.fecha, 'DD           MMMM      YYYY'), 410, 110, {
        width: 220,
        align: 'center'
    })
    doc.text("FECHA RECIBO DE SOLICITUD DE INSPECCIÓN:  _____________________", 310, 132)
    doc.fontSize(4);
    doc.text("DIA                      MES                  AÑO", 485, 145)
    doc.fontSize(7);

    doc.text(fecha.format(data.fecha, 'DD           MMMM      YYYY'), 410, 132, {
        width: 220,
        align: 'center'
    })
    doc.text("FECHA DE FORMALIZACIÓN DEL CONTRATO:      _____________________", 310, 155)
    doc.fontSize(4);
    doc.text("DIA                      MES                  AÑO", 485, 168)
    doc.fontSize(7);
    doc.text("19        Mayo       2016", 485, 155)

    doc.text("FECHA DE RECEPCIÓN DE CONTRATO/S:             _____________________", 310, 177)
    doc.text("19        Mayo       2016", 485, 177)


    doc.rect(320, 195, 234, 12).stroke()
    doc.rect(320, 207, 234, 12).stroke()
    doc.rect(320, 219, 90, 12).stroke()
    doc.rect(410, 219, 144, 12).stroke()
    doc.rect(320, 231, 90, 12).stroke()
    doc.rect(410, 231, 144, 12).stroke()

    doc.text("RAZON SOCIAL", 415, 198)
    doc.text("Autoexpress Servicio de Excelencia Pedregal S.A de C.V.", 355, 210)
    doc.text("RFC", 485, 222)
    doc.text("CLAVE PROVEEDOR", 332, 222)

    doc.text("108074", 345, 234)
    doc.text("ASE0508051B6", 470, 234)

    doc.rect(48, 275, 30, 14).stroke()
    doc.rect(78, 275, 150, 14).stroke()
    doc.rect(228, 275, 30, 14).stroke()
    doc.rect(258, 275, 62, 14).stroke()
    doc.rect(320, 275, 62, 14).stroke()
    doc.rect(382, 275, 62, 14).stroke()
    doc.rect(444, 275, 110, 14).stroke()

    doc.fontSize(5);
    doc.text("PARTIDA O POSICIÓN", 50, 278, {
        width: 30
    })
    doc.text("DESCRIPCION DEL BIEN O SERVICIO", 80, 280, {
        width: 150,
        align: 'center'
    })
    doc.text("CANTIDAD", 228, 280, {
        width: 30,
        align: 'center'
    })
    doc.text("UNIDAD", 258, 280, {
        width: 62,
        align: 'center'
    })
    doc.text("NO. DE REMISIÓN Y/O FACTURA", 320, 278, {
        width: 62,
        align: 'center'
    })
    doc.text("FECHA DE INSPECCIÓN O SUPERVISIÓN", 382, 278, {
        width: 63,
        align: 'center'
    })
    doc.text("IMPORTE DE LOS INSPECCIONADO O SUPERVISADO", 444, 278, {
        width: 110,
        align: 'center'
    })

    doc.fontSize(7);
    var tableHeight = 0,
        extra = 0,
        extra = 0,
        top = 0,
        preTop = 0,
        skip = 8.2;
    var tablaInicial = 295,
        alturaTabla = 0,
        limiteTexto = 50;

    for (var i = 0; i < data.data.length; i++) {
        if (paginas > 0) {
            tablaInicial = 65;
            alturaTabla = 230;
            limiteTexto = 80;
        }
        preTop = Math.ceil(data.data[i].descripcion.length / 30)
        if (preTop + top > limiteTexto - 20) {
            doc.rect(48, 289 - alturaTabla, 30, 430 + alturaTabla).stroke()
            doc.rect(78, 289 - alturaTabla, 150, 430 + alturaTabla).stroke()
            doc.rect(228, 289 - alturaTabla, 30, 430 + alturaTabla).stroke()
            doc.rect(258, 289 - alturaTabla, 62, 430 + alturaTabla).stroke()
            doc.rect(320, 289 - alturaTabla, 62, 430 + alturaTabla).stroke()
            doc.rect(382, 289 - alturaTabla, 62, 430 + alturaTabla).stroke()
            doc.rect(444, 289 - alturaTabla, 110, 430 + alturaTabla).stroke()

            if (preTop + top > limiteTexto) {
                if (top < limiteTexto - 5) {
                    var nextText = data.data[i].descripcion.slice(data.data[i].descripcion.indexOf(" ", (limiteTexto - top) * 30))
                    data.data[i].descripcion = (data.data[i].descripcion.slice(0, data.data[i].descripcion.indexOf(" ", (limiteTexto - top) * 30)))
                    data.data.splice(i + 1, 0, {
                        descripcion: nextText,
                        partida: "",
                        cantidad: "",
                        unidad: "",
                        noRemFac: "",
                        fecha: "",
                        importe: ""
                    })
                } else {
                    top = 0;
                    paginas++;
                    doc.addPage();
                    doc.rect(30, 40, 570, 710).stroke()
                    doc.rect(40, 50, 535, 690).stroke()
                }
            }
        }
        doc.text(data.data[i].partida, 50, tablaInicial + (top * skip), {
            width: 25,
            align: 'center'
        })
        doc.text(data.data[i].descripcion.toUpperCase(), 85, tablaInicial + (top * skip), {
            width: 135,
            align: 'justify'
        })
        doc.text(data.data[i].cantidad, 228, tablaInicial + (top * skip), {
            width: 30,
            align: 'center'
        })
        doc.text(data.data[i].unidad, 258, tablaInicial + (top * skip), {
            width: 62,
            align: 'center'
        })
        doc.text(data.data[i].noRemFac, 320, tablaInicial + (top * skip), {
            width: 62,
            align: 'center'
        })
        doc.text(data.data[i].fecha == "" ? data.data[i].fecha : data.fecha.getDate() + '/' + (data.fecha.getMonth() + 1) + '/' + data.fecha.getFullYear(), 382, tablaInicial + (top * skip), {
            width: 63,
            align: 'center'
        })
        doc.text("$ " + parseFloat(data.data[i].cantidad * data.data[i].importe).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","), 444, tablaInicial + (top * skip), {
            width: 100,
            align: 'right'
        })
        if (preTop + top >= limiteTexto - 5) {
            top = 0;
            paginas++;
            doc.addPage();
            doc.rect(30, 40, 570, 710).stroke()
            doc.rect(40, 50, 535, 690).stroke()
        } else {
            top += Math.ceil(data.data[i].descripcion.length / 30) + 2
        }
    }
    var ajuste = 0;
    if (top > 0 || data.data.length == 0) {
        console.log(paginas)
        if (top > 55 || (top > 30 && paginas == 0)) {
            ajuste = 180;
        }
        doc.rect(48, 289 - alturaTabla, 30, 250 + alturaTabla + ajuste).stroke()
        doc.rect(78, 289 - alturaTabla, 150, 250 + alturaTabla + ajuste).stroke()
        doc.rect(228, 289 - alturaTabla, 30, 250 + alturaTabla + ajuste).stroke()
        doc.rect(258, 289 - alturaTabla, 62, 250 + alturaTabla + ajuste).stroke()
        doc.rect(320, 289 - alturaTabla, 62, 250 + alturaTabla + ajuste).stroke()
        doc.rect(382, 289 - alturaTabla, 62, 250 + alturaTabla + ajuste).stroke()
        doc.rect(444, 289 - alturaTabla, 110, 250 + alturaTabla + ajuste).stroke()
        if (top > 55 || (top > 30 && paginas == 0)) {
            paginas++;
            doc.addPage();
            doc.rect(30, 40, 570, 710).stroke()
            doc.rect(40, 50, 535, 690).stroke()
            extra = -480;
        }
    } else {
        extra = -480;

    }
    doc.rect(48, 539 + extra, 334, 12).stroke()
    doc.rect(382, 539 + extra, 62, 12).stroke()
    doc.rect(444, 539 + extra, 110, 12).stroke()
    doc.rect(48, 551 + extra, 334, 26).stroke()

    doc.fontSize(4);
    doc.text("DESCRIPCION DE CONFORMIDAD:", 50, 542 + extra)
    doc.fontSize(5);
    doc.text("*SE EXIME DE TODA RESPONSABILIDAD AL PERSONAL QUE EMITE ESTE REPORTE DE CONFORMIDAD," +
        "CUANDO A LA ENTREGA DE LOS BIENES, ARRENDAMIENTOS O SERVICIOS EN DESTINO FINAL O EN LA OPERACION" +
        "SE DETERMINEN FALTANTES, AVERÍAS, DISCREPANCIAS, ENTREGAS INCOMPLETAS, O SE DETECTEN FALLAS O VICIOS" +
        "OCUALTOS DE ACUERDO CON LO ESTABLECIDO EN EL CONTRATO.", 50, 554 + extra, {
            width: 330
        })
    doc.fontSize(7);
    doc.text("TOTAL", 382, 542 + extra, {
        width: 62,
        align: 'center'
    })
    doc.text(data.total, 444, 542 + extra, {
        width: 100,
        align: 'right'
    })
    if ( /*paginas == 0 && */ tableHeight > 270) {
        doc.text("SI LOS SELLOS EN ESTE DOCUMENTO NO ESTAN EN ORIGINAL, NO ES UN DOCUMENTO CONTROLADO", 30, 753)
        doc.addPage();
        doc.rect(30, 40, 570, 710).stroke()
        doc.rect(40, 50, 535, 690).stroke()
        extra = -520
    }
    doc.rect(48, 590 + extra, 272, 140).stroke()
    doc.rect(320, 590 + extra, 234, 140).stroke()
    doc.text("EMISIÓN POR PARTE DE PEMEX:", 50, 592 + extra, {
        width: 270,
        align: 'center'
    })
    doc.text("Jefe de mantenimiento de terminal", 50, 605 + extra, {
        width: 270,
        align: 'center'
    })
    doc.text("________________________________________________________________", 50, 625 + extra, {
        width: 270,
        align: 'center'
    })
    doc.text("Nombre y firma", 50, 633 + extra, {
        width: 270,
        align: 'center'
    })
    doc.text("Fecha  __________________________________________________________", 50, 648 + extra, {
        width: 270,
        align: 'center'
    })
    doc.text(fecha.format(data.fecha, 'DD  MMMM  YYYY'), 55, 647 + extra, {
        width: 270,
        align: 'center'
    })

    doc.text("Superintendente de terminal", 50, 660 + extra, {
        width: 270,
        align: 'center'
    })
    doc.text("________________________________________________________________", 50, 678 + extra, {
        width: 270,
        align: 'center'
    })
    doc.text("Nombre y firma", 50, 686 + extra, {
        width: 270,
        align: 'center'
    })
    doc.text("Fecha  __________________________________________________________", 50, 700 + extra, {
        width: 270,
        align: 'center'
    })
    doc.text(fecha.format(data.fecha, 'DD  MMMM  YYYY'), 55, 698 + extra, {
        width: 270,
        align: 'center'
    })




    doc.fontSize(5);

    doc.text("SELLO: (cuando aplique)", 55, 710 + extra)
    doc.fontSize(7);
    doc.text(data.nombreEmisor, 100, 625 + extra, {
        width: 220,
        align: 'center'
    })
    doc.text("ACEPTACIÓN DEL PROVEEDOR:", 325, 592 + extra, {
        width: 230,
        align: 'center'
    })

    doc.image('app/static/image/firma.png', 400, 600 + extra, {
        width: 90,
        height: 45
    });

    doc.text("Nombre y firma ________________________________________", 326, 650 + extra)
    doc.text("Fecha                    ________________________________________", 326, 668 + extra)
    doc.text("Puesto                 ________________________________________", 326, 684 + extra)

    doc.text(data.nombreProveedor, 340, 650 + extra, {
        width: 220,
        align: 'center'
    })
    doc.text(fecha.format(data.fecha, 'DD  MMMM  YYYY'), 340, 668 + extra, {
        width: 220,
        align: 'center'
    })
    doc.text(data.puestoProveedor, 340, 684 + extra, {
        width: 220,
        align: 'center'
    })
    doc.fontSize(5);
    doc.text("*ESTE REPORTE TIENE UNA VIGENCIA DE 15 DIAS CALENDARIO A PARTIR DE SU EXPEDICIÓN", 50, 735 + extra)
    doc.fontSize(7);
    doc.text("SI LOS SELLOS EN ESTE DOCUMENTO NO ESTAN EN ORIGINAL, NO ES UN DOCUMENTO CONTROLADO", 30, 753)


    doc.end();

}