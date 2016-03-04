import Allpay from '../../../api/services/AllpayService';

describe("about Allpay service", function() {
  let allpay, order;
  before(async(done) => {
    try {
      allpay = new Allpay({
      	merchantID: '2000132',
      	hashKey: '5294y06JbISpM5x9',
      	hashIV: 'v77hoKGq4kWxNNIS',
      	debug: true,
        prod: false,
        ReturnURL: sails.config.allpay.ReturnURL,
        ClientBackURL: sails.config.allpay.ClientBackURL,
        PaymentInfoURL: sails.config.allpay.PaymentInfoURL,
        allpayModel: db.Allpay
    	});
      order = await db.Order.create({
  			"id": 1,
  			"serialNumber": "W2016030200000",
  			"quantity": 1,
  			"merchantTradeNo": "20001328e2bca131",
  			"paymentTotalAmount": 372,
  			"useBunusPoint": 0,
  			"description": "",
  			"status": "new",
  			"packingFee": 0,
  			"packingQuantity": 0,
  			"UserId": 1,
      })

      await db.Allpay.create({
  			"MerchantTradeNo": "2000132816da8db1",
  			"OrderId": order.id
      })

      await db.Allpay.create({
  			"MerchantTradeNo": "sdkfsldfjkl23s",
  			"OrderId": order.id
      });

      await db.Allpay.create({
  			"MerchantTradeNo": "cavAsdasdasdasd",
  			"OrderId": order.id
      });

      done();
    } catch (e) {
      sails.log.error(e);
      done(e);
    }
  });

  it('check gen checkValue', function(done) {
    try {
      let data = { MerchantID: '2000132',
        MerchantTradeNo: '200013244f273b61',
        MerchantTradeDate: '2016/03/02 14:18:22',
        PaymentType: 'aio',
        TotalAmount: 310,
        TradeDesc: 'Allpay push order test',
        ItemName: '月圓人團圓好吃柚子(圓滿柚)X1',
        ReturnURL: 'http://localhost:1337/allpay/paid',
        ChoosePayment: 'Credit',
        ClientBackURL: 'http://localhost:1337/shop/done?t=200013244f273b61',
        PaymentInfoURL: 'http://localhost:1337/allpay/paymentinfo'
      }
      let genData = allpay.genCheckMacValue(data);
      console.log(genData);
      genData.CheckMacValue.should.be.an.equal('A5C94058EB3AB5E11319F92F0D3D725B');
      done()
    } catch (e) {
      sails.log.error(e)
      done(e)
    }
  });

  it('check getAllpayConfig', async function(done) {
    try {
      let data = {
        relatedKeyValue: {
          OrderId: order.id
        },
        MerchantTradeNo: '123',
        tradeDesc:'test gen config',
        totalAmount: 999,
        paymentMethod: 'ATM',
        itemArray: ['Item01', 'Item02'],
      }
      let result = await allpay.getAllpayConfig(data);
      console.log(result);
      result.MerchantTradeNo.should.be.an.equal(data.MerchantTradeNo);
      result.ChoosePayment.should.be.an.equal(data.paymentMethod)
      done()
    } catch (e) {
      sails.log.error(e)
      done(e)
    }
  });

  it('check getAllpayConfig paymentMethod = All', async function(done) {
    try {
      let data = {
        relatedKeyValue: {
          OrderId: order.id
        },
        MerchantTradeNo: '123123',
        tradeDesc:'test gen config',
        totalAmount: 999
      }
      let result = await allpay.getAllpayConfig(data);
      console.log(result);
      result.MerchantTradeNo.should.be.an.equal(data.MerchantTradeNo);
      result.ChoosePayment.should.be.an.equal('ALL');
      done()
    } catch (e) {
      sails.log.error(e)
      done(e)
    }
  });

  it('PaymentInfoURL allpay by ATM',async (done) => {
    try {
      let data = {
        MerchantID : '123456789',
        MerchantTradeNo : 'sdkfsldfjkl23s',
        RtnCode : '2',
        RtnMsg : 'Get VirtualAccount Succeeded',
        TradeNo : 'sdkfsldfjkl23',
        TradeAmt : 22000,
        PaymentType : 'ATM_TAISHIN',
        TradeDate : '2012/03/15 17:40:58',
        CheckMacValue : '18196F5D22DB1D0E2B4858C2B1719F40',
        BankCode: '812',
        vAccount: '9103522175887271',
        ExpireDate: '2013/12/16'
      };
      let result = await allpay.paymentinfo(data);
      result.dataValues.MerchantTradeNo.should.be.an.equal(data.MerchantTradeNo);
      result.dataValues.RtnCode.should.be.an.equal(data.RtnCode);
      result.dataValues.shouldTradeAmt.should.be.an.equal(data.TradeAmt);
      result.dataValues.PaymentType.should.be.an.equal(data.PaymentType);
      result.dataValues.BankCode.should.be.an.equal(data.BankCode);
      result.dataValues.vAccount.should.be.an.equal(data.vAccount);
      result.dataValues.ExpireDate.should.be.an.equal(data.ExpireDate);
      done()
    } catch (e) {
      done(e)
    }
  });

  it('allpay PaymentInfoURL return post by CVS or BARCODE', async (done) => {
    try {
      let data = {
        MerchantID : '123456789',
        MerchantTradeNo : 'cavAsdasdasdasd',
        RtnCode : '2',
        RtnMsg : 'Get VirtualAccount Succeeded',
        TradeNo : 'cavAsdasdasdasd',
        TradeAmt : 22000,
        PaymentType : 'ATM_TAISHIN',
        TradeDate : '2012/03/15 17:40:58',
        CheckMacValue : '98AA8486E3D4CC3B80C6795C16CB74FB',
        PaymentNo: 'GW130412257496',
        ExpireDate: '2013/12/16 18:00:00',
        Barcode1: '021030627',
        Barcode2: '2470200001841540',
        Barcode3: '103027000000100'
      };
      let result = await allpay.paymentinfo(data);
      result.dataValues.MerchantTradeNo.should.be.an.equal(data.MerchantTradeNo);
      result.dataValues.RtnCode.should.be.an.equal(data.RtnCode);
      result.dataValues.shouldTradeAmt.should.be.an.equal(data.TradeAmt);
      result.dataValues.PaymentType.should.be.an.equal(data.PaymentType);
      result.dataValues.PaymentNo.should.be.an.equal(data.PaymentNo);
      result.dataValues.ExpireDate.should.be.an.equal(data.ExpireDate);
      result.dataValues.Barcode1.should.be.an.equal(data.Barcode1);
      result.dataValues.Barcode2.should.be.an.equal(data.Barcode2);
      result.dataValues.Barcode2.should.be.an.equal(data.Barcode2);
      done()
    } catch (e) {
      done(e)
    }
  });

  it('paid allpay',async (done) => {
    try {
      let data = {
        MerchantID : '123456789',
        MerchantTradeNo : '2000132816da8db1',
        RtnCode : '1',
        RtnMsg : 'paid',
        TradeNo : '201203151740582564',
        TradeAmt : 22000,
        PaymentDate : '2012/03/16 12:03:12',
        PaymentType : 'ATM_TAISHIN',
        PaymentTypeChargeFee : 25,
        TradeDate : '2012/03/15 17:40:58',
        SimulatePaid : 0,
        CheckMacValue : 'FD79C15859F58D0BC24CDE67F59CC81C',
      };
      let result = await allpay.paid(data);
      result.dataValues.MerchantTradeNo.should.be.an.equal(data.MerchantTradeNo);
      result.dataValues.RtnCode.should.be.an.equal(data.RtnCode);
      result.dataValues.RtnMsg.should.be.an.equal(data.RtnMsg);
      result.dataValues.TradeAmt.should.be.an.equal(data.TradeAmt);
      done()
    } catch (e) {
      done(e)
    }
  });

});
