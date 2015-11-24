(function ($) {

  var FAV_KEY = "picklete_fav";

  // if ('ontouchstart' in document.documentElement) {
  //   // if mobile we we use a backdrop because click events don't delegate
  //   $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
  // }

  // add to favorite
  $(".container").on("click", ".item-like, .label-like", function (e) {
    e.preventDefault();

    if ( ! window.USER)
      return $('#modal-login').modal('show');

    // save item to favorite
    var target = e.currentTarget;
    var favs = Cookies.getJSON(FAV_KEY) || {};
    var productId = $(target).attr("data-productId");

    if ($(target).hasClass("active")) {
      $(target).removeClass("active");

      if (favs[productId]) {
        favs[productId] = null;
        delete favs[productId];
      }
    } else {
      $(target).addClass("active");
      favs[productId] = true;
    }

    Cookies.set(FAV_KEY, favs, { expires: 2592000 });

    $.ajax({
      url : '/favorite/add',
      type: "post",
      success:function(data, textStatus, jqXHR)
      {
        console.log(data);
      },
      error: function (jqXHR, exception) {
        console.log(jqXHR);
      }
    });

  });

  // remove from favorite list
  $(".container").on("click", ".fav-item-move", function (e) {
    e.preventDefault();
    if ( ! window.USER)
      return $('#modal-login').modal('show');

    // save item to favorite
    var target = e.currentTarget;
    var favs = Cookies.getJSON(FAV_KEY) || {};
    var productId = $(target).attr("data-productId");

    if (favs[productId]) {
      favs[productId] = null;
      delete favs[productId];
    }

    Cookies.set(FAV_KEY, favs, { expires: 2592000 });
    $(target).parent().parent().remove();

  });



  var travelFavorite = function () {

    var favs = Cookies.getJSON(FAV_KEY) || {};
    var target = $(".label-like");
    if (target) {
      var productId = target.attr("data-productId");
      if (favs[productId])
        target.addClass("active");
    }

    for (prop in favs) {
      var target = $(".item-like[data-productId=" + prop + "]");
      if (target)
        target.addClass("active");
    }

  };

  travelFavorite();

  // add to cart
  $(".container").on("click", ".add-to-cart", function (e) {
    e.preventDefault();
    console.log('add to cart');

    var picklete_cart = Cookies.get('picklete_cart');
    if (picklete_cart == undefined) picklete_cart = {orderItems: []};
    else {
      picklete_cart = JSON.parse(picklete_cart);
    }

    var productGmId = $(this).attr("data-productGmId");
    var productId = $(this).attr("data-productId");
    var quantity = $('input[name="quant[1]"]').val() || 1;
    var price = $(this).attr("data-price");
    var photos = JSON.parse($(this).attr("data-photos"));
    var brand = $(this).attr("data-brand");
    var brandname = $(this).attr("data-brandname") || "";
    var name = $(this).attr("data-name") || "";
    var originPrice = $('#originPrice').text();
    var packable;
    var expressable;

    if($("#service-3").hasClass('disabled'))
      packable = false;
    else
      packable = true;

    if($("#service-2").hasClass('disabled'))
      expressable = false;
    else
      expressable = true;

    var stockQuantity = $("input[type='text'][min='1']").attr('max');

    console.log('=== picklete_cart ===', picklete_cart);
    console.log('=== productId ===', productId);
    console.log('=== quantity ===', quantity);
    console.log('=== price ===', price);
    console.log('=== packable ===',packable);
    console.log('=== stockQuantity ===',stockQuantity);

    var addProduct = {
      productGmId: productGmId,
      ProductId: productId,
      quantity: quantity,
      brandname: brandname,
      price: price,
      brand: brand,
      name: name,
      photos: photos,
      originPrice: originPrice,
      packable: packable,
      expressable: expressable,
      stockQuantity: stockQuantity
    }

    // check product is added, it will added to same data
    var isTheSame = false;
    for(var orderItem of picklete_cart.orderItems) {
      if(orderItem.ProductId == addProduct.ProductId) {
        isTheSame = true;
        orderItem.quantity = (parseInt(orderItem.quantity,10) + parseInt(addProduct.quantity,10)).toString();
        break;
      }
    }

    if( !isTheSame ) {
      picklete_cart.orderItems.push(addProduct);
    }

    Cookies.set('picklete_cart', picklete_cart);
    dropdownCartInit();

    if(mobileAndTabletcheck()){
      if (confirm("立即前往結帳嗎？") == true) {
        window.location = "/user/cart";
      }
    }

  });

  var mobileAndTabletcheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  }

  var dropdownCartInit = function(){

    var picklete_cart = Cookies.get('picklete_cart');
    if (picklete_cart == undefined) picklete_cart = {orderItems: []};
    else {
      picklete_cart = JSON.parse(picklete_cart);
    }

    $('.order-items-count').text(picklete_cart.orderItems.length);
    var dropdownCart = $('.dropdown-cart-content');

    dropdownCart.empty();

    var totalPrice = 0;

    picklete_cart.orderItems.forEach(function(orderItem){
      var price = parseInt(orderItem.price, 10);
      if(orderItem.stockQuantity <= 0){
        alert(orderItem.name + '商品數項已售完，請至購物車修改');
      }
      var liOrderItem =
        '<li>' +
        '  <div class="row">' +
        '    <div class="col-xs-4">' +
        '      <div class="item-block">' +
        '        <span class="badge">'+orderItem.quantity+'</span>' +
        '        <img src="'+orderItem.photos[0]+'" class="img-full">' +
        '      </div>' +
        '    </div>' +

        '    <div class="col-xs-8 p-left-0">' +
        '      <h6 class="text-muted"><a href="/brands">'+orderItem.brandname+'</a></h6>' +
        '      <h5><a href="/shop/products/'+orderItem.productGmId+'/'+orderItem.ProductId+'">' + orderItem.name + '</a></h5>' +
        '      <h5>$ '+ price.formatMoney() +'</h5>' +
        '    </div>' +
        '  </div>' +
        '</li>';

      totalPrice += parseInt(orderItem.price*orderItem.quantity, 10);

      dropdownCart.append(liOrderItem);

    });

    var liEnd =
      '<li>' +
      '  <div class="row">' +
      '    <div class="col-xs-6">' +
      '      <h2 class="text-center text-black line-height-small m-top-0 m-bottom-0">$ '+ totalPrice.formatMoney() +'<br><small class="font-size-50">subtotal</small></h2>' +
      '    </div>' +
      '    <div class="col-xs-6"><a href="/user/cart" class="btn btn-black border-radius-circle btn-block">結帳</a></div>' +
      '  </div>' +
      '</li>';

    dropdownCart.append(liEnd);
  };

  dropdownCartInit();

  // if($("#verification").attr("data-verification")){
  //   $(this).notifyMe(
  //     'top',
  //     'cart',
  //     '<span class="glyphicon glyphicon-ok-circle m-right-2"></span>帳號已開通',
  //     '',
  //     500,
  //     3000
  //   );
  // }

}(jQuery));
