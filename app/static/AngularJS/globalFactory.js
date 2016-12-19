registrationModule.factory('globalFactory', function () {
    
    return {
    
        waitDrawDocument: function (dataTable, title) {
            setTimeout(function () {
                $('.' + dataTable).DataTable({
                    dom: '<"html5buttons"B>lTfgitp',
                    "iDisplayLength": 100,
                    buttons: [
                        {
                            extend: 'excel',
                            title: title
                        },
                        {
                            extend: 'print',
                            customize: function (win) {
                                $(win.document.body).addClass('white-bg');
                                $(win.document.body).css('font-size', '10px');

                                $(win.document.body).find('table')
                                    .addClass('compact')
                                    .css('font-size', 'inherit');
                            }
                        }
                    ]
                });
            }, 2500);
        }
    }

});
