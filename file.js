/**
 * Created by caner on 14/05/15.
 */
FILE={};
FILE.upload={
    page:'',
    open: function(page){
        $('.file-modal').modal('show','slow');
        this.page=page;
         this.fileUpload();
    },
    fileUpload:function(url_){
        $('.file_uploader').dropzone({
            url: url_,
            maxFilesize: 100,
            paramName: "file",
            maxThumbnailFilesize: 5,
            acceptedFiles: "image/jpeg,image/png,image/gif",
            init: function() {
                this.on('success', function(file, json) {
                    console.log(file);
                    console.log(json);
                    //CK.uploadFile.saveSrc(json);
                    /*that.addImgGalery(json);*/
                    EDIT.reload.init('modal','/index.php/page_components/reloadImages','img-selected-row');
                    toastr.success('Image Uploaded');
                    toastr.info('Click image tab ');
                });
                this.on('addedfile', function(file) {
                    console.log(file);
                });
                this.on('drop', function() {
                });
            }
        });

    },
    pdfUploader:function(url_,id_){
        Dropzone.autoDiscover = false;
        $('.pdf_uploader').dropzone({
            url: url_,
            maxFilesize: 100,
            paramName: "file",
            maxThumbnailFilesize: 5,
            acceptedFiles:'application/pdf',
            init: function() {
                this.on('success', function(file, json) {
                    console.log(file);
                    console.log(json);
                    FILE.upload.savePdfOnServer(file.name,id_);
                    toastr.success(file.name,id_);
                    //EDIT.reload.reloadPage(location.href);
                });
                this.on('addedfile', function(file) {
                    console.log(file);
                });
                this.on('drop',function(){
                });
                this.on('error',function(){
                    toastr.error('error');
                })
            }
        });

    },
    savePdfOnServer:function(data,id) {
        var array = Object();
        array['pdf_'+id+'_source']=data;
        var source = JSON.stringify(array);

        var datas = {data:source,lang:window.language};
        EDIT.ajaxRequest.init('/index.php/media_room/saveData', datas ,this.pdfUploadSuccess);
    },
    pdfUploadSuccess:function(){},
    addImgGalery:function(json){
        if(json != '.' && json != '..') {
            var src = '/assets/web/img/' + window.page + '/' + json;
            var img = '<img src="' + src + '" width = "160" height="160" class="img-selected img-rounded" data-placement="left" /> ';
            var div = '<div class="col-xs-4">' + img + '</div>';
            $('.img-selected-row').append(div);
        }
    }
};
