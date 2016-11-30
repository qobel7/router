/**
 * Created by caner on 15/05/15.
 */
window.ajaxResponse = null;
EDIT = {};
EDIT.modal = {
    init: function (button) {
        var methods = $(button).attr('data-method');
        var controller = $(button).attr('data-controller');
        var is_modal = $(button).attr('is_modal');
        var modal_name = $(button).attr('modal-name');
        var modal_header = $(button).attr('modal-header');
        var language = $(button).attr('data-language');
        var base_url = $(button).attr('base_url');
        var modal_url = base_url + 'index.php/' + controller + '/' + methods;
        window.pageName = methods;
        this.openModal(modal_header, modal_name, modal_url);
    },
    openModal: function (modal_header, modal_name, modal_url, modal_components, data, onSuccess, id) {
        var modal = modal_name;
        if (modal_url != null) {
            $.ajax({
                url: modal_url,
                data: data,
                type: 'post',
                success: function (response) {
                    EDIT.modal.fillModal(response, modal_header, modal);
                    if (onSuccess)
                        onSuccess('/index.php/media_room/pdfUpload', id);
                }
            });
        } else {
            EDIT.modal.fillModal(modal_components, modal_header, modal)
        }
    },
    fillModal: function (response, modal_header, modal) {
        $('.' + modal + ' .modal-body').html(response);
        $('.' + modal + ' .modal-header h1').html(modal_header);
        $('.' + modal).modal('show');
    }
};
EDIT.save = {
    tab_id:null,
    newPdf: function (that) {
        this.tab_id = $(that).attr('tab-id');
        var data = {'lang': window.language};
        EDIT.ajaxRequest.init('/index.php/media_room/addNewPdf', data, EDIT.save.reloadTabContainer, EDIT.save.error);
    },
    reloadTabContainer:function(){
      EDIT.ajaxRequest.init('/index.php/media_room/getMediaRoomTabContent',{'lang':window.language,'tab-id':EDIT.save.tab_id},EDIT.save.swichTab,EDIT.save.error);
    },
    swichTab:function(response){
        toastr.info('New Component Added');
        $('#'+EDIT.save.tab_id).html(response);
    },
    news: function (that) {
        var count = $(that).attr('data-count');
        var iframeURL = document.location.href;
        $.ajax({
            url: '/index.php/news/saveNews',
            type: 'post',
            data: {'count': count},
            success: function (response) {
                console.log(response);
                console.log($('html').parent());
                location.replace(iframeURL);
            }
        });
    },
    fistModal: function (that) {
        var id = $(that).attr('id');
        var status = $(that).attr('data-value');
        var iframeURL = document.location.href;
        $.ajax({
            url: '/index.php/home/fistModalStatus',
            data: {'id': id, 'status': status},
            type: 'post',
            success: function (response) {
                console.log(response);
                location.replace(iframeURL);
            }
        });
    },
    saveForm: function (that,reload) {
        var form_id = $(that).attr('data-id');
        var method = $(that).attr('data-method');
        var controller = $(that).attr('data-controller');
        var content = $('#' + form_id).serializeArray();
        var url = '/index.php/' + controller + '/' + method;
        var iframeURL = location.href;
        console.log(content);
        $.ajax({
            url: url,
            type: 'post',
            data: {'data': content, 'lang': window.language},
            success: function (data) {
                console.log(data);
                //debugger;
                if(reload)
                location.replace(iframeURL);
                // $('.modal').modal('hide');
            }
        });
    },
    galeryImage: function (that) {
        this.tab_id = $(that).attr('tab-id');
        var count = $(that).attr('data-count');
        var language = $(that).attr('data-language');
        EDIT.ajaxRequest.init('/index.php/media_room/saveGaleryImage', {'count': count, 'lang': language}, EDIT.save.reloadTabContainer, EDIT.save.error);

    },
    sheetsImage: function (that) {
        this.tab_id = $(that).attr('tab-id');
        var count = $(that).attr('data-count');
        var language = $(that).attr('data-language');
        EDIT.ajaxRequest.init('/index.php/media_room/saveSheetsImage', {'count': count, 'lang': language}, EDIT.save.reloadTabContainer, EDIT.save.error);
    },
    sheetsTurkishImage: function (that) {
        this.tab_id = $(that).attr('tab-id');
        var count = $(that).attr('data-count');
        var language = $(that).attr('data-language');
        EDIT.ajaxRequest.init('/index.php/media_room/saveSheetsTurkishImage', {'count': count, 'lang': language}, EDIT.save.reloadTabContainer, EDIT.save.error);
    },
    TabAdd: function () {
        EDIT.ajaxRequest.init('/index.php/' + window.page + '/addNewTab', {'lang': window.language}, this.success, this.error);
    },
    success: function (response) {
        toastr.success('Operation complate');
        $('.modal').modal('hide');
        console.log(response);
        var iframeURL = document.location.href;
        location.replace(iframeURL);
    },
    error: function () {
        toastr.error('Operation not complate');
    }
};
EDIT.delete = {
    Tab: function (that) {
        var data_id = $(that).attr('data-id');
        var data = {'data-id': data_id, 'lang': window.language};
        EDIT.ajaxRequest.init('/index.php/' + window.page + '/tabDelete', data, this.success, this.error);
    },
    pdf:function(that){
        var data = $(that).attr('data-id');
        data = {'data-id':data,'lang':window.language};
        var parent = $(that).parent();
        parent.remove();
        EDIT.ajaxRequest.init('/index.php/media_room/deletePdf',data,null,this.error);
    },
    homeSlider: function (that) {
        var id = $(that).attr('data-id');
        var iframeURL = document.location.href;
        $.ajax({
            url: '/index.php/home/deleteSlider',
            data: {'id': id},
            type: 'post',
            success: function (response) {
                console.log(response);
                location.replace(iframeURL);
            }
        });
    },
    newsNews: function (that) {
        var id = $(that).attr('data-id');
        var iframeURL = document.location.href;
        $.ajax({
            url: '/index.php/news/deleteNews',
            data: {'id': id},
            type: 'post',
            success: function (response) {
                console.log(response);
                location.replace(iframeURL);
            }
        });
    },
    galeryImage: function (that) {
        var id = $(that).attr('data-id');
        var parent = $(that).parent();
        parent.remove();
        EDIT.ajaxRequest.init('/index.php/media_room/galeryImage',{'id': id},null,this.error);
    },
    sheetsImage: function (that) {
        var id = $(that).attr('data-id');
        var parent = $(that).parent();
        parent.remove();
        EDIT.ajaxRequest.init('/index.php/media_room/sheetsImageDelete',{'id': id},null,this.error);

    },
    sheetsTurkishImage: function (that) {
        var id = $(that).attr('data-id');
        var parent = $(that).parent();
        parent.remove();
        EDIT.ajaxRequest.init('/index.php/media_room/sheetsImageTurkishDelete',{'id': id},null,this.error);

    },
    success: function () {
        var iframeURL = document.location.href;
        toastr.success('Operation complate');
        location.replace(iframeURL);
    },
    error: function () {
        toastr.error('Operation not complate');
    }
};
EDIT.disableHref = {
    init: function () {
        var content = $('a');
        var contents = $('li a');
        content.attr('onclick', 'return false;');
        contents.attr('onclick', 'return false;');
    }
};
EDIT.reload = {
    init: function (type, url, modal_name) {
        if (type == 'modal')
            this.reloadModal(url, modal_name);
        if (type == 'page')
            this.reloadPage();
    },
    reloadModal: function (url) {
        var data = {page: window.page};
        EDIT.ajaxRequest.init(url, data, this.reload);
        console.log(window.ajaxResponse);
    },
    reload: function (response) {
        $('.img-selected-row').html('');
        var response_parse = JSON.parse(response);
        $.each(response_parse, function (index, value) {
            FILE.upload.addImgGalery(value);
        });
        $('#profile').tab('show');
    },
    reloadPage: function (url) {
        location.replace(url);
    }
};
EDIT.ajaxRequest = {
    init: function (url, data, onSuccess, onError) {
        $.ajax({
            url: url,
            type: 'post',
            data: data,
            success: function (response) {
               // console.log(response);

                onSuccess(response)
            },
            error: function (response) {

                onError(response);
            }
        });
    }
};
