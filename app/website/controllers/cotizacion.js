var CotizacionView = require('../views/ejemploVista'),
    CotizacionModel = require('../models/dataAccess2');
var mkdirp = require('mkdirp');
multer = require('multer');
var idTipoArchivo;
var nameFile;
var fs = require('fs');
var totalFiles = 0;
var dirname = 'C:/Produccion/Talleres/talleres-v2-pemex/app/static/uploads/files/';
var dirCopades = 'C:/Produccion/Talleres/talleres-v2-pemex/app/static/uploads/copades/';
var nameFile = '';
var idTrabajo = 0;
var idNombreEspecial = 0;
var consecutivoArchivo = 0;
var carpetaCotizacion = 0;
var nombreFacturaCotizacion = '';

var Cotizacion = function (conf) {
    this.conf = conf || {};

    this.view = new CotizacionView();
    this.model = new CotizacionModel({
        parameters: this.conf.parameters
    });

    this.response = function () {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    }


    this.middlewares = [
   ]
}

//Obtener el tipo de archivo
var obtenerTipoArchivo = function (ext) {
    var type;
    if (ext == '.pdf' || ext == '.doc' || ext == '.xls' || ext == '.docx' || ext == '.xlsx' ||
        ext == '.PDF' || ext == '.DOC' || ext == '.XLS' || ext == '.DOCX' || ext == '.XLSX' ||
        ext == '.ppt' || ext == '.PPT' || ext == '.xml' || ext == '.XML') {
        type = 1;
    } else if (ext == '.jpg' || ext == '.png' || ext == '.gif' || ext == '.bmp' || ext == '.JPG' || ext == '.PNG' || ext == '.GIF' || ext == '.BMP') {
        type = 2;
    } else if (ext == '.mp4') {
        type = 3;
    }
    return type;
}

//obtiene el consecutivo de los archivos
var obtieneConsecutivo = function (ruta) {
    var consecutivo = fs.readdirSync(ruta);
    return consecutivo.length + 1;
}

//Obtiene las cotizaciones pendientes por autorizar
Cotizacion.prototype.get_see = function (req, res, next) {
    var self = this;
    var params = [{
        name: 'idUsuario',
        value: req.query.idUsuario,
        type: self.model.types.INT
        }];

    this.model.query('SEL_COTIZACIONES_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//Método para la búsqueda de piezas para una cotización
Cotizacion.prototype.get_buscarPieza = function (req, res, next) {
    //Con req.query se obtienen los parametros de la url
    //Objeto que envía los parámetros
    //var params = [];
    //Referencia a la clase para callback
    var self = this;
    //Asigno a params el valor de mis n variables

    var params = [{
            name: 'idTaller',
            value: req.query.idTaller,
            type: self.model.types.INT
        },
        {
            name: 'nombrePieza',
            value: req.query.nombrePieza,
            type: self.model.types.STRING 
        },
        {
            name: 'refaccion',
            value: req.query.refaccion,
            type: self.model.types.STRING
        },
        {
            name: 'idUsuario',
            value: req.query.idUsuario,
            type: self.model.types.INT
        },
        {
            name: 'idCliente',
            value: req.query.idCliente,
            type: self.model.types.INT
        }];

    this.model.query('SEL_BUSQUEDA_PIEZA_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//Método para insertar nueva cotización Maestro
Cotizacion.prototype.post_cotizacionMaestro = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    //Asigno a params el valor de mis variables
    var params = [{
            name: 'idCita',
            value: req.body.idCita,
            type: self.model.types.DECIMAL
        },
        {
            name: 'idUsuario',
            value: req.body.idUsuario,
            type: self.model.types.DECIMAL
        },
        {
            name: 'observaciones',
            value: req.body.observaciones,
            type: self.model.types.STRING
        },
        {
            name: 'idUnidad',
            value: req.body.idUnidad,
            type: self.model.types.DECIMAL
        },
        {
            name: 'idTipoCotizacion',
            value: req.body.idTipoCotizacion,
            type: self.model.types.DECIMAL
        },
        {
            name: 'idTaller',
            value: req.body.idTaller,
            type: self.model.types.DECIMAL
        },
        {
            name: 'idEstatus',
            value: req.body.idEstatus,
            type: self.model.types.INT
        }
        ];


    this.model.post('INS_COTIZACION_MAESTRO_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

//Método para insertar nueva cotización Detalle
Cotizacion.prototype.post_cotizacionDetalle = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    //Asigno a params el valor de mis variables
    var params = [{
            name: 'idCotizacion',
            value: req.body.idCotizacion,
            type: self.model.types.DECIMAL
        },
        {
            name: 'idTipoElemento',
            value: req.body.idTipoElemento,
            type: self.model.types.DECIMAL
        },
        {
            name: 'idElemento',
            value: req.body.idElemento,
            type: self.model.types.STRING
        },
        {
            name: 'precio',
            value: req.body.precio,
            type: self.model.types.DECIMAL
        },
        {
            name: 'cantidad',
            value: req.body.cantidad,
            type: self.model.types.DECIMAL
        },
        {
            name: 'idNivelAutorizacion',
            value: req.body.idNivelAutorizacion,
            type: self.model.types.DECIMAL
        },
        {
            name: 'idEstatus',
            value: req.body.idEstatus,
            type: self.model.types.INT
        },
        {
            name: 'idUsuario',
            value: req.body.idUsuario,
            type: self.model.types.INT
        }];

    this.model.post('INS_COTIZACION_DETALLE_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

Cotizacion.prototype.get_buscar = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    //Asigno a params el valor de mis variables
    //params = req.params.data;

    this.model.get(function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.see(res, object);
    });
}

//Detalle Cotizacion - Editar Cotización
Cotizacion.prototype.get_detail = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [
        {
            name: 'idCotizacion',
            value: req.query.idCotizacion,
            type: self.model.types.DECIMAL
        },
        {
            name: 'idTaller',
            value: req.query.idTaller,
            type: self.model.types.DECIMAL
        },
        {
            name: 'idUsuario',
            value: req.query.idUsuario,
            type: self.model.types.DECIMAL
        }
    ];

    this.model.query('SEL_COTIZACION_DETALLE_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

//Obtiene la conversación del chat de una cita
Cotizacion.prototype.get_chat = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [
        {
            name: 'idCita',
            value: req.query.idCita,
            type: self.model.types.DECIMAL
        },
        {
            name: 'idTipoChat',
            value: req.query.idTipoChat,
            type: self.model.types.DECIMAL
        }
    ];

    this.model.query('SEL_CHAT_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

Cotizacion.prototype.post_message = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [{
            name: 'idUsuario',
            value: req.body.idUsuario,
            type: self.model.types.DECIMAL
        },
        {
            name: 'mensaje',
            value: req.body.mensaje,
            type: self.model.types.STRING
        },
        {
            name: 'idCita',
            value: req.body.idCita,
            type: self.model.types.DECIMAL
        },
        {
            name: 'idTipoChat',
            value: req.body.idTipoChat,
            type: self.model.types.DECIMAL
        }];

    this.model.post('INS_MENSAJE_CHAT_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

//Obtiene la ficha técnica de la unidad
Cotizacion.prototype.get_ficha = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [
        {
            name: 'idCita',
            value: req.query.idCita,
            type: self.model.types.DECIMAL
        }
    ];

    this.model.query('SEL_FICHA_TECNICA_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

//Obtiene todas las cotizaciones de un trabajo
Cotizacion.prototype.get_cotizacionByTrabajo = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [
        {
            name: 'idCita',
            value: req.query.idCita,
            type: self.model.types.DECIMAL
        },
        {
            name: 'idUsuario',
            value: req.query.idUsuario,
            type: self.model.types.DECIMAL
        }
    ];

    this.model.query('SEL_COTIZACIONES_BY_TRABAJO_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

//Autoriza una cotización
Cotizacion.prototype.post_cotizacionAprobacion = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [
        {
            name: 'idCotizacion',
            value: req.body.cotizacion,
            type: self.model.types.DECIMAL
        },
        {
            name: 'idUsuario',
            value: req.body.usuario,
            type: self.model.types.DECIMAL
        },
        {
            name: 'comentarios',
            value: req.body.comentarios,
            type: self.model.types.STRING
        }
    ];

    this.model.post('INS_AUTORIZACION_COTIZACION_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

//Obtiene las evidencias de una cotización
Cotizacion.prototype.get_evidenciasByCotizacion = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [
        {
            name: 'idCotizacion',
            value: req.query.idCotizacion,
            type: self.model.types.DECIMAL
        },
        {
            name: 'idTipoUsuario',
            value: req.query.idTipoUsuario,
            type: self.model.types.DECIMAL
        }
    ];

    var evidenciasByOrden = [];
    var rutaPrincipal = dirname + req.query.idTrabajo;
    var carpetas = fs.readdirSync(rutaPrincipal);
    carpetas.forEach(function (carpeta) {
        if (carpeta != 'documentos' && carpeta != 'multimedia' && carpeta != 'evidenciaTrabajo') {
            var subCarpetas = fs.readdirSync(rutaPrincipal + '/' + carpeta);
            subCarpetas.forEach(function (subCarpeta) {
                var isSubCarpeta = fs.statSync(rutaPrincipal + '/' + carpeta + '/' + subCarpeta).isDirectory();
                if (isSubCarpeta) {
                    if (subCarpeta == 'documentos' || subCarpeta == 'multimedia') {
                        var documentos = fs.readdirSync(rutaPrincipal + '/' + carpeta + '/' + subCarpeta);
                        documentos.forEach(function (documento) {
                            var ext = obtenerExtArchivo(documento);
                            var idTipoArchivo = obtenerTipoArchivo(ext);
                            var fecha = fs.statSync(rutaPrincipal + '/' + carpeta + '/' + subCarpeta + '/' + documento).mtime.getTime();
                            evidenciasByOrden.push({
                                idTipoEvidencia: 2,
                                idTipoArchivo: idTipoArchivo,
                                nombreArchivo: documento,
                                fecha: fecha,
                                idTrabajo: req.query.idTrabajo,
                                idCotizacion: req.query.idCotizacion
                            });
                        });
                    }
                }
            });
        }
    });

    this.model.listaEvidencia(evidenciasByOrden, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

////Método para insertar evidencia
Cotizacion.prototype.post_uploadfiles = function (req, res, next) {
    //res.end("File is uploaded");
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            idTrabajo = (req.body.idTrabajo).constructor !== Array ? req.body.idTrabajo : req.body.idTrabajo[0];
            var idCotizacion = req.body.idCotizacion.constructor !== Array ? req.body.idCotizacion : req.body.idCotizacion[0];
            var idCategoria = (req.body.idCategoria).constructor != Array ? req.body.idCategoria : req.body.idCategoria[0];
            idNombreEspecial = (req.body.idNombreEspecial).constructor != Array ? req.body.idNombreEspecial : req.body.idNombreEspecial[0];

            //LQMA  add 15092016 --idEstatus , define si crea el archivo de forma temporal
            //if (idNombreEspecial == 3)
            //  var idEstatus = (req.body.idEstatus).constructor != Array ? req.body.idEstatus : req.body.idEstatus[0];

            var idCotizacionArr = idCotizacion.split('|');
            carpetaCotizacion = idCotizacionArr[0];
            nombreFacturaCotizacion = idCotizacionArr[1];

            //LQMA add 15092016 -- cuando sea estatus 12, se guarda el archivo como temporal, y despues de pasar la validacion se
            //remplaza el original
            if (idNombreEspecial == 3)
                nombreFacturaCotizacion = nombreFacturaCotizacion + 'temp';

            if (idCategoria == 2) {
                if (idCotizacion == 0) {
                    if (!fs.existsSync(dirname + idTrabajo))
                        fs.mkdirSync(dirname + idTrabajo);
                    if (!fs.existsSync(dirname + idTrabajo + '/multimedia'))
                        fs.mkdirSync(dirname + idTrabajo + '/multimedia');
                    if (!fs.existsSync(dirname + idTrabajo + '/documentos'))
                        fs.mkdirSync(dirname + idTrabajo + '/documentos');
                    if (!fs.existsSync(dirname + idTrabajo + '/evidenciaTrabajo'))
                        fs.mkdirSync(dirname + idTrabajo + '/evidenciaTrabajo');
                    if (!fs.existsSync(dirname + idTrabajo + '/documentos/comprobanteRecepcion'))
                        fs.mkdirSync(dirname + idTrabajo + '/documentos/comprobanteRecepcion')
                    if (!fs.existsSync(dirname + idTrabajo + '/documentos/transferenciaCustodia'))
                        fs.mkdirSync(dirname + idTrabajo + '/documentos/transferenciaCustodia')
                    if (!fs.existsSync(dirname + idTrabajo + '/documentos/certificadoConformidad'))
                        fs.mkdirSync(dirname + idTrabajo + '/documentos/certificadoConformidad');
                    if (!fs.existsSync(dirname + idTrabajo + '/documentos/factura'))
                        fs.mkdirSync(dirname + idTrabajo + '/documentos/factura');
                    if (!fs.existsSync(dirname + idTrabajo + '/documentos/adendaCopade'))
                        fs.mkdirSync(dirname + idTrabajo + '/documentos/adendaCopade');
                    if (!fs.existsSync(dirname + idTrabajo + '/documentos/preFactura'))
                        fs.mkdirSync(dirname + idTrabajo + '/documentos/preFactura');
                } else {
                    if (idNombreEspecial == 3 || idNombreEspecial == 7) {
                        if (!fs.existsSync(dirname + idTrabajo)) {
                            fs.mkdirSync(dirname + idTrabajo);
                        }
                        if (!fs.existsSync(dirname + idTrabajo + '/' + carpetaCotizacion)) {
                            fs.mkdirSync(dirname + idTrabajo + '/' + carpetaCotizacion)
                        }
                        if (!fs.existsSync(dirname + idTrabajo + '/' + carpetaCotizacion + '/multimedia')) {
                            fs.mkdirSync(dirname + idTrabajo + '/' + carpetaCotizacion + '/multimedia')
                            fs.mkdirSync(dirname + idTrabajo + '/' + carpetaCotizacion + '/documentos')
                        }
                        if (!fs.existsSync(dirname + idTrabajo + '/' + carpetaCotizacion + '/documentos/factura')) {
                            fs.mkdirSync(dirname + idTrabajo + '/' + carpetaCotizacion + '/documentos/factura')
                        }
                        if (!fs.existsSync(dirname + idTrabajo + '/' + carpetaCotizacion + '/documentos/preFactura')) {
                            fs.mkdirSync(dirname + idTrabajo + '/' + carpetaCotizacion + '/documentos/preFactura')
                        }
                    }
                }

                if (idNombreEspecial == 1) {
                    nameFile = 'ComprobanteRecepcion';
                    cb(null, dirname + idTrabajo + '/documentos/comprobanteRecepcion');
                } else if (idNombreEspecial == 2) {
                    nameFile = 'TransferenciaCustodia';
                    cb(null, dirname + idTrabajo + '/documentos/transferenciaCustodia');
                } else if (idNombreEspecial == 3) {
                    nameFile = 'Factura_' + nombreFacturaCotizacion;
                    cb(null, dirname + idTrabajo + '/' + carpetaCotizacion + '/documentos/factura');
                } else if (idNombreEspecial == 4) {
                    var extFile = obtenerExtArchivo(file.originalname);
                    if (extFile === '.xml' || extFile === '.XML') {
                        nameFile = 'COPADE';
                    } else {
                        nameFile = 'Adenda';
                    }
                    cb(null, dirname + idTrabajo + '/documentos/adendaCopade');
                } else if (idNombreEspecial == 5) {
                    nameFile = 'CertificadoConformidad';
                    cb(null, dirname + idTrabajo + '/documentos/certificadoConformidad');
                } else if (idNombreEspecial == 6) {
                    nameFile = 'CertificadoConformidad';
                    cb(null, dirname + idTrabajo + '/documentos/certificadoConformidad');
                } else if (idNombreEspecial == 7) {
                    nameFile = 'preFactura_' + nombreFacturaCotizacion;
                    cb(null, dirname + idTrabajo + '/' + carpetaCotizacion + '/documentos/preFactura');
                } else {
                    nameFile = 'Evidencia';
                    cb(null, dirname + idTrabajo + '/evidenciaTrabajo');
                }
            } else if (idCategoria == 1) {
                if (!fs.existsSync(dirname + idTrabajo)) {
                    fs.mkdirSync(dirname + idTrabajo);
                }
                if (!fs.existsSync(dirname + idTrabajo + '/' + idCotizacion)) {
                    fs.mkdirSync(dirname + idTrabajo + '/' + idCotizacion);
                    fs.mkdirSync(dirname + idTrabajo + '/' + idCotizacion + '/multimedia');
                    fs.mkdirSync(dirname + idTrabajo + '/' + idCotizacion + '/documentos');
                }

                if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/gif' || file.mimetype == 'image/jpg' || file.mimetype == 'image/bmp' || file.mimetype == 'video/mp4') {
                    consecutivoArchivo = obtieneConsecutivo(dirname + idTrabajo + '/' + idCotizacion + '/multimedia');
                    cb(null, dirname + idTrabajo + '/' + idCotizacion + '/multimedia')
                } else {
                    consecutivoArchivo = obtieneConsecutivo(dirname + idTrabajo + '/' + idCotizacion + '/documentos');
                    cb(null, dirname + idTrabajo + '/' + idCotizacion + '/documentos')
                }
            } else {
                nameFile = '';
                cb(null, dirCopades);
            }
        },
        filename: function (req, file, cb) {
            if (nameFile !== '') {
                if (nameFile === 'Evidencia') {
                    nameFile = nameFile + obtieneConsecutivo(dirname + idTrabajo + '/evidenciaTrabajo');
                }
                cb(null, nameFile + obtenerExtArchivo(file.originalname));
            } else if (consecutivoArchivo > 0) {
                cb(null, 'Evidencia' + consecutivoArchivo + obtenerExtArchivo(file.originalname));
            } else {
                cb(null, file.originalname);
            }
            nameFile = '';
            consecutivoArchivo = 0;
        }
    });
    var upload = multer({
        storage: storage
    }).any();

    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            return res.end("Error al subir el archivo.");
        } else {
            req.files.forEach(function (f) {
                console.log(f.originalname);
                // and move file to final destination...
            });
            res.end("Archivo subido");
        }
    });
}

//Se obtiene la extensión del archivo
var obtenerExtArchivo = function (file) {
    return '.' + file.split('.').pop();
}

var countFilesDirectory = function (dir) {
    var files = fs.readdirSync(dir);
    return files.length;
};
//obtenemos el nombre del archivo
var getNameFile = function (dir) {
    var files = fs.readdirSync(dir);
    console.log(files);
    return files;
};

//recuoera la direccion 
Cotizacion.prototype.get_namefileserver = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Referencia a la clase para callback
    var self = this;
    //Callback
    object.error = null;
    object.result = getNameFile(dirname + req.query.idTrabajo + '/documentos/certificadoConformidad/');

    self.view.expositor(res, object);

}

//Rechaza una cotización
Cotizacion.prototype.post_cotizacionRechazo = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [
        {
            name: 'idCotizacion',
            value: req.body.cotizacion,
            type: self.model.types.DECIMAL
        },
        {
            name: 'idUsuario',
            value: req.body.usuario,
            type: self.model.types.DECIMAL
        },
        {
            name: 'comentarios',
            value: req.body.comentarios,
            type: self.model.types.STRING
        }
    ];

    this.model.post('INS_RECHAZO_COTIZACION_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

//Método para insertar nueva cotización Detalle
Cotizacion.prototype.post_updateCotizacion = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    //Asigno a params el valor de mis variables
    var params = [{
            name: 'idCotizacion',
            value: req.body.idCotizacion,
            type: self.model.types.INT
                        },
        {
            name: 'idTipoElemento',
            value: req.body.idTipoElemento,
            type: self.model.types.INT
                        },
        {
            name: 'idElemento',
            value: req.body.idElemento,
            type: self.model.types.INT
                        },
        {
            name: 'precio',
            value: req.body.precio,
            type: self.model.types.DECIMAL
                        },
        {
            name: 'cantidad',
            value: req.body.cantidad,
            type: self.model.types.INT
                        },
        {
            name: 'observaciones',
            value: req.body.observaciones,
            type: self.model.types.STRING
                        },
        {
            name: 'idEstatus',
            value: req.body.idEstatus,
            type: self.model.types.INT
        },
        {
            name: 'idTaller',
            value: req.body.idTaller,
            type: self.model.types.INT
                        },
        {
            name: 'idTipoCotizacion',
            value: req.body.idTipoCotizacion,
            type: self.model.types.INT
                        }];

    this.model.post('UPD_COTIZACION_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

Cotizacion.prototype.get_docs_data = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this; //Asigno a params el valor de mis variables
    params = req.params.data;

    this.model.docs(params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.docs(res, object);
    });
}

//Se obtiene el detalle de la cotizacion desde la cita
Cotizacion.prototype.get_servicioDetalle = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    //Asigno a params el valor de mis variables
    var params = [{
        name: 'idCita',
        value: req.query.idCita,
        type: self.model.types.DECIMAL
    }];

    this.model.query('SEL_SERVICIO_DETALLE_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

//Proceso que envia correo de cotizaciones (nueva, aprobación, rechazo)
Cotizacion.prototype.post_mail = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    //Asigno a params el valor de mis variables
    var params = [{
            name: 'idCotizacion',
            value: req.query.idCotizacion,
            type: self.model.types.DECIMAL
        },
        {
            name: 'idTaller',
            value: req.query.idTaller,
            type: self.model.types.DECIMAL
        },
        {
            name: 'idOperacion',
            value: req.query.idOperacion,
            type: self.model.types.DECIMAL
        },
        {
            name: 'comentarios',
            value: req.query.comentarios,
            type: self.model.types.STRING
        }];

    this.model.post('SEL_NOTIFICACION_COTIZACION_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

//Obtiene los datos del cliente
Cotizacion.prototype.get_datosCliente = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [
        {
            name: 'idCita',
            value: req.query.idCita,
            type: self.model.types.DECIMAL
        }
    ];

    this.model.query('SEL_DATOS_CLIENTE_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

Cotizacion.prototype.get_evidenciasByOrden = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [
        {
            name: 'idTrabajo',
            value: req.query.idTrabajo,
            type: self.model.types.DECIMAL
        },
        {
            name: 'idTipoUsuario',
            value: req.query.idTipoUsuario,
            type: self.model.types.DECIMAL
        }
    ];

    var evidenciasByOrden = [];

    cargaCotizacionEvidencias(req.query.idTrabajo);

    this.model.listaEvidencia(evidenciasByOrden, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });

    function cargaCotizacionEvidencias(trabajo) {
        var rutaPrincipal = dirname + trabajo;
        var carpetas = fs.readdirSync(rutaPrincipal);
        carpetas.forEach(function (carpeta) {
            var isCarpeta = fs.statSync(rutaPrincipal + '/' + carpeta).isDirectory();
            if (isCarpeta) {
                if (carpeta == 'documentos') {
                    var subCarpetas = fs.readdirSync(rutaPrincipal + '/' + carpeta);
                    subCarpetas.forEach(function (subCarpeta) {
                        var isSubCarpeta = fs.statSync(rutaPrincipal + '/' + carpeta + '/' + subCarpeta).isDirectory();
                        if (isSubCarpeta) {
                            var documentos = [];
                            if (subCarpeta == 'factura') {
                                if (req.query.idTipoUsuario != 4) {
                                    documentos = fs.readdirSync(rutaPrincipal + '/' + carpeta + '/' + subCarpeta);
                                    documentos.forEach(function (documento) {
                                        var ext = obtenerExtArchivo(documento);
                                        var idTipoArchivo = obtenerTipoArchivo(ext);
                                        var fecha = fs.statSync(rutaPrincipal + '/' + carpeta + '/' + subCarpeta + '/' + documento).mtime.getTime();
                                        evidenciasByOrden.push({
                                            idTipoEvidencia: 1,
                                            idTipoArchivo: idTipoArchivo,
                                            nombreArchivo: documento,
                                            fecha: fecha,
                                            carpeta: carpeta + '/' + subCarpeta
                                        });
                                    });
                                }
                            } else if (subCarpeta == 'adendaCopade') {
                                if (req.query.idTipoUsuario != 3 && req.query.idTipoUsuario != 4) {
                                    documentos = fs.readdirSync(rutaPrincipal + '/' + carpeta + '/' + subCarpeta);
                                    documentos.forEach(function (documento) {
                                        var ext = obtenerExtArchivo(documento);
                                        var idTipoArchivo = obtenerTipoArchivo(ext);
                                        var fecha = fs.statSync(rutaPrincipal + '/' + carpeta + '/' + subCarpeta + '/' + documento).mtime.getTime();
                                        evidenciasByOrden.push({
                                            idTipoEvidencia: 1,
                                            idTipoArchivo: idTipoArchivo,
                                            nombreArchivo: documento,
                                            fecha: fecha,
                                            carpeta: carpeta + '/' + subCarpeta
                                        });
                                    });
                                }
                            } else if (subCarpeta == 'certificadoConformidad') {
                                if (req.query.idTipoUsuario != 3) {
                                    documentos = fs.readdirSync(rutaPrincipal + '/' + carpeta + '/' + subCarpeta);
                                    documentos.forEach(function (documento) {
                                        var ext = obtenerExtArchivo(documento);
                                        var idTipoArchivo = obtenerTipoArchivo(ext);
                                        var fecha = fs.statSync(rutaPrincipal + '/' + carpeta + '/' + subCarpeta + '/' + documento).mtime.getTime();
                                        evidenciasByOrden.push({
                                            idTipoEvidencia: 1,
                                            idTipoArchivo: idTipoArchivo,
                                            nombreArchivo: documento,
                                            fecha: fecha,
                                            carpeta: carpeta + '/' + subCarpeta
                                        });
                                    });
                                }
                            } else {
                                documentos = fs.readdirSync(rutaPrincipal + '/' + carpeta + '/' + subCarpeta);
                                documentos.forEach(function (documento) {
                                    var ext = obtenerExtArchivo(documento);
                                    var idTipoArchivo = obtenerTipoArchivo(ext);
                                    var fecha = fs.statSync(rutaPrincipal + '/' + carpeta + '/' + subCarpeta + '/' + documento).mtime.getTime();
                                    evidenciasByOrden.push({
                                        idTipoEvidencia: 1,
                                        idTipoArchivo: idTipoArchivo,
                                        nombreArchivo: documento,
                                        fecha: fecha,
                                        carpeta: carpeta + '/' + subCarpeta
                                    });
                                });
                            }
                        }
                    });
                } else if (carpeta == 'multimedia' || carpeta == 'evidenciaTrabajo') {
                    var documentos = fs.readdirSync(rutaPrincipal + '/' + carpeta);
                    documentos.forEach(function (documento) {
                        var ext = obtenerExtArchivo(documento);
                        var idTipoArchivo = obtenerTipoArchivo(ext);
                        var fecha = fs.statSync(rutaPrincipal + '/' + carpeta + '/' + documento).mtime.getTime();
                        evidenciasByOrden.push({
                            idTipoEvidencia: 1,
                            idTipoArchivo: idTipoArchivo,
                            nombreArchivo: documento,
                            fecha: fecha,
                            carpeta: carpeta
                        });
                    });
                } else {
                    var subCarpetas = fs.readdirSync(rutaPrincipal + '/' + carpeta);
                    subCarpetas.forEach(function (subCarpeta) {
                        var isSubCarpeta = fs.statSync(rutaPrincipal + '/' + carpeta + '/' + subCarpeta).isDirectory();
                        if (isSubCarpeta) {
                            if (subCarpeta == 'documentos' || subCarpeta == 'multimedia') {
                                if (subCarpeta == 'documentos') {
                                    var documentos = fs.readdirSync(rutaPrincipal + '/' + carpeta + '/' + subCarpeta);
                                    documentos.forEach(function (documento) {
                                        var isSubCarpeta = fs.statSync(rutaPrincipal + '/' + carpeta + '/' + subCarpeta + '/' + documento).isDirectory();
                                        if (isSubCarpeta) {
                                            if (documento == 'factura') {
                                                if (req.query.idTipoUsuario != 4) {
                                                    var facturasCotizaciones = fs.readdirSync(rutaPrincipal + '/' + carpeta + '/' + subCarpeta + '/' + documento);

                                                    facturasCotizaciones.forEach(function (facturaCotizacion) {
                                                        var ext = obtenerExtArchivo(facturaCotizacion);
                                                        var idTipoArchivo = obtenerTipoArchivo(ext);
                                                        var fecha = fs.statSync(rutaPrincipal + '/' + carpeta + '/' + subCarpeta + '/' + documento).mtime.getTime();
                                                        evidenciasByOrden.push({
                                                            idTipoEvidencia: 2,
                                                            idTipoArchivo: idTipoArchivo,
                                                            nombreArchivo: facturaCotizacion,
                                                            fecha: fecha,
                                                            idTrabajo: parseInt(trabajo),
                                                            idCotizacion: parseInt(carpeta),
                                                            carpeta: documento
                                                        });
                                                    });
                                                }
                                            }
                                        } else {
                                            var ext = obtenerExtArchivo(documento);
                                            var idTipoArchivo = obtenerTipoArchivo(ext);
                                            var fecha = fs.statSync(rutaPrincipal + '/' + carpeta + '/' + subCarpeta + '/' + documento).mtime.getTime();
                                            evidenciasByOrden.push({
                                                idTipoEvidencia: 2,
                                                idTipoArchivo: idTipoArchivo,
                                                nombreArchivo: documento,
                                                fecha: fecha,
                                                idTrabajo: parseInt(trabajo),
                                                idCotizacion: parseInt(carpeta)
                                            });
                                        }
                                    });
                                } else {
                                    var documentos = fs.readdirSync(rutaPrincipal + '/' + carpeta + '/' + subCarpeta);
                                    documentos.forEach(function (documento) {
                                        var ext = obtenerExtArchivo(documento);
                                        var idTipoArchivo = obtenerTipoArchivo(ext);
                                        var fecha = fs.statSync(rutaPrincipal + '/' + carpeta + '/' + subCarpeta + '/' + documento).mtime.getTime();
                                        evidenciasByOrden.push({
                                            idTipoEvidencia: 2,
                                            idTipoArchivo: idTipoArchivo,
                                            nombreArchivo: documento,
                                            fecha: fecha,
                                            idTrabajo: parseInt(trabajo),
                                            idCotizacion: parseInt(carpeta)
                                        });
                                    });
                                }
                            }
                        }
                    });
                }
            }
        });
    }
}

//obtine datos de la unidad
Cotizacion.prototype.get_datosUnidad = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [{
            name: 'idCotizacion',
            value: req.query.idCotizacion,
            type: self.model.types.DECIMAL
                        },
        {
            name: 'idTrabajo',
            value: req.query.idTrabajo,
            type: self.model.types.DECIMAL
                        }];

    this.model.query('SEL_DATOS_UNIDAD_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

Cotizacion.prototype.post_autorizacionRechazoItem = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [{
            name: 'idEstatus',
            value: req.body.idEstatus,
            type: self.model.types.DECIMAL
        },
        {
            name: 'comentarios',
            value: req.body.comentarios,
            type: self.model.types.STRING
        },
        {
            name: 'idCotizacion',
            value: req.body.idCotizacion,
            type: self.model.types.DECIMAL
        },
        {
            name: 'idItem',
            value: req.body.idItem,
            type: self.model.types.DECIMAL
        },
        {
            name: 'usuarioAutorizador',
            value: req.body.usuarioAutorizador,
            type: self.model.types.DECIMAL
        }
/*        ,
        {
         name: 'idOsur',
            value: req.body.idOsur,
            type: self.model.types.DECIMAL    
        }*/
        ];

    this.model.post('UPD_ITEM_AUTORIZACION_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

Cotizacion.prototype.get_datosOsur = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [
        {
            name: 'idCita',
            value: req.query.idCita,
            type: self.model.types.DECIMAL
        }
    ];

    this.model.query('SEL_DATOS_OSUR_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}


Cotizacion.prototype.post_cancelacionOrden = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    //Asigno a params el valor de mis variables
    var params = [{
            name: 'idTrabajo',
            value: req.body.idTrabajo,
            type: self.model.types.DECIMAL
                        },
        {
            name: 'idCotizacion',
            value: req.body.idCotizacion,
            type: self.model.types.DECIMAL
                        }];

    this.model.post('UPD_CANCELACION_ORDEN_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

//Obtiene los tipos de cotizaciones
Cotizacion.prototype.get_tipoCotizaciones = function (req, res, next) {
    var self = this;
    var params = [];

    this.model.query('SEL_TIPO_COTIZACION_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//Obtiene el precio del cliente  de un Item 
Cotizacion.prototype.get_precioItemCliente = function (req, res, next) {
        var self = this;
        var params = [{
            name: 'idItem',
            value: req.query.idItem,
            type: self.model.types.INT
        }];

        this.model.query('SEL_PRECIO_ITEM_CLIENTE_SP', params, function (error, result) {
            self.view.expositor(res, {
                error: error,
                result: result
            });
        });
    }
    //Obtiene los talleres disponibles 
Cotizacion.prototype.get_tallerCotizacion = function (req, res, next) {
    //Referencia a la clase para callback
    var self = this;
    //Obtención de valores de los parámetros del request
    var params = [
        {
            name: 'datoTaller',
            value: req.query.datoTaller,
            type: self.model.types.STRING
        },
        {
            name: 'isPrecotizacion',
            value: req.query.isPrecotizacion,
            type: self.model.types.DECIMAL
        },
        {
            name: 'idCita',
            value: req.query.idCita,
            type: self.model.types.DECIMAL
        },
        {
            name: 'idUsuario',
            value: req.query.idUsuario,
            type: self.model.types.DECIMAL
        }
    ];

    this.model.query('SEL_TALLER_COTIZACION_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//Se los datos del taller por una cotización
Cotizacion.prototype.get_datosTallerByCotizacion = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    //Asigno a params el valor de mis variables
    var params = [{
        name: 'idTaller',
        value: req.query.idTaller,
        type: self.model.types.DECIMAL
    }];

    this.model.query('SEL_TALLER_BY_ID_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

//Se los datos del taller por una cotización
Cotizacion.prototype.get_citabyRefaccion = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    //Asigno a params el valor de mis variables
    var params = [{
        name: 'idCita',
        value: req.query.idCita,
        type: self.model.types.DECIMAL
    }];

    this.model.query('SEL_BUSQUEDA_REFACCION_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

module.exports = Cotizacion;