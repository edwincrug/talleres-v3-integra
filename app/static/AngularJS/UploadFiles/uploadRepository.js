
registrationModule.factory('uploadRepository', function () {
    return {
        getDzOptions: function (acceptedFiles, maxFiles) {
            var dzOptions = {
                url: '/api/cotizacion/uploadfiles',
                autoProcessQueue: false,
                uploadMultiple: true,
                addRemoveLinks: true,
                parallelUploads: 20,
                acceptedFiles: acceptedFiles,/*"image/*,application/pdf,.mp4,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/docx,application/msword,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/xml,.docX,.DOCX,.ppt,.PPT",*/
                createImageThumbnails: true,
                maxFiles: maxFiles,
                dictDefaultMessage : ''
            };

            return dzOptions;
        }
    }

});