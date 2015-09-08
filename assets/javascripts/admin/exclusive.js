(function ($) {
  $("ul").sortable();

  $('.row').on('click','.delete-link',function(e){
    e.preventDefault();
    var that = $(this);
    if(that.context.nextElementSibling == null){
      that.parent().parent().parent().remove();
    }
  });

  $('.row').on('click','.btn-green',function(e){
    e.preventDefault();
    var $checked = $('input:checkbox:checked[name="exclusive-type"]').map(function() { return $(this).val(); }).get();
    var $img = ['http://fakeimg.pl/1100x160/dddddd/FFF/?text=1100x160','http://fakeimg.pl/1100x350/dddddd/FFF/?text=1100x350','http://fakeimg.pl/545x350/dddddd/FFF/?text=545x350','http://fakeimg.pl/360x230/dddddd/FFF/?text=360x230']

    for (var check in $checked){
      if(check == 0){
        $('ul.col-sm-9.col-md-10').append('<li class="well control-well p-10-20 m-bottom-8"><div class="row"><div class="col-sm-6"><span class="glyphicon glyphicon-menu font-size-xlarge m-top-1"></span></div><div class="col-sm-6 text-right"><a href="#" class="btn btn-link delete-link"><span class="glyphicon glyphicon-remove"></span></a></div></div><form class="form-horizontal"><div class="row row-s m-bottom-4"><div class="col-xs-12"><div data-provides="fileinput" class="fileinput fileinput-new"><div class="fileinput-new"><img src="'+$img[0]+'" class="img-full"></div><div class="fileinput-preview fileinput-exists"></div><div class="fileinput-btn"><span class="btn btn-default btn-sm btn-file"><span class="fileinput-new">Select image</span><span class="fileinput-exists">Change</span><input type="file" name="..."></span><a href="#" data-dismiss="fileinput" class="btn btn-default btn-sm fileinput-exists">Remove</a></div></div></div></div><div class="form-group"><div class="col-sm-9 col-md-9"><input type="text" placeholder="連結網址" class="form-control"></div><div class="col-sm-3 col-md-3"><div class="checkbox"><label><input type="checkbox"> 另開視窗</label></div></div></div></form></li>');
      }
      if(check == 1){
        $('ul.col-sm-9.col-md-10').append('<li class="well control-well p-10-20 m-bottom-8"><div class="row"><div class="col-sm-6"><span class="glyphicon glyphicon-menu font-size-xlarge m-top-1"></span></div><!-- /col-sm-6--><div class="col-sm-6 text-right"><a href="#" class="btn btn-link delete-link"><span class="glyphicon glyphicon-remove"></span></a></div><!-- /col-sm-6--></div><!-- /row--><form class="form-horizontal"><div class="row row-s m-bottom-4"><div class="col-xs-12"><div data-provides="fileinput" class="fileinput fileinput-new"><div class="fileinput-new"><img src="'+$img[1]+'" class="img-full"></div><!-- /fileinput-new--><div class="fileinput-preview fileinput-exists"></div><!-- /fileinput-preview--><div class="fileinput-btn"><span class="btn btn-default btn-sm btn-file"><span class="fileinput-new">Select image</span><span class="fileinput-exists">Change</span><input type="file" name="..."></span><a href="#" data-toggle="modal" data-target="#modal-delete" class="btn btn-link delete-link"><span class="glyphicon glyphicon-remove"></span></a></div><!-- /fileinput-btn--></div><!-- /fileinput--></div><!-- /col-xs-12--></div><!-- /row--><div class="form-group"><div class="col-sm-9 col-md-9"><input type="text" placeholder="連結網址" class="form-control"></div><!-- /col-sm-9--><div class="col-sm-3 col-md-3"><div class="checkbox"><label><input type="checkbox"> 另開視窗</label></div></div></div><!-- /form-group--></form></li>');
      }
      if(check == 2){
        $('ul.col-sm-9.col-md-10').append('<li class="well control-well p-10-20 m-bottom-8"><div class="row"><div class="col-sm-6"><span class="glyphicon glyphicon-menu font-size-xlarge m-top-1"></span></div><!-- /col-sm-6--><div class="col-sm-6 text-right"><a href="#" class="btn btn-link delete-link"><span class="glyphicon glyphicon-remove"></span></a></div><!-- /col-sm-6--></div><!-- /row--><form class="form-horizontal"><div class="row row-s"><div class="col-xs-6"><div data-provides="fileinput" class="fileinput fileinput-new m-bottom-4"><div class="fileinput-new"><img src="'+$img[2]+'" class="img-full"></div><!-- /fileinput-new--><div class="fileinput-preview fileinput-exists"></div><!-- /fileinput-preview--><div class="fileinput-btn"><span class="btn btn-default btn-sm btn-file"><span class="fileinput-new">Select image</span><span class="fileinput-exists">Change</span><input type="file" name="..."></span><a href="#" data-dismiss="fileinput" class="btn btn-default btn-sm fileinput-exists">Remove</a></div><!-- /fileinput-btn--></div><!-- /fileinput--><div class="form-group m-left-0 m-right-0"><div class="col-sm-9 col-md-9"><input type="text" placeholder="連結網址" class="form-control"></div><!-- /col-sm-9--><div class="col-sm-3 col-md-3"><div class="checkbox"><label><input type="checkbox"> 另開視窗</label></div></div></div><!-- /form-group--></div><!-- /col-xs-6--><div class="col-xs-6"><div data-provides="fileinput" class="fileinput fileinput-new m-bottom-4"><div class="fileinput-new"><img src="'+$img[2]+'" class="img-full"></div><!-- /fileinput-new--><div class="fileinput-preview fileinput-exists"></div><!-- /fileinput-preview--><div class="fileinput-btn"><span class="btn btn-default btn-sm btn-file"><span class="fileinput-new">Select image</span><span class="fileinput-exists">Change</span><input type="file" name="..."></span><a href="#" data-dismiss="fileinput" class="btn btn-default btn-sm fileinput-exists">Remove</a></div><!-- /fileinput-btn--></div><!-- /fileinput--><div class="form-group m-left-0 m-right-0"><div class="col-sm-9 col-md-9"><input type="text" placeholder="連結網址" class="form-control"></div><!-- /col-sm-9--><div class="col-sm-3 col-md-3"><div class="checkbox"><label><input type="checkbox"> 另開視窗</label></div></div></div><!-- /form-group--></div><!-- /col-xs-6--></div><!-- /row--></form></li>');
      }
      if(check == 3){
        $('ul.col-sm-9.col-md-10').append('<li class="well control-well p-10-20 m-bottom-8"><div class="row"><div class="col-sm-6"><span class="glyphicon glyphicon-menu font-size-xlarge m-top-1"></span></div><!-- /col-sm-6--><div class="col-sm-6 text-right"><a href="#" class="btn btn-link delete-link"><span class="glyphicon glyphicon-remove"></span></a></div><!-- /col-sm-6--></div><!-- /row--><form class="form-horizontal"><div class="row row-s m-bottom-4"><div class="col-xs-4"><div data-provides="fileinput" class="fileinput fileinput-new m-bottom-4"><div class="fileinput-new"><img src="'+$img[3]+'" class="img-full"></div><!-- /fileinput-new--><div class="fileinput-preview fileinput-exists"></div><!-- /fileinput-preview--><div class="fileinput-btn"><span class="btn btn-default btn-sm btn-file"><span class="fileinput-new">Select image</span><span class="fileinput-exists">Change</span><input type="file" name="..."></span><a href="#" data-dismiss="fileinput" class="btn btn-default btn-sm fileinput-exists">Remove</a></div><!-- /fileinput-btn--></div><!-- /fileinput--><div class="form-group m-left-0 m-right-0"><div class="col-sm-12"><input type="text" placeholder="連結網址" class="form-control"></div><!-- /col-sm-12--><div class="col-sm-12"><div class="checkbox"><label><input type="checkbox"> 另開視窗</label></div></div><!-- /col-sm-12--></div><!-- /form-group--></div><!-- /col-xs-4--><div class="col-xs-4"><div data-provides="fileinput" class="fileinput fileinput-new m-bottom-4"><div class="fileinput-new"><img src="'+$img[3]+'" class="img-full"></div><!-- /fileinput-new--><div class="fileinput-preview fileinput-exists"></div><!-- /fileinput-preview--><div class="fileinput-btn"><span class="btn btn-default btn-sm btn-file"><span class="fileinput-new">Select image</span><span class="fileinput-exists">Change</span><input type="file" name="..."></span><a href="#" data-dismiss="fileinput" class="btn btn-default btn-sm fileinput-exists">Remove</a></div><!-- /fileinput-btn--></div><!-- /fileinput--><div class="form-group m-left-0 m-right-0"><div class="col-sm-12"><input type="text" placeholder="連結網址" class="form-control"></div><!-- /col-sm-12--><div class="col-sm-12"><div class="checkbox"><label><input type="checkbox"> 另開視窗</label></div></div><!-- /col-sm-12--></div><!-- /form-group--></div><!-- /col-xs-4--><div class="col-xs-4"><div data-provides="fileinput" class="fileinput fileinput-new m-bottom-4"><div class="fileinput-new"><img src="'+$img[3]+'" class="img-full"></div><!-- /fileinput-new--><div class="fileinput-preview fileinput-exists"></div><!-- /fileinput-preview--><div class="fileinput-btn"><span class="btn btn-default btn-sm btn-file"><span class="fileinput-new">Select image</span><span class="fileinput-exists">Change</span><input type="file" name="..."></span><a href="#" data-dismiss="fileinput" class="btn btn-default btn-sm fileinput-exists">Remove</a></div><!-- /fileinput-btn--></div><!-- /fileinput--><div class="form-group m-left-0 m-right-0"><div class="col-sm-12"><input type="text" placeholder="連結網址" class="form-control"></div><!-- /col-sm-12--><div class="col-sm-12"><div class="checkbox"><label><input type="checkbox"> 另開視窗</label></div></div></div></div></div></form></li>');
      }        
    }
  });
}(jQuery));