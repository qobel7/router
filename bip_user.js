/**
 * Created by caner on 21/05/15.
 */
USER={};
USER.select={
    content:{},
    table:'',
        init:function(that){
            this.table=that;
        var children = this.getChilds(that);
        var table_rows_contents = this.getContents(children);
        this.addUserInformation(table_rows_contents);
    },
    getChilds:function(that){
        return  $(that).child();
    },
    getContents:function(content){
        var contents =  Array();
        for(var i=0;i<content.length;i++) {
            contents[i]=$(content[i]).html();
            console.log(contents);
        }
    return this.content=contents;
    },
    addUserInformation:function(content){
        $('#users_list').hide();
        $('.user-info').show();
        var head = this.getContents(this.getChilds($('thead tr')));
        for(var i =0;i < content.length;i++) {
            $('.'+head[i]).html(content[i]);
        }
    }
};
