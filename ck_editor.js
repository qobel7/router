/**
 * Created by caner on 05/05/15.
 */
CK = {};
DATA = {};
FOOTER_DATA={};
var data = DATA;
var footer_data=FOOTER_DATA;
window.page = null;
window.saveStatus = 1;

window.language = 'en';
CK.editor = {
    init: function (page_name, language) {
        var that = this;
        window.language = language;
        CKEDITOR.disableAutoInline = true;
        window.page = page_name;
        $('.edit-space').live('click',function () {
            var div = $(this);
            that.createCkEditor(div,true);
        });
        $('.edit-space-footer').live('click',function () {
            var div = $(this);
            that.createCkEditor(div,false);
        });
    },
    createCkEditor: function (div,status) {
        window.saveStatus = 0;
        $(div).attr('contenteditable', "true");
        var id = div.attr('id');
        id = id.trim();
        //debugger;
        CKEDITOR.config.language = window.language;
        /*if (window.language == 'ar')
            CKEDITOR.config.contentsLangDirection = 'rtl';
        else
            CKEDITOR.config.contentsLangDirection = 'ltr';*/
        CKEDITOR.config.extraPlugins = 'sourcedialog';
        CKEDITOR.config.removePlugins = 'sourcearea';
        CKEDITOR.config.allowedContent=true;
        var k = CKEDITOR.inline(id.toString()/*, {
            extraPlugins: 'sourcedialog',
            removePlugins: 'sourcearea'
        }*/);
        k.on('blur', function (evt) {
            console.log('asda');
            //debugger;
            if(status)
                data[id.toString()] = evt.editor.getData();
            else
                footer_data[id.toString()]=evt.editor.getData();
            CK.statusSet(false);
            $('.page-data-img').attr('data-value', JSON.stringify(data));
            for (name_s in CKEDITOR.instances) {
                CKEDITOR.instances[name_s].destroy()
            }
        });
    }
};
CK.save = {
    convertJson: function (data) {
        return JSON.stringify(data);
    },
    saveData: function () {

        var datas = {'data': CK.save.convertJson(data), 'lang': window.language};
        var footer_datas = {'data': this.convertJson(footer_data), 'lang': window.language};
        var url = '/index.php/' + window.page + '/saveData';
        var footer_url = '/index.php/page_components/saveData';
        EDIT.ajaxRequest.init(url,datas,this.saveSuccess('Content Changes Saved'),this.saveError('Content has not Changes'));
        EDIT.ajaxRequest.init(footer_url,footer_datas,this.saveSuccess('Component Changes Saved'),this.saveError('Component has not Changes'));

    },

    saveSuccess:function(text){
        toastr.success(text);
        CK.statusSet(true);
    },
    saveError:function(text){
       // console.log(response);
      //  toastr.info(text);
       // toastr.error('Changes not saved');
    }


};
CK.uploadFile = {
    sourcediv: '',
    init: function (div) {
        var src = div.attr('src');
        this.saveSrc(src);
    },
    saveSrc: function (src) {
        var id = this.sourcediv.attr('id').trim();
        var img_data = {};
        var img = src.split('/');
        var srclenght = img.length;
        console.log(img[srclenght - 1]);
        img_data[id.toString()] = img[srclenght - 1];
        $.extend(data, img_data);
        this.setSrc(src);
        toastr.info('İmage Selected');
        $('.modal').modal('hide');
        CK.imgAlt.init(id);
    },
    putDiv: function (div) {
        this.sourcediv = div;
    },
    setSrc: function (src) {
        if (this.sourcediv.is('div'))
            this.sourcediv.css('background', 'url("'+src + '")');
        else(this.sourcediv.is('img'));
        this.sourcediv.attr('src', src);
    }
};
CK.statusSet = function (st) {
    $('body').attr('data-status', st);
};
CK.formSave = {
    saveForm: function (that,reload) {
        var form_id = $(that).attr('data-id').trim();
        var method = $(that).attr('data-method');
        var controller = $(that).attr('data-controller');
        var content = $('#' + form_id).serializeArray();
        var url = '/index.php/' + controller + '/' + method;
         $.ajax({
            url: url,
            type: 'post',
            data: {'data': content, 'lang': window.language},
            success: function (data) {
                toastr.success('Saved Your Changes');
                if(reload!=undefined)
                    location.replace(location.href);
                $('.modal').modal('hide');
                console.log(data);
            }
        });
    },
    openModal: function (modal_header) {
        var modal = this.modal_name;
        $.ajax({
            url: this.modal_url,
            success: function (response) {
                $('.' + modal + ' .modal-body').html(response);
                $('.' + modal + ' .modal-header h1').html(modal_header);
                $('.' + modal).modal('show');
            }
        });
    }
};
CK.imgAlt={
    img_id:null,
  init:function(id){
      this.img_id=id.replace('_id','_alt').trim();
      var div = this.components();
      EDIT.modal.openModal('Image Alt','general-large-modal',null,div);
  },
    components:function(){
        var div_text = $('<div class="form-group"></div>');
        var div_button = $('<div class="form-group"></div>');
        var form = $('<form></form>');
        var text_input =$('<input type="text" class="img-alt-text form-control" placeholder="Enter Image Alt information"> </input>');
        var button =$('<a class="btn btn-success pull-right" onclick="CK.imgAlt.saveAlt()">save</a>');
        div_text.append(text_input);
        div_button.append(button);
        form.append(div_text);
        form.append(div_button);
        return form;
    },
    saveAlt:function(){

        data[this.img_id+'_alt']=$('.img-alt-text').val();
        $('.modal').modal('hide');
        toastr.success('Save Selected Image Alt Information');
    }
};
Href = {
    init: function () {
        var content = $('a');
        var contents = $('li a');
        content.attr('onclick', 'return false;');
        contents.attr('onclick', 'return false;');
    }
};
