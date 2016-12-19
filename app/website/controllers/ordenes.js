var OrdenView = require('../views/ejemploVista'),
    OrdenModel = require('../models/dataAccess2');

var mkdirp = require('mkdirp');
var fs = require('fs'),
    xml2js = require('xml2js');
var numeroCotizacion = '';

var dirname = 'C:/Produccion/Talleres/talleres-v2-pemex/app/static/uploads/files/';
var dirCopades = 'C:/Produccion/Talleres/talleres-v2-pemex/app/static/uploads/copades/';


var Orden = function (conf) {
    this.conf = conf || {};

    this.view = new OrdenView();
    this.model = new OrdenModel({
        parameters: this.conf.parameters
    });

    this.response = function () {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    }
}

//Obtiene las ordenes pendientes por cobrar
Orden.prototype.get_ordenesporcobrar = function (req, res, next) {
    var self = this;
    var params = [{
        name: 'monto',
        value: req.query.monto,
        type: self.model.types.INT
        }];

    this.model.query('SEL_ORDENES_POR_COBRAR_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//Actualiza el estatus de una órden - cobrada
Orden.prototype.post_trabajocobrado = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [{
            name: 'idTrabajo',
            value: req.body.idTrabajo,
            type: self.model.types.STRING
        },
        {
            name: 'idDatosCopade',
            value: req.body.idDatosCopade,
            type: self.model.types.INT
        }];

    this.model.post('INS_TRABAJO_CONCLUIDO_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

//Devuelve los trabajos cobrados y listos para facturar
Orden.prototype.get_prefacturas = function (req, res, next) {
        //Objeto que almacena la respuesta
        var object = {};
        //Referencia a la clase para callback
        var self = this;
        //Objeto que envía los parámetros
        var params = [{
            name: 'idUsuario',
            value: req.query.idUsuario,
            type: self.model.types.INT
        }];

    this.model.query('SEL_TRABAJOS_COBRADOS_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//Genera el TXT de un trabajo cobrado
Orden.prototype.get_generaTxtFactura = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Referencia a la clase para callback
    var self = this;
    //Objeto que envía los parámetros
    var paramsTipoOrden = [{
        name: 'idTrabajo',
        value: req.query.idTrabajo,
        type: self.model.types.INT
        }];

    //Identifica el tipo de orden de servicio 
    self.model.query('SEL_TIPO_ORDEN_SERVICIO_SP', paramsTipoOrden, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;
        if (result.length > 0) {
            // if (result[0].tipoOrdenServicio == 'SER') {
            var directorioFactura = dirname + req.query.idTrabajo + '/documentos/factura';
            var files = fs.readdirSync(directorioFactura);
            var fecha, numFactura, uuid, nombreXml, totalFactura;

            var existeFacturaXML = files.some(checkExistsXML);
            if (existeFacturaXML) {
                files.forEach(function (file) {
                    var extension = obtenerExtArchivo(file);
                    if (extension == '.xml' || extension == '.XML') {
                        if (file.includes('Factura')) {
                            var parser = new xml2js.Parser();
                            fs.readFile(directorioFactura + '/' + file, function (err, data) {
                                parser.parseString(data, function (err, result) {
                                    fecha = result['cfdi:Comprobante'].$['fecha'];
                                    if ((result['cfdi:Comprobante'].$['serie'] == undefined || result['cfdi:Comprobante'].$['serie'] == '') &&
                                        (result['cfdi:Comprobante'].$['folio'] == undefined ||
                                            result['cfdi:Comprobante'].$['folio'] == ''
                                        )) {
                                        numFactura = result['cfdi:Comprobante']['cfdi:Complemento'][0]['tfd:TimbreFiscalDigital'][0].$['UUID'];
                                    } else if (result['cfdi:Comprobante'].$['serie'] == undefined || result['cfdi:Comprobante'].$['serie'] == '') {
                                        numFactura = result['cfdi:Comprobante'].$['folio'];
                                    } else {
                                        numFactura = result['cfdi:Comprobante'].$['serie'] + result['cfdi:Comprobante'].$['folio'];
                                    }
                                    uuid = result['cfdi:Comprobante']['cfdi:Complemento'][0]['tfd:TimbreFiscalDigital'][0].$['UUID'];

                                    totalFactura = result['cfdi:Comprobante'].$['total'];
                                    var nombreXml = file;

                                    console.log('Fecha: ' + fecha);
                                    console.log('Factura: ' + numFactura);
                                    console.log('UUID: ' + uuid);
                                    console.log('Nombre Xml: ' + nombreXml);
                                    console.log('=========================')

                                    var paramsSER = [{
                                            name: 'idTrabajo',
                                            value: req.query.idTrabajo,
                                            type: self.model.types.INT
                                                },
                                        {
                                            name: 'fecha',
                                            value: fecha,
                                            type: self.model.types.STRING
                                                },
                                        {
                                            name: 'numFactura',
                                            value: numFactura,
                                            type: self.model.types.STRING
                                                },
                                        {
                                            name: 'UUID',
                                            value: uuid,
                                            type: self.model.types.STRING
                                                },
                                        {
                                            name: 'XML',
                                            value: nombreXml,
                                            type: self.model.types.STRING
                                            },
                                        {
                                            name: 'totalFactura',
                                            value: totalFactura,
                                            type: self.model.types.DECIMAL
                                            }
                                        ];
                                    getDatosFactura(res, self, 'SEL_FACTURA_TXT_SP', paramsSER);
                                });
                            });
                        }
                    }
                });
            } else {
                res.end('');
            }
            console.log(result[0].tipoOrdenServicio);
            /*            } else if (result[0].tipoOrdenServicio == 'REF') {
                            getDatosFactura(res, self, 'SEL_FACTURA_TXT_SP', paramsTipoOrden);
                            console.log(result[0].tipoOrdenServicio);
                        }*/
        } else {
            res.end('');
        }
    });
};

//Obtiene datos factura y generar el txt
function getDatosFactura(res, self, stored, params) {
    //Objeto que almacena la respuesta
    var object = {};
    self.model.query(stored, params, function (error, result) {
        if (result.length > 0) {
            self.model.query('SEL_FACTURA_TXT_SP', params, function (error, result) {
                //Callback
                object.error = error;
                object.result = result;

                var wstream = fs.createWriteStream('C:/Produccion/Talleres/talleres-v2-pemex/app/static/facturas/factura-' + result[0].numeroTrabajo + '.txt', 'utf8');
                if (wstream) {
                    var carrito = '';
                    var lineToInsert = '';
                    for (var i = 0; i < result.length; i++) {
                        lineToInsert = result[i].dato.replace(/[^a-zA-Z0-9| ./-]/g, ' ');
                        carrito = (result.length - i) == 1 ? '' : '\r\n';
                        wstream.write(lineToInsert + carrito);
                    }
                    wstream.end(function () {
                        console.log('done');
                    });
                }
                self.view.expositor(res, object);
            });
        }
    });
};

//Se obtiene la extensión del archivo
var obtenerExtArchivo = function (file) {
    return '.' + file.split('.').pop();
}

//valida si existe al menos un archivo xml
function checkExistsXML(file) {
    return file.split('.').pop() === 'xml' || file.split('.').pop() === 'XML';
}

//URIEL
//Obtiene las copades que aún no han sido asignadas
Orden.prototype.get_copades = function (req, res, next) {
    var self = this;
    var params = [];

    this.model.query('SEL_COPADES_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//Lee la copade xml, y devuelve todo en un Array para después almacenarlos en bd

Orden.prototype.post_generaDatosCopade = function (req, res, next) {  //Objeto que almacena la respuesta
      
    var object = {};   //Objeto que envía los parámetros
      
    var params = [];   //Referencia a la clase para callback
      
    var self = this;

      
    var nombreArchivos = [];
    nombreArchivos = req.body.archivos;  
    var fechaRecepcionCopade = req.body.fechaRecepcionCopade; 
    var subTotal, total, moneda, cantidad, descripcion, importeConcepto, unidad, valorUnitario, totalImpuestosRetenidos, totalImpuestosTrasladados, impuesto, importeTraslado, tasa;
    var contrato, ordenSurtimiento, numeroEstimacion, numeroAcreedor, gestor, finiquito, posicionap, numeroCopade, ejercicio, xmlCopade, i;
    var objCopade = [];
    var paramValuesCopade = [];

      
    nombreArchivos.forEach(function (file, i) {    
        var extension = obtenerExtArchivo(file);    
        if (extension == '.xml' || extension == '.XML') {      
            var parser = new xml2js.Parser();      
            fs.readFile(dirCopades + file, 'utf8', function (err, data) {        
                parser.parseString(data, function (err, lector) {          
                    subTotal = lector['PreFactura']['Comprobante'][0].$['subtotal'];    
                    total = lector['PreFactura']['Comprobante'][0].$['total']; 
                    moneda = lector['PreFactura']['Comprobante'][0].$['moneda']; 
                    cantidad = lector['PreFactura']['Comprobante'][0]['Conceptos'][0]['Concepto'][0].$['cantidad']; 
                    descripcion = lector['PreFactura']['Comprobante'][0]['Conceptos'][0]['Concepto'][0].$['descripcion']; 
                    importeConcepto = lector['PreFactura']['Comprobante'][0]['Conceptos'][0]['Concepto'][0].$['importe']; 
                    unidad = lector['PreFactura']['Comprobante'][0]['Conceptos'][0]['Concepto'][0].$['unidad']; 
                    valorUnitario = lector['PreFactura']['Comprobante'][0]['Conceptos'][0]['Concepto'][0].$['valorUnitario']; 
                    totalImpuestosRetenidos = lector['PreFactura']['Comprobante'][0]['Impuestos'][0].$['totalImpuestosRetenidos']
                    totalImpuestosTrasladados = lector['PreFactura']['Comprobante'][0]['Impuestos'][0].$['totalImpuestosTrasladados']
                    impuesto = lector['PreFactura']['Comprobante'][0]['Impuestos'][0]['Traslados'][0]['Traslado'][0].$['impuesto']; 
                    importeTraslado = lector['PreFactura']['Comprobante'][0]['Impuestos'][0]['Traslados'][0]['Traslado'][0].$['importe']; 
                    tasa = lector['PreFactura']['Comprobante'][0]['Impuestos'][0]['Traslados'][0]['Traslado'][0].$['tasa']; 

                    contrato = lector['PreFactura']['cfdi:Addenda'][0]['pm:Addenda_Pemex'][0]['pm:CONTRATO'][0];          
                    ordenSurtimiento = lector['PreFactura']['cfdi:Addenda'][0]['pm:Addenda_Pemex'][0]['pm:O_SURTIMIENTO'][0]; 

                    try {
                        numeroEstimacion = lector['PreFactura']['cfdi:Addenda'][0]['pm:Addenda_Pemex'][0]['pm:N_ESTIMACION'][0]; 
                    } catch (error) {
                        console.log('No hay número de estimación');
                        console.log(error)
                        numeroEstimacion = '';
                    }

                    numeroAcreedor = lector['PreFactura']['cfdi:Addenda'][0]['pm:Addenda_Pemex'][0]['pm:N_ACREEDOR'][0];          
                    gestor = lector['PreFactura']['cfdi:Addenda'][0]['pm:Addenda_Pemex'][0]['pm:C_GESTOR'][0]; 
                    finiquito = lector['PreFactura']['cfdi:Addenda'][0]['pm:Addenda_Pemex'][0]['pm:FINIQUITO'][0]; 
                    posicionap = lector['PreFactura']['cfdi:Addenda'][0]['pm:Addenda_Pemex'][0]['pm:POSICIONAP'][0];          
                    numeroCopade = lector['PreFactura']['cfdi:Addenda'][0]['pm:Addenda_Pemex'][0]['pm:ENTRADA'][0]; 
                    ejercicio = lector['PreFactura']['cfdi:Addenda'][0]['pm:Addenda_Pemex'][0]['pm:EJERCICIO'][0]; 
                    xmlCopade = data;                
                    objCopade = {            
                        subTotal: subTotal,
                        total: total,
                        moneda: moneda,
                        cantidad: cantidad,
                        descripcion: descripcion,
                        importeConcepto: importeConcepto,
                        unidad: unidad,
                        valorUnitario: valorUnitario,
                        totalImpuestosRetenidos: totalImpuestosRetenidos,
                        totalImpuestosTrasladados: totalImpuestosTrasladados,
                        impuesto: impuesto,
                        importeTraslado: importeTraslado,
                        tasa: tasa,
                        contrato: contrato,
                        ordenSurtimiento: ordenSurtimiento,
                        numeroEstimacion: numeroEstimacion,
                        numeroAcreedor: numeroAcreedor,
                        gestor: gestor,
                        finiquito: finiquito,
                        posicionap: posicionap,
                        numeroCopade: numeroCopade,
                        ejercicio: ejercicio,
                        fechaRecepcionCopade: fechaRecepcionCopade,
                        xmlCopade: xmlCopade          
                    };                    

                    paramValuesCopade.push(objCopade);       
                    // if ((nombreArchivos.length - i) == 1) {            
                    object.error = err;            
                    object.result = paramValuesCopade;            
                    self.view.expositor(res, object);
                    nombreArchivos = [];
                    paramValuesCopade = [];          
                    //} 
                });      
            });    
        }  
    });
}

Orden.prototype.get_getCoincidenciaMejor = function (req, res, next) {
    var self = this;
    var params = [{
            name: 'folio',
            value: req.query.folio,
            type: self.model.types.STRING
        },
        {
            name: 'monto',
            value: req.query.monto,
            type: self.model.types.INT
        }];

    this.model.query('SEL_MEJOR_COINCIDENCIA_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//obtiene todas las órdenes de servicio que no están canceladas, pero están auntorizadas
Orden.prototype.get_getadmonordenes = function (req, res, next) {
    var self = this;
    var params = [{
        name: 'numeroTrabajo',
        value: req.query.numeroTrabajo,
        type: self.model.types.STRING
        },
        {
        name: 'idUsuario',
        value: req.query.idUsuario,
        type: self.model.types.INT
        }];

    this.model.query('SEL_ADMINISTRACION_ORDENES_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//obtiene el detalle de la orden
Orden.prototype.get_getdetalleorden = function (req, res, next) {
    var self = this;
    var params = [{
        name: 'idTrabajo',
        value: req.query.idTrabajo,
        type: self.model.types.INT
        }];

    this.model.query('SEL_DETALLE_COTIZACIONES_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//obtiene todas las órdenes de servicio que no están canceladas, pero están auntorizadas
Orden.prototype.get_getaprobacionutilidad = function (req, res, next) {
    var self = this;

    this.model.query('SEl_APROBACION_UTILIDAD_SP', "", function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}
 
 //obtiene todas las órdenes en espera de aprobación de provisión
Orden.prototype.get_getaprobacionprovision = function (req, res, next) {
    var self = this;

    this.model.query('SEL_APROBACION_PROVISION_SP', "", function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//Valiada si ya se encuentra procesada la orden 
Orden.prototype.get_getordenservicio = function (req, res, next) {
    var self = this;
    var params = [{
        name: 'orden',
        value: req.query.orden,
        type: self.model.types.STRING
        }];

    this.model.query('SEL_ORDEN_SERVICIO_DETALLE_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//Valiada si ya se encuentra procesada la orden 
Orden.prototype.get_getservicio = function (req, res, next) {
    var self = this;
    var params = [{
        name: 'orden',
        value: req.query.orden,
        type: self.model.types.STRING
        }];

    this.model.query('SEL_ORDEN_SERVICIO_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//Inserta los datos de aprobacion de utilidad en db
Orden.prototype.post_insertaDatosAprobacionUtilidad = function (req, res, next) { 
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [
        {
            name: 'idTrabajo',
            value: req.body.idTrabajo,
            type: self.model.types.DECIMAL
        },
        {
            name: 'idUsuario',
            value: req.body.idUsuario,
            type: self.model.types.DECIMAL
        },
        {
            name: 'tipoAprobacion',
            value: req.body.tipoAprobacion,
            type: self.model.types.DECIMAL
        },
        {
            name: 'margen',
            value: req.body.margen,
            type: self.model.types.DECIMAL
        },
        {
            name: 'observacionTrabajo',
            value: req.body.observacionTrabajo,
            type: self.model.types.STRING
        }]; 

    this.model.post('INS_DATOS_APROBACION_UTILIDAD_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//obtiene el estatus de una utilidad registrada 
Orden.prototype.get_getestatusutilidad = function (req, res, next) {
    var self = this;
    var params = [{
        name: 'idTrabajo',
        value: req.query.idTrabajo,
        type: self.model.types.STRING
        },
        {
        name: 'tipoAprobacion',
        value: req.query.tipoAprobacion,
        type: self.model.types.DECIMAL
        }];

    this.model.query('[SEL_ESTATUS_APROBACION_UTILIDAD_SP]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//obtiene parametro de %
Orden.prototype.get_getparametro = function (req, res, next) {
        var self = this;
        var params = [{
                name: 'idTipo',
                value: req.query.idTipo,
                type: self.model.types.INT
    },
            {
                name: 'nombre',
                value: req.query.nombre,
                type: self.model.types.STRING
    }];

        this.model.query('[SEL_PARAMETROS_SP]', params, function (error, result) {
            self.view.expositor(res, {
                error: error,
                result: result
            });
        });
    }
    //Inserta los datos de aprobacion de utilidad  respuesta en db y actualiza estatus
Orden.prototype.post_insertaDatosAprobacionUtilidadRespuesta = function (req, res, next) { 
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [
        {
            name: 'idAprobacionUtilidad',
            value: req.body.idAprobacionUtilidad,
            type: self.model.types.DECIMAL
        },
        {
            name: 'idUsuario',
            value: req.body.idUsuario,
            type: self.model.types.DECIMAL
        },
        {
            name: 'token',
            value: req.body.token,
            type: self.model.types.STRING
        }]; 

    this.model.post('[PROC_RESPUESTA_APROBACION_UTILIDAD_SP]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

    //Inserta los datos de aprobacion de utilidad  respuesta en db y actualiza estatus
Orden.prototype.post_aprobacionprovision = function (req, res, next) { 
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [
        {
            name: 'idTrabajo',
            value: req.body.idTrabajo,
            type: self.model.types.INT
        },
        {
            name: 'idUsuario',
            value: req.body.idUsuario,
            type: self.model.types.INT
        }]; 

    this.model.post('[UPD_APROBACION_PROVISION_SP]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//obtiene estatus de token
Orden.prototype.get_estatusToken = function (req, res, next) {
    var self = this;
    var params = [{
        name: 'token',
        value: req.query.token,
        type: self.model.types.STRING
    }];

    this.model.query('[SEL_TOKEN_SP]', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//obtiene todas las órdenes de servicio que no están canceladas, pero están auntorizadas
Orden.prototype.post_mueveCierreOrden = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [{
        name: 'idTrabajo',
        value: req.body.idTrabajo,
        type: self.model.types.INT
        }];

    this.model.post('UPD_TRABAJO_CIERRE_ORDEN_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

//Inserta los datos de la copade en bd
Orden.prototype.post_insertaDatosCopade = function (req, res, next) { 
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [
        {
            name: 'subTotal',
            value: req.body[0].subTotal,
            type: self.model.types.DECIMAL
        },
        {
            name: 'total',
            value: req.body[0].total,
            type: self.model.types.DECIMAL
        },
        {
            name: 'moneda',
            value: req.body[0].moneda,
            type: self.model.types.STRING
        },
        {
            name: 'cantidad',
            value: req.body[0].cantidad,
            type: self.model.types.DECIMAL
        },
        {
            name: 'descripcion',
            value: req.body[0].descripcion,
            type: self.model.types.STRING
        },
        {
            name: 'importeConcepto',
            value: req.body[0].importeConcepto,
            type: self.model.types.DECIMAL
        },
        {
            name: 'unidad',
            value: req.body[0].unidad,
            type: self.model.types.STRING
        },
        {
            name: 'valorUnitario',
            value: req.body[0].valorUnitario,
            type: self.model.types.DECIMAL
        },
        {
            name: 'totalImpuestosRetenidos',
            value: req.body[0].totalImpuestosRetenidos,
            type: self.model.types.DECIMAL
        },
        {
            name: 'totalImpuestosTrasladados',
            value: req.body[0].totalImpuestosTrasladados,
            type: self.model.types.DECIMAL
        },
        {
            name: 'impuesto',
            value: req.body[0].impuesto,
            type: self.model.types.STRING
        },
        {
            name: 'importeTraslado',
            value: req.body[0].importeTraslado,
            type: self.model.types.DECIMAL
        },
        {
            name: 'tasa',
            value: req.body[0].tasa,
            type: self.model.types.DECIMAL
        },
        {
            name: 'contrato',
            value: req.body[0].contrato,
            type: self.model.types.STRING
        },
        {
            name: 'ordenSurtimiento',
            value: req.body[0].ordenSurtimiento,
            type: self.model.types.STRING
        },
        {
            name: 'numeroEstimacion',
            value: req.body[0].numeroEstimacion,
            type: self.model.types.STRING
        },
        {
            name: 'numeroAcreedor',
            value: req.body[0].numeroAcreedor,
            type: self.model.types.STRING
        },
        {
            name: 'gestor',
            value: req.body[0].gestor,
            type: self.model.types.STRING
        },
        {
            name: 'finiquito',
            value: req.body[0].finiquito,
            type: self.model.types.STRING
        },
        {
            name: 'posicionap',
            value: req.body[0].posicionap,
            type: self.model.types.STRING
        },
        {
            name: 'numeroCopade',
            value: req.body[0].numeroCopade,
            type: self.model.types.STRING
        },
        {
            name: 'ejercicio',
            value: req.body[0].ejercicio,
            type: self.model.types.STRING
        },
        {
            name: 'fechaRecepcionCopade',
            value: req.body[0].fechaRecepcionCopade,
            type: self.model.types.STRING
        },
        {
            name: 'xmlCopade',
            value: req.body[0].xmlCopade,
            type: self.model.types.STRING
        }
    ]; 

    this.model.post('INS_DATOS_COPADE_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

//Actualiza el precio de una partida desde la orden de servicio
Orden.prototype.post_precioEditado = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [
        {
            name: 'idCotizacion',
            value: req.body.idCotizacion,
            type: self.model.types.INT
        },
        {
            name: 'idPartida',
            value: req.body.idPartida,
            type: self.model.types.INT
        },
        {
            name: 'nuevoPrecio',
            value: req.body.nuevoPrecio,
            type: self.model.types.DECIMAL
        },
    ];

    this.model.post('UPD_PRECIO_PARTIDA_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

//Renombra el nombre de la copade con su identity 
Orden.prototype.post_cambiaNombreCopade = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var nombreArchivos = req.body.nombreCopade;
    var identificador = req.body.idCopade[0].id;

    nombreArchivos.forEach(function (nombre) {
        var extension = obtenerExtArchivo(nombre);
        if (extension == '.pdf' || extension == '.PDF') {
            var modificacion = fs.renameSync(dirCopades + nombre, dirCopades + 'COPADE_' + identificador + extension);
        }
        if (extension == '.xml' || extension == '.XML') {
            var modificacion = fs.renameSync(dirCopades + nombre, dirCopades + 'COPADE_' + identificador + extension);
        }
    });

    object.error = null;            
    object.result = 1;            
    self.view.expositor(res, object);

}

//LQMA ADD 20092016 , renombra archivo tempora a original, quitando "temp"
Orden.prototype.post_renombraFacturaTemporal = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var idCotizacion = req.body.idCotizacion;
    var idTrabajo = req.body.idTrabajo;

    var directorioFactura = dirname + idTrabajo + '/' + idCotizacion + '/documentos/factura';

    var files = fs.readdirSync(directorioFactura);

    files.forEach(function (file) {
        fs.renameSync(directorioFactura + '/' + file, directorioFactura + '/' + file.replace('temp', ''));
    });
    //Callback
    object.error = null;
    object.result = 1;

    self.view.expositor(res, object);
}

//Quita la copade de la carpeta 'copades' y la pone en su respectiva orden de servicio 'idTrabajo/documentos/adendaCopade'
Orden.prototype.post_mueveCopade = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var idTrabajo = req.body.idTrabajo;
    var idTrabajos = req.body.idTrabajo;
    var idCopade = req.body.idDatosCopade;

    var trabajos = idTrabajos.split(',');

    var nombreXmlMinusculas = 'COPADE_' + idCopade + '.xml';
    var nombreXmlMayusculas = 'COPADE_' + idCopade + '.XML';
    var nombrePdfMinusculas = 'COPADE_' + idCopade + '.pdf';
    var nombrePdfMayusculas = 'COPADE_' + idCopade + '.PDF';


    trabajos.forEach(function (idTrabajo) {
        if (idTrabajo != '' && idTrabajo != null && idTrabajo != undefined) {
            var rutaDestino = dirname + idTrabajo + '/documentos/adendaCopade';

            if (!fs.existsSync(rutaDestino)) {
                fs.mkdirSync(rutaDestino);
            }

            if (fs.existsSync(dirCopades + nombreXmlMinusculas)) {
                fs.createReadStream(dirCopades + nombreXmlMinusculas).pipe(fs.createWriteStream(rutaDestino + '/' + nombreXmlMinusculas));
                //fs.renameSync(dirCopades + nombreXmlMinusculas, rutaDestino + '/' + nombreXmlMinusculas);
            }
            if (fs.existsSync(dirCopades + nombreXmlMayusculas)) {
                fs.createReadStream(dirCopades + nombreXmlMayusculas).pipe(fs.createWriteStream(rutaDestino + '/' + nombreXmlMayusculas));
                //fs.renameSync(dirCopades + nombreXmlMayusculas, rutaDestino + '/' + nombreXmlMayusculas);
            }
            if (fs.existsSync(dirCopades + nombrePdfMinusculas)) {
                fs.createReadStream(dirCopades + nombrePdfMinusculas).pipe(fs.createWriteStream(rutaDestino + '/' + nombrePdfMinusculas));
                //fs.renameSync(dirCopades + nombrePdfMinusculas, rutaDestino + '/' + nombrePdfMinusculas);
            }
            if (fs.existsSync(dirCopades + nombrePdfMayusculas)) {
                fs.createReadStream(dirCopades + nombrePdfMayusculas).pipe(fs.createWriteStream(rutaDestino + '/' + nombrePdfMayusculas));
                //fs.renameSync(dirCopades + nombrePdfMayusculas, rutaDestino + '/' + nombrePdfMayusculas);
            }
        }
    });

    //Elimina la COPADE original
    /*if (fs.existsSync(dirCopades + nombreXmlMinusculas)) {
        fs.unlinkSync(dirCopades + nombreXmlMinusculas);
    }

    if (fs.existsSync(dirCopades + nombreXmlMayusculas)) {
        fs.unlinkSync(dirCopades + nombreXmlMayusculas);
    }

    if (fs.existsSync(dirCopades + nombrePdfMinusculas)) {
        fs.unlinkSync(dirCopades + nombrePdfMinusculas);
    }

    if (fs.existsSync(dirCopades + nombrePdfMayusculas)) {
        fs.unlinkSync(dirCopades + nombrePdfMayusculas);
    } */


    //Callback
    object.error = null;
    object.result = 1;

    self.view.expositor(res, object);
}

//Obtiene las copades que aún no han sido asignadas
Orden.prototype.get_ordenesverificadas = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Referencia a la clase para callback
    var self = this;
    //Objeto que envía los parámetros
    var params = [{
            name: 'idUsuario',
            value: req.query.idUsuario,
            type: self.model.types.INT
        }];

    this.model.query('SEL_ORDEN_VERIFICADA_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

Orden.prototype.get_generaFactura = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Referencia a la clase para callback
    var self = this;
    //Objeto que envía los parámetros
    var paramsTipoOrden = [{
            name: 'idTrabajo',
            value: req.query.idTrabajo,
            type: self.model.types.INT
        },
        {
            name: 'idCotizacion',
            value: req.query.idCotizacion,
            type: self.model.types.INT
        },
        {
            name: 'idUsuario',
            value: req.query.idUsuario,
            type: self.model.types.INT
        }];

    //LQMA add 19092016, si idEstatus = 12, se lee el archivo temporal
    var numeroCotizacion = req.query.numeroCotizacion;

    var aux = 0;

    var directorioFactura = dirname + req.query.idTrabajo + '/' + req.query.idCotizacion + '/documentos/factura';
    var files = fs.readdirSync(directorioFactura);
    var fechaFactura, numFactura, uuid, xmlFactura, total, subtotal;
    var paramsFactura = [];

    var existeFacturaXML = files.some(checkExistsXML);
    if (existeFacturaXML) {
        files.forEach(function (file) {
            var extension = obtenerExtArchivo(file);
            if (extension == '.xml' || extension == '.XML') {
                if (file.includes('Factura')) {
                    posicion = file.indexOf('temp')
                    if (posicion != -1) {
                        //LQMA ADD 19092016 leer del archivo temporal para validar 
                        //if(idEstatus == 12) 
                        //if (file.includes('Factura_' + numeroCotizacion + 'temp.XML' ||  'Factura_' + numeroCotizacion + 'temp.xml')){
                        //      file = file.indexOf('temp') >= 0?file.replace('.XML','temp.XML'):file.replace('.xml','temp.xml');
                        //   }
                        var parser = new xml2js.Parser();
                        fs.readFile(directorioFactura + '/' + file, 'utf8', function (err, data) {
                            parser.parseString(data, function (err, result) {
                                fechaFactura = result['cfdi:Comprobante'].$['fecha'];
                                if ((result['cfdi:Comprobante'].$['serie'] == undefined || result['cfdi:Comprobante'].$['serie'] == '') &&
                                    (result['cfdi:Comprobante'].$['folio'] == undefined ||
                                        result['cfdi:Comprobante'].$['folio'] == ''
                                    )) {
                                   numFactura = result['cfdi:Comprobante']['cfdi:Complemento'][0]['tfd:TimbreFiscalDigital'][0].$['UUID'];
                                var values = numFactura.split('-');
                                var tamaño = values.length;
                                numFactura = values[tamaño-1];
                                } else if (result['cfdi:Comprobante'].$['serie'] == undefined || result['cfdi:Comprobante'].$['serie'] == '') {
                                    numFactura = result['cfdi:Comprobante'].$['folio'];
                                } else {
                                    numFactura = result['cfdi:Comprobante'].$['serie'] + result['cfdi:Comprobante'].$['folio'];
                                }
                                uuid = result['cfdi:Comprobante']['cfdi:Complemento'][0]['tfd:TimbreFiscalDigital'][0].$['UUID'];
                                total = result['cfdi:Comprobante'].$['total'];
                                subtotal = result['cfdi:Comprobante'].$['subTotal'];
                                xmlFactura = data;
                                //var xmlFactura = file;

                                console.log('Fecha: ' + fechaFactura);
                                console.log('Factura: ' + numFactura);
                                console.log('UUID: ' + uuid);
                                console.log('=========================')

                                paramsFactura = [{
                                        name: 'idCotizacion',
                                        value: req.query.idCotizacion,
                                        type: self.model.types.INT
                                                },
                                    {
                                        name: 'numFactura',
                                        value: numFactura,
                                        type: self.model.types.STRING
                                                },
                                    {
                                        name: 'UUID',
                                        value: uuid,
                                        type: self.model.types.STRING
                                                },
                                    {
                                        name: 'fechaFactura',
                                        value: fechaFactura,
                                        type: self.model.types.STRING
                                                },
                                    {
                                        name: 'total',
                                        value: total,
                                        type: self.model.types.DECIMAL
                                                 },
                                    {
                                        name: 'subtotal',
                                        value: subtotal,
                                        type: self.model.types.DECIMAL
                                                 },
                                    {
                                        name: 'idUsuario',
                                        value: req.query.idUsuario,
                                        type: self.model.types.INT
                                                },
                                    {
                                        name: 'xmlFactura',
                                        value: xmlFactura,
                                        type: self.model.types.STRING
                                                 }
                                        ];

                                //LQMA add 19092016    
                                if (aux == 0)
                                    getDatosFactura2(res, self, paramsFactura);

                                aux = aux + 1; //LQMA add 19092016

                            });
                        });
                    }
                }
            }
        });

    } else {
        res.end('');
    }
};

function getDatosFactura2(res, self, paramsFactura) {
    var object = {};
    object.result = paramsFactura;
    self.view.expositor(res, object);
}

/*
function getDatosFactura2(res, self, stored, paramsFactura) {
    //Objeto que almacena la respuesta
    var object = {};
    self.model.query(stored, paramsFactura, function (error, result) {
        if (result.length > 0) {
            self.model.query('INS_COTIZACION_FACTURA_SP', paramsFactura, function (error, result) {
                //Callback
                object.error = error;
                object.result = result;
                self.view.expositor(res, object);
            });
        }
    });
};*/

Orden.prototype.get_removeFactura = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Referencia a la clase para callback
    var self = this;
    //Objeto que envía los parámetros
    var paramsTipoOrden = [{
            name: 'idTrabajo',
            value: req.query.idTrabajo,
            type: self.model.types.INT
        },
        {
            name: 'idCotizacion',
            value: req.query.idCotizacion,
            type: self.model.types.INT
        },
        {
            name: 'idOpcion',
            value: req.query.idOpcion,
            type: self.model.types.INT
        }];

    //LQMA add 20092016 
    var idOpcion = req.query.idOpcion; //1:borrar temporales; 2:borrar originales

    var directorioFactura = dirname + req.query.idTrabajo + '/' + req.query.idCotizacion + '/documentos/factura';
    var files = fs.readdirSync(directorioFactura);
    var fechaFactura, numFactura, uuid, xmlFactura, total, subtotal;

    var existeFacturaXML = files.some(checkExistsXML);
    if (existeFacturaXML) {
        files.forEach(function (file) {
            var extension = obtenerExtArchivo(file);
            if (extension == '.xml' || extension == '.XML' || extension == '.pdf' || extension == '.PDF') {
                console.log(idOpcion);
                if (idOpcion == 1) { //LQMA add 20092016 borra temporaleas
                    if (file.indexOf('temp') >= 0) // LQMA 20092016 ADD para que solo borre los temporales
                        fs.unlink(directorioFactura + '/' + file, function (err, result) {
                        if (err) return
                    });
                } else
                if (file.indexOf('temp') == -1) // LQMA 20092016 ADD para que borre originales
                    fs.unlink(directorioFactura + '/' + file, function (err, result) {
                    if (err) return
                });
            }
        });
        self.model.query('SEL_COTIZACION_FACTURA_SP', paramsTipoOrden, function (error, result) {
            self.view.expositor(res, {
                error: error,
                result: result
            });
        });
    } else {
        res.end('');
    }
};

//En cuentra la ubicacion de la factura donde se guardo
Orden.prototype.post_encuentraFactura = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var idCotizacion = req.body.idCotizacion;
    var idTrabajo = req.body.idTrabajo;
    var numeroCotizacion = req.body.numeroCotizacion;

    var nombreXmlMinuscula = 'Factura.xml';
    var nombreXmlMayuscula = 'Factura.XML';
    var nombrePdfMinuscula = 'Factura.pdf';
    var nombrePdfMayuscula = 'Factura.PDF';

    var nombreXmlMinusculas = 'Factura_' + numeroCotizacion + '.xml';
    var nombreXmlMayusculas = 'Factura_' + numeroCotizacion + '.XML';
    var nombrePdfMinusculas = 'Factura_' + numeroCotizacion + '.pdf';
    var nombrePdfMayusculas = 'Factura_' + numeroCotizacion + '.PDF';

    var rutaAnterior = dirname + idTrabajo + '/documentos/factura/';
    var rutaActual = dirname + idTrabajo + '/' + idCotizacion + '/documentos/factura/';

    if (fs.existsSync(rutaActual + nombreXmlMinusculas || rutaActual + nombreXmlMayusculas || rutaActual + nombrePdfMinusculas || rutaActual + nombrePdfMayusculas)) {
        //Callback
        object.error = null;
        object.result = 1;
    } else if (fs.existsSync(rutaAnterior + nombreXmlMinuscula || rutaAnterior + nombreXmlMayuscula || rutaAnterior + nombrePdfMinuscula || rutaAnterior + nombrePdfMayuscula)) {
        //Callback
        object.error = null;
        object.result = 2;
    } else {
        //Callback
        object.error = null;
        object.result = 3;
    }
    self.view.expositor(res, object);


}


//Obtiene los tipos de cotizaciones
Orden.prototype.get_obtieneCotizacion = function (req, res, next) {
        var self = this;
        var params = [];

        this.model.query('SEL_TIPO_COTIZACION_SP', params, function (error, result) {
            self.view.expositor(res, {
                error: error,
                result: result
            });
        });
    }
    //Obtiene los tipos de cotizaciones
Orden.prototype.get_obtieneMaestro = function (req, res, next) {
        //Objeto que almacena la respuesta
        var object = {};
        //Referencia a la clase para callback
        var self = this;
        //Objeto que envía los parámetros
        var params = [{
            name: 'idCotizacion',
            value: req.query.idCotizacion,
            type: self.model.types.INT
        }];

        this.model.query('SEL_COTIZACION_MAESTRO_SP', params, function (error, result) {
            self.view.expositor(res, {
                error: error,
                result: result
            });
        });
    }
    //Actualiza el precio de una partida desde la orden de servicio
Orden.prototype.post_actualizaCotizacionMaestro = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [
        {
            name: 'idCotizacion',
            value: req.body.idCotizacion,
            type: self.model.types.INT
        },
        {
            name: 'idTipoCotizacion',
            value: req.body.idTipoCotizacion,
            type: self.model.types.INT
        },
        {
            name: 'idTaller',
            value: req.body.idTaller,
            type: self.model.types.DECIMAL
        },
    ];

    this.model.post('UPD_PROVEEDOR_MAESTRO_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

//realiza el envío de email para nuevo Osur
Orden.prototype.get_enviarnotificacionutilidad = function (req, res, next) {
    //Con req.query se obtienen los parametros de la url
    //Ejemplo: ?p1=a&p2=b
    //Retorna {p1:'a',p2:'b'}
    //Objeto que envía los parámetros
    //Referencia a la clase para callback
    var self = this;
    var storeName = 'SEL_NOTIFICACION_MARGEN_UTILIDAD_SP';
    //Obtención de valores de los parámetros del request
    var params = [{
        name: 'idTrabajo',
        value: req.query.idTrabajo,
        type: self.model.types.INT
    },
    {
        name: 'idUsuario',
        value: req.query.idUsuario,
        type: self.model.types.INT
    }];

   // req.query.tipoCorreo == 4 ? storeName = 'SEL_NOTIFICACION_CITA_SIN_TALLER_SP' : storeName = 'SEL_NOTIFICACION_CITA_SP';

    this.model.query(storeName, params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

    //Obtiene los tipos de cotizaciones
Orden.prototype.get_trbajoCobrado = function (req, res, next) {
        //Objeto que almacena la respuesta
        var object = {};
        //Referencia a la clase para callback
        var self = this;
        //Objeto que envía los parámetros
        var params = [{
            name: 'idDatosCopade',
            value: req.query.idDatosCopade,
            type: self.model.types.INT
        }];

        this.model.query('SEL_TRABAJOS_COBRADOS_ORDEN_SP', params, function (error, result) {
            self.view.expositor(res, {
                error: error,
                result: result
            });
        });
    }

    //Devuelve los trabajos cobrados y listos para facturar
Orden.prototype.get_facturados = function (req, res, next) {
        //Objeto que almacena la respuesta
        var object = {};
        //Referencia a la clase para callback
        var self = this;
        //Objeto que envía los parámetros
        var params = [{
            name: 'idUsuario',
            value: req.query.idUsuario,
            type: self.model.types.INT
        }];

    this.model.query('SEL_TRABAJOS_FACTURADOS_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//Obtiene las ordenes pendientes por cobrar
Orden.prototype.get_getNotasTrabajo = function (req, res, next) {
    var self = this;
    var params = [{
        name: 'idTrabajo',
        value: req.query.idTrabajo,
        type: self.model.types.INT
        }];

    this.model.query('SEL_NOTA_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}
    //Inserta los datos en las notas
Orden.prototype.post_insertaNotas = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [
        {
            name: 'idTrabajo',
            value: req.body.idTrabajo,
            type: self.model.types.INT
        },
        {
            name: 'idUsuario',
            value: req.body.idUsuario,
            type: self.model.types.INT
        },
        {
            name: 'texto',
            value: req.body.texto,
            type: self.model.types.STRING
        },
    ];

    this.model.post('INS_NOTA_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

module.exports = Orden;