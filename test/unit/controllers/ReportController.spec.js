var moment = require('moment');
var sinon = require('sinon');
describe('about Report', () => {
  before(async (done) => {
    try {
      sinon.stub(UserService, 'getLoginState', (req) => {
        return true;
      });

      let newUser = {
        username: 'testOrderUser',
        email: 'smlsun@gmail.com',
        password: 'testuser',
      };
      let createdUser = await db.User.create(newUser);

      let newOrder = {
        quantity: 10,
        serialNumber: '11223344',
        UserId: createdUser.id,
      };
      let testOrder = await db.Order.create(newOrder);

      let productOne = {
        name: '泡麵',
        description: '就泡麵',
        stockQuantity: 5,
        price: 5,
      };
      let testProducts = await db.Product.create(productOne);

      let orderItemOne = {
        name: testProducts.name,
        description: testProducts.description,
        quantity: 10,
        price: 10,
        spec: testProducts.spec,
        ProductId: testProducts.id,
        OrderId: 1,
      };
      await db.OrderItem.create(orderItemOne);

      done();

    } catch (e) {
      done(e)
    }
  });

  after((done) => {
    UserService.getLoginState.restore();
    done();
  });

  it('Report export to Excel', (done) => {

    let data = {
      date: moment().format('YYYY-MM').toString(),
    };

    request(sails.hooks.http.app).post('/report/export').send(data).end((err, res) => {
      if (res.statusCode === 500) {
        return done();
      }

      res.statusCode.should.equal(200);
      let result = res.body;
      done(err);
    });
  });

  it('Report export date list', (done) => {

    request(sails.hooks.http.app).get('/report/list').end((err, res) => {
      if (res.statusCode === 500) {
        return done();
      }

      res.statusCode.should.equal(200);
      let result = res.body;
      result.should.be.Array;
      result[0].should.be.Array;
      result[0][0].should.be.String;
      result[0][1].should.be.String;
      done(err);
    });
  });

  describe('Report Order Data in JSON format', done => {
    // 序號    訂單金額    付款確認日期    付款金額    轉帳金額    付款方式    使用點數    備註
    before(async (done) => {
      try {
        // sinon.stub(UserService, 'getLoginState', (req) => {
        //   return true;
        // });
        //
        let newUser = {
          username: 'testOrderUser',
          email: 'smlsun1@gmail.com',
          password: 'testuser',
        };
        let createdUser = await db.User.create(newUser);


        // let newInvoice = {
    		// 	"type": "duplex",
    		// 	"taxId": null,
    		// 	"charityName": null,
    		// 	"title": null,
    		// 	"createdAt": "2015-11-10 14:45:58",
    		// 	"updatedAt": "2015-11-10 14:45:58"
    		// }
        // await db.Shipment.create(newShipment);


        let newOrder = {
          quantity: 10,
          serialNumber: '11223345',
          UserId: createdUser.id,
        };
        let testOrder = await db.Order.create(newOrder);

        let productOne = {
          name: '泡麵',
          description: '就泡麵',
          stockQuantity: 5,
          price: 5,
        };
        let testProducts = await db.Product.create(productOne);

        let orderItemOne = {
          name: testProducts.name,
          description: testProducts.description,
          quantity: 10,
          price: 10,
          spec: testProducts.spec,
          ProductId: testProducts.id,
          OrderId: newOrder.id,
        };
        await db.OrderItem.create(orderItemOne);

        let newShipment = {
    			"username": "傅耀德",
    			"mobile": "0953790799",
    			"taxId": null,
    			"email": null,
    			"address": "207 新北市萬里區123123",
    			"shippingType": "delivery",
    			"shippingRegion": "自動計算",
    			"shippingFee": 60,
    			"shippingId": null,
    			"deliveryTimeType": "2015-11-18",
    			"createdAt": "2015-11-10 14:46:20",
    			"updatedAt": "2015-11-10 14:46:20",
    			"OrderId": testOrder.id
        }
        await db.Shipment.create(newShipment);

        done();
      } catch (e) {
        console.log(e)
        done(e)
      }

    });
    //
    // after((done) => {
    //   UserService.getLoginState.restore();
    //   done();
    // });

    it.only('Report export to Excel', (done) => {
      let data = {};
      request(sails.hooks.http.app).post('/api/report/orders').send(data).end((err, res) => {
        if (res.statusCode === 500) {
          return done();
        }

        res.statusCode.should.equal(200);
        let result = JSON.parse(res.text);
        console.log('----',JSON.stringify(result,null,4));
        result.should.have.keys('orders','ordersPaymentTotal');
        result.orders.should.be.Array;
        // result[0].should.have.keys('TradeNo','MerchantTradeNo','allPayRtnCode','allPayPaymentType','merchantTradeDate','paymentConfirmDate','paymentTotalAmount','description')
        done(err);
      });
    });

  });

});
