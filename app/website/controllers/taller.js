var TallerView = require('../views/ejemploVista'),
    TallerModel = require('../models/dataAccess2'),
    moment = require('moment');

//configuración para el objeto Taller
var Taller = function (conf) {
    this.conf = conf || {};

    this.view = new TallerView();
    this.model = new TallerModel({
        parameters: this.conf.parameters
    });

    this.response = function () {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    }
}

//obtiene 1 taller específicamente
Taller.prototype.get_obtienetaller = function (req, res, next) {
    //Con req.query se obtienen los parametros de la url
    //Ejemplo: ?p1=a&p2=b
    //Retorna {p1:'a',p2:'b'}
    //Objeto que envía los parámetros
    //Referencia a la clase para callback
    var self = this;
    //Obtención de valores de los parámetros del request
    var params = [{
        name: 'idTaller',
        value: req.query.idTaller,
        type: self.model.types.INT
        }];

    this.model.query('SEL_OBTIENE_TALLER_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//obtiene todos los talleres
Taller.prototype.get_obtienetalleres = function (req, res, next) {
    //Con req.query se obtienen los parametros de la url
    //Ejemplo: ?p1=a&p2=b
    //Retorna {p1:'a',p2:'b'}
    //Objeto que envía los parámetros
    //var params = [];
    //Referencia a la clase para callback
    var self = this;

    //asignación de valores mediante parámetros del request
    var params = [];

    this.model.query('SEL_OBTIENE_TALLER_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//obtiene el tipo de persona
Taller.prototype.get_obtienetipopersona = function (req, res, next) {
    //Con req.query se obtienen los parametros de la url
    //Ejemplo: ?p1=a&p2=b
    //Retorna {p1:'a',p2:'b'}
    //Objeto que envía los parámetros
    //var params = [];
    //Referencia a la clase para callback
    var self = this;

    //asignación de valores mediante parámetros del request
    var params = [];

    this.model.query('SEL_TIPO_PERSONA_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//obtiene el estatus del taller
Taller.prototype.get_obtieneestatustaller = function (req, res, next) {
    //Con req.query se obtienen los parametros de la url
    //Ejemplo: ?p1=a&p2=b
    //Retorna {p1:'a',p2:'b'}
    //Objeto que envía los parámetros
    //var params = [];
    //Referencia a la clase para callback
    var self = this;

    //asignación de valores mediante parámetros del request
    var params = [];

    this.model.query('SEL_STATUS_TALLER_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//obtiene las gar(zonas) de los talleres
Taller.prototype.get_obtienegar = function (req, res, next) {
    //Con req.query se obtienen los parametros de la url
    //Ejemplo: ?p1=a&p2=b
    //Retorna {p1:'a',p2:'b'}
    //Objeto que envía los parámetros
    //var params = [];
    //Referencia a la clase para callback
    var self = this;

    //asignación de valores mediante parámetros del request
    var params = [];

    this.model.query('SEL_GAR_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//obtiene las terminales de los talleres
Taller.prototype.get_obtienetar = function (req, res, next) {
    //Con req.query se obtienen los parametros de la url
    //Ejemplo: ?p1=a&p2=b
    //Retorna {p1:'a',p2:'b'}
    //Objeto que envía los parámetros
    //var params = [];
    //Referencia a la clase para callback
    var self = this;

    //asignación de valores mediante parámetros del request
    var params = [
        {
            name: 'idZona',
            value: req.query.idZona,
            type: self.model.types.INT
                }];

    this.model.query('SEL_TAR_TALLER_SP', params, function (error, result) {
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//inserta nuevo taller
Taller.prototype.post_insertataller = function (req, res, next) {
    //Referencia a la clase para callback
    var self = this;
    //Asigno a params el valor de mis variables
    var params = [{
            name: 'idZona',
            value: req.body.idZona,
            type: self.model.types.INT
                 },
        {
            name: 'idTad',
            value: req.body.idTad,
            type: self.model.types.INT
                 },
        {
            name: 'ciudad',
            value: req.body.ciudad,
            type: self.model.types.STRING
                 },
        {
            name: 'razonSocial',
            value: req.body.razonSocial,
            type: self.model.types.STRING
                 },
        {
            name: 'encargado',
            value: req.body.encargado,
            type: self.model.types.STRING
                 },
        {
            name: 'rfc',
            value: req.body.rfc,
            type: self.model.types.STRING
                 },
        {
            name: 'tipo',
            value: req.body.tipo,
            type: self.model.types.INT
                 },
        {
            name: 'telefono',
            value: req.body.telefono,
            type: self.model.types.STRING
                 },
        {
            name: 'email',
            value: req.body.email,
            type: self.model.types.STRING
                 },
        {
            name: 'pais',
            value: req.body.pais,
            type: self.model.types.STRING
                 },
        {
            name: 'estado',
            value: req.body.estado,
            type: self.model.types.STRING
                 },
        {
            name: 'delegacion',
            value: req.body.delegacion,
            type: self.model.types.STRING
                 },
        {
            name: 'colonia',
            value: req.body.colonia,
            type: self.model.types.STRING
                 },
        {
            name: 'calle',
            value: req.body.calle,
            type: self.model.types.STRING
                 },
        {
            name: 'numeroExt',
            value: req.body.numeroExt,
            type: self.model.types.STRING
                 },
        {
            name: 'codPostal',
            value: req.body.codPostal,
            type: self.model.types.STRING
                 },
        {
            name: 'cveusu',
            value: req.body.cveusu,
            type: self.model.types.STRING
                 },
        {
            name: 'status',
            value: req.body.status,
            type: self.model.types.INT
                 },
        {
            name: 'lada',
            value: req.body.lada,
            type: self.model.types.STRING
                 },
        {
            name: 'idTar',
            value: req.body.idTar,
            type: self.model.types.INT
                 },
                 {
            name: 'idProveedor',
            value: req.body.idProveedor,
            type: self.model.types.INT
                 }];

    this.model.post('INS_INSERTA_TALLER_SP', params, function (error, result) {
        //Callback
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//actualiza taller existente
Taller.prototype.post_actualizataller = function (req, res, next) {
    //Referencia a la clase para callback
    var self = this;
    //Asigno a params el valor de mis variables
    var params = [{
            name: 'idTaller',
            value: req.body.idTaller,
            type: self.model.types.INT
                 },
        {
            name: 'idZona',
            value: req.body.idZona,
            type: self.model.types.INT
                 },
        {
            name: 'idTad',
            value: req.body.idTad,
            type: self.model.types.INT
                 },
        {
            name: 'ciudad',
            value: req.body.ciudad,
            type: self.model.types.STRING
                 },
        {
            name: 'razonSocial',
            value: req.body.razonSocial,
            type: self.model.types.STRING
                 },
        {
            name: 'encargado',
            value: req.body.encargado,
            type: self.model.types.STRING
                 },
        {
            name: 'rfc',
            value: req.body.rfc,
            type: self.model.types.STRING
                 },
        {
            name: 'tipo',
            value: req.body.tipo,
            type: self.model.types.INT
                 },
        {
            name: 'telefono',
            value: req.body.telefono,
            type: self.model.types.STRING
                 },
        {
            name: 'email',
            value: req.body.email,
            type: self.model.types.STRING
                 },
        {
            name: 'pais',
            value: req.body.pais,
            type: self.model.types.STRING
                 },
        {
            name: 'estado',
            value: req.body.estado,
            type: self.model.types.STRING
                 },
        {
            name: 'delegacion',
            value: req.body.delegacion,
            type: self.model.types.STRING
                 },
        {
            name: 'colonia',
            value: req.body.colonia,
            type: self.model.types.STRING
                 },
        {
            name: 'calle',
            value: req.body.calle,
            type: self.model.types.STRING
                 },
        {
            name: 'numeroExt',
            value: req.body.numeroExt,
            type: self.model.types.STRING
                 },
        {
            name: 'codPostal',
            value: req.body.codPostal,
            type: self.model.types.STRING
                 },
        {
            name: 'cveusu',
            value: req.body.cveusu,
            type: self.model.types.STRING
                 },
        {
            name: 'status',
            value: req.body.status,
            type: self.model.types.INT
                 },
        {
            name: 'lada',
            value: req.body.lada,
            type: self.model.types.STRING
                 },
        {
            name: 'idTar',
            value: req.body.idTar,
            type: self.model.types.INT
                 },
        {
            name: 'idProveedor',
            value: req.body.idProveedor,
            type: self.model.types.INT
                 }];

    this.model.post('UPD_ACTUALIZA_TALLER_SP', params, function (error, result) {
        //Callback
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

//elimina taller existente
Taller.prototype.post_eliminataller = function (req, res, next) {
    //Referencia a la clase para callback
    var self = this;
    //Asigno a params el valor de mis variables
    var params = [{
        name: 'idTaller',
        value: req.body.idTaller,
        type: self.model.types.INT
        },
        {
        name: 'idProveedor',
        value: req.body.idProveedor,
        type: self.model.types.INT
        }];

    this.model.post('DEL_ELIMINA_TALLER_SP', params, function (error, result) {
        //Callback
        self.view.expositor(res, {
            error: error,
            result: result
        });
    });
}

module.exports = Taller;