/*
 * TablePagination - for html table paging
 * @version 0.1
 * @author gaoomei@gmail.com
 * @url https://github.com/yunfong/table-pagination
 * ===========================================================
 * usage: 
	new TablePager({
        table:$('.dataTable')
    })
 *
 */

function TablePager(options) {
    this.options = {
        page:1,
        pageSize:10,
        pageCount:0,
        container:null,
        containerClass:null
    };
    $.extend(true,this.options,options);
    this.init();
    this.jumpTo(this.options.page);
}

TablePager.prototype.onUpdate = undefined;

TablePager.prototype.init = function(){

    this.table = $(this.options.table);
    this.rows = [];
    var _this = this;
    $(this.table.get(0).tBodies).each(function(){
        $(this.rows).each(function(){
            _this.rows.push(this);
        })
    });

    this.options.pageCount = Math.ceil(this.rows.length / this.options.pageSize);

    var _this = this;
    this.options.container = this.options.container && $(this.options.container);
    if(this.options.container && (this.options.container.length > 0 || this.options.container.get(0))){
        this.container = this.options.container;
    }else{
        this.container = $('<div />').addClass(this.options.containerClass);
        this.table.parent().append(this.container);
    }
    this.container.on('click','.pagination-button',function (event) {
        var no = $(this).data('no');
        if($.isNumeric(no)){
            _this.jumpTo(no,event);
        }
    })
}

TablePager.prototype.isFirst = function () {
    return this.options.page == 1;
}

TablePager.prototype.isLast = function () {
    var page = this.options.page,pageCount = this.options.pageCount;
    return (pageCount == 0 || page == pageCount);
}
TablePager.prototype.showPage = function (i) {
    var page = this.options.page,pageCount = this.options.pageCount;

    if (i == 1 || i == 2 || i == pageCount || i == (pageCount - 1)) {
        return true;
    }
    if (Math.abs(i - page) < 4) {
        return true;
    }
    if (page < 6 && i < 9) {
        return true;
    }
    if (page > (pageCount - 6) && i > (pageCount - 9)) {
        return true;
    }
    return false;
}

TablePager.prototype.updateUI = function () {
    var pagination = $("<ul class='pagination pagination-sm' />");
    var li,page = this.options.page,pageCount = this.options.pageCount;
    if(this.isFirst()){
        li = $("<li class='disabled'/>").append(
            $("<a href='javascript:void(0)' onclick='return false;' />").text(" < ")
        );
    }else{
        li = $("<li/>").append(
            $("<a href='#' class='pagination-button' />").data('no',page - 1).text(" < ")
        );
    }
    pagination.append(li)

    if(pageCount < 13){
        for (var i = 1; i <= pageCount; i++) {
            var isActive = page == i;
            li =  $("<li/>").addClass(isActive ? 'active':'')
                .append(
                $("<a href='#' />").data('no',i).text(i).addClass(isActive?'':'pagination-button')
            );
            pagination.append(li)
        }
    }else{
        var pages = {};
        var canJump = false;
        var isActive = false;

        for(var i = 1;i<=pageCount;i++){
            if(this.showPage(i)){
                if(!pages[i]){
                    pages[i] = true;
                    isActive = page == i
                    li =  $("<li/>").addClass(isActive ? 'active':'')
                        .append(
                            $("<a href='#' />").data('no',i).text(i).addClass(isActive?'':'pagination-button')
                        );
                    canJump = true;
                }
            }else if (canJump){
                li = $("<li class='disabled'><a>...</a></li>");
                canJump = false;
            }
            pagination.append(li);
        }
    }

    if(this.isLast()){
        li = $("<li class='disabled'/>").append(
            $("<a href='javascript:void(0)' onclick='return false;' />").text(" > ")
        );
    }else{
        li = $("<li/>").append(
            $("<a href='#' class='pagination-button' />").data('no',page + 1).text(" > ")
        );
    }
    pagination.append(li);
    this.container.empty().append(pagination);
    this.onUpdate && this.onUpdate(this);
}

TablePager.prototype.jumpTo = function (no,event) {
    this.options.page = no;

    var start = this.options.pageSize * (no - 1);

    this.table.find('tbody').each(function () {
        $(this).empty();
    })

    var tbody = this.table.find('tbody:first');

    for(var i = 0;i<=this.options.pageSize;i++){
        tbody.append(this.rows[start + i]);
    }
    this.updateUI();
    event&&event.preventDefault();
}

