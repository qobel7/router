/**
 * Created by caner on 28/04/15.
 */
window.pageName;
BIP= {};
BIP.changeContent={
    init:function(button){
       // console.log($(button));
        var methods = $(button).attr('data-method');
        var controller = $(button).attr('data-controller');
        var is_modal = $(button).attr('is_modal');
        var modal_name = $(button).attr('modal-name');
        var modal_header = $(button).attr('modal-header');
        var language = $(button).attr('data-language');
        var base_url = $(button).attr('base_url');
        var url = base_url+'index.php/'+controller+'/route?page='+methods;
        var modal_url = base_url+'index.php/'+controller+'/'+methods;
        window.pageName=methods;
        BIP.router.init(methods,url,is_modal,modal_name,language,modal_url,modal_header);
    }
};
BIP.router = {
    method: 'post',
    url: '',
    modal_url:'',
    is_modal: false,
    modal_name: null,
    that:this,
    language:null,
    init: function (methods, url, is_modal,  modal_name,language,modal_url,modal_header) {
        if (methods == 'post' || methods == null)
            this.method = 'post';
        else
            this.method = 'get';
        this.url = url;
        this.modal_url = modal_url;
        this.is_modal = is_modal;
        this.modal_name=modal_name;
        this.language=language;
        if(is_modal!=undefined && is_modal=='true') {
            console.log(is_modal);
            this.openModal(modal_header);
        } else{
            this.changeIframe();
        }
    },
    openModal:function(modal_header){
        var modal = this.modal_name;
        $.ajax({
            url:this.modal_url,
            type:'post',
            data:{'lang':window.language},
            success:function(response){
                $('.'+modal+' .modal-body').html(response);
                $('.'+modal+' .modal-header h1').html(modal_header);
                $('.'+modal).modal('show');
            }
        });
    },
    changeIframe: function () {
        var status = BIP.pageStatus.pageStatusCheck();
        if(status == 'true') {
            var iframelive = $('iframe.live');
            var iframeedit = $('iframe.edit');
           /* console.log(iframelive.attr('src'));*/
            iframelive.attr('src', this.url + '&language='+this.language+'&is_admin=false');
            /*console.log(iframeedit.attr('src'));*/
            iframeedit.attr('src', this.url + '&language='+this.language+'&is_admin=1');
        }else{
            $('.save-alert-modal').modal('show');
        }
    }
};
$('.menu_item').click(function(){
    BIP.changeContent.init(this);
});
BIP.pageStatus={
    pageStatusCheck:function(){
        var inside = $('.edit').contents();
        var child = inside.children().children();
        console.log(child[1]);
        return $(child[1]).attr('data-status');
    },
    setPageStatus:function(tf){
        //debugger;
    var inside = $('.edit').contents();
    var child = inside.children().children();
    console.log(child[1]);
    return $(child[1]).attr('data-status',tf);
    },
    saveData:function(){
        var inside = $('.edit').contents();
        var data = inside.find('.page-data-value').attr('data-value');
        var url = '/index.php/'+window.pageName+'/saveData';

        var that = this;
        $.ajax({
            url:url,
            type:'post',
            data:{'data':data},
            success:function(response){
                console.log(response);
                that.setPageStatus(true);
            }
        });
    },
    dontSave:function(status){
        BIP.pageStatus.setPageStatus(status);
        BIP.router.changeIframe();
        $('.save-alert-modal').modal('hide');
    }
};
BIP.sendLive={
    init:function(page,lang){
        var status = BIP.pageStatus.pageStatusCheck();
        if(status != 'true') {
            $('.save-alert-modal').modal('show');
        }else{
            var url = '/index.php/'+page+'/sendLive';
            $.ajax({
                url:url,
                type:'post',
                data:{'lang':lang},
                success:function(response){

                    console.log(response);
                   // debugger;
                    toastr.info('Sending ...');
                    setTimeout(function(){
                    BIP.reloadIframes.init(page);
                        $('.publish-side').removeClass('open');
                        $('.publish-page').removeClass('open');
                    },2000);
                }
            });
        }
    }/*,
    sendLiveWithLanguage:function(lang){
        var status = BIP.pageStatus.pageStatusCheck();

        if(status != 'true') {
            $('.save-alert-modal').modal('show');
        }else{
            var url = '/index.php/page_components/sendLiveWithLanguage';
            $.ajax({
                url:url,
                type:'post',
                data:{'lang':lang},
                success:function(response){

                    console.log(response);
                    // debugger;
                    BIP.reloadIframes.init(page);
                    $('.publish-side').removeClass('open');
                    $('.publish-page').removeClass('open');
                }
            });
        }

    }*/
};
BIP.reloadIframes={
    init:function(page){
        if(page=='page_components')
            page='home';
        var iframelive = $('iframe.live');
        var iframeedit = $('iframe.edit');
        var url = window.location.origin+'/index.php/router/route?page=home';
        iframelive.attr('src', url + '&language=en&is_admin=false');
        iframeedit.attr('src', url + '&language=en&is_admin=1');
    }
};
BIP.ajaxRequest={
    init:function(url,data,onSuccess){
        $.ajax({
            url:url,
            type:'post',
            data:data,
            success:function(response){
             //   debugger;
                onSuccess(response,data);
            }
        });
    },
    changeMetaTagContent:function(response,data){
        var div = $('.metatagcontent');
        div.html($(response).children());
        var select = $('.meta-form-select-page');
        var page_option = $('option[value="'+data.page+'"]');
        page_option.attr('selected','true');
    }
};
