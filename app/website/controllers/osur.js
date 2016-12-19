var OsurView = require('../views/ejemploVista'),
    OsurModel = require('../models/dataAccess2');

var Osur = function (conf) {
    this.conf = conf || {};

    this.view = new OsurView();
    this.model = new OsurModel({
        parameters: this.conf.parameters
    });

    this.response = function () {
        this[this.conf.funcionalidad](this.conf.req, this.conf.res, this.conf.next);
    }
}

//Valida credenciales de usuario
Osur.prototype.get_tars = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [
        {
            name: 'idUsuario',
            value: req.query.idUsuario,
            type: self.model.types.INT
        }
    ];

    this.model.query('SEL_TAR_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

//Obtiene los datos de Osur por TAR
Osur.prototype.get_datosOsur = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [{
        name: 'idTAR',
        value: req.query.idTAR,
        type: self.model.types.INT
        },
        {
        name: 'idCliente',
        value: req.query.idCliente,
        type: self.model.types.INT
        }];

    this.model.query('SEL_DATOS_OSUR_BY_TAR_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}


//Inserta nueva Osur
Osur.prototype.post_nuevaosur = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [{
            name: 'presupuesto',
            value: req.body.presupuesto,
            type: self.model.types.DECIMAL
        },
        {
            name: 'idTAR',
            value: req.body.idTAR,
            type: self.model.types.INT
        },
        {
            name: 'folio',
            value: req.body.folio,
            type: self.model.types.STRING
        },
        {
            name: 'fechaInicial',
            value: req.body.fechaInicial,
            type: self.model.types.STRING
        },
        {
            name: 'fechaFinal',
            value: req.body.fechaFinal,
            type: self.model.types.STRING
        },
        {
            name: 'solpe',
            value: req.body.solpe,
            type: self.model.types.INT
        },
        {
            name: 'idCliente',
            value: req.body.idCliente,
            type: self.model.types.INT
        }];


    this.model.post('INS_OSUR_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

Osur.prototype.post_estatusOsurTar = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [{
            name: 'idOsur',
            value: req.body.idOsur,
            type: self.model.types.INT
        },
        {
            name: 'idTAR',
            value: req.body.idTAR,
            type: self.model.types.INT
        }];


    this.model.post('UPD_ESTATUS_OSUR_TAR_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

//Inserta nueva Osur
Osur.prototype.post_osuraplicacion = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [
        {
            name: 'idTAR',
            value: req.body.idTAR,
            type: self.model.types.INT
        },
        {
            name: 'idOsur',
            value: req.body.idOsur,
            type: self.model.types.STRING 
        },
        {
            name: 'monto',
            value: req.body.monto,
            type: self.model.types.STRING
        }];


    this.model.post('UPD_OSUR_APLICACION_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}

//Obtiene los datos de Osur por TAR
Osur.prototype.get_fondos = function (req, res, next) {
    //Objeto que almacena la respuesta
    var object = {};
    //Objeto que envía los parámetros
    var params = {};
    //Referencia a la clase para callback
    var self = this;

    var params = [{
        name: 'idTAR',
        value: req.query.idTAR,
        type: self.model.types.INT
        },
        {
        name: 'idOsur',
        value: req.query.idOsur,
        type: self.model.types.STRING
        }];

    this.model.query('SEL_OSUR_APLICACION_SP', params, function (error, result) {
        //Callback
        object.error = error;
        object.result = result;

        self.view.expositor(res, object);
    });
}
module.exports = Osur;