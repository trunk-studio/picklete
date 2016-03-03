import util from 'util';
import crypto from 'crypto';
import _ from 'lodash';
import Sequelize from 'sequelize';

export default class Allpay {
  constructor ({allpayModel ,merchantID, hashKey, hashIV, prod = false, debug = true, ReturnURL, ClientBackURL, PaymentInfoURL}) {
    this.merchantID = merchantID;
    this.hashKey = hashKey;
    this.hashIV = hashIV;
    this.debug = debug;
    this.prod = prod;
    this.AioCheckOut = debug ? 'https://payment-stage.allpay.com.tw/Cashier/AioCheckOut' :
    'https://payment.allpay.com.tw/Cashier/AioCheckOut'
    this.ReturnURL = ReturnURL;
    this.ClientBackURL = ClientBackURL;
    this.PaymentInfoURL = PaymentInfoURL;
    this.Allpay = allpayModel;
  }

  genCheckMacValue(data) {
    // 若有 CheckMacValue 則先移除
    if (data.hasOwnProperty('CheckMacValue')) {
      delete data.CheckMacValue;
    }

    // 使用物件 key 排序資料
    let keys = Object.keys(data);
    let sortedKeys = _.sortBy(keys, function(key) {
      return key;
    });

    let uri = _.map(sortedKeys, function(key) {
      return key + '=' + data[key];
    }).join('&');

    uri = util.format('HashKey=%s&%s&HashIV=%s', this.hashKey, uri, this.hashIV);
		uri = encodeURIComponent(uri);
		let regex;
		let find = ["%2d", "%5f", "%2e", "%21", "%2a", "%28", "%29", "%20"];
		let replace = ["-", "_", ".", "!", "*", "(", ")", "+"];
		for (let i = 0; i < find.length; i++) {
		  regex = new RegExp(find[i], "g");
		  uri = uri.replace(regex, replace[i]);
		}
    uri = uri.toLowerCase();
    let checksum = crypto.createHash('md5').update(uri).digest('hex').toUpperCase();
    data.CheckMacValue = checksum
    return data;
  };

  async getAllpayConfig({orderId, MerchantTradeNo, tradeDesc, totalAmount, paymentMethod, itemArray, domain}){
    let data = {
  		MerchantID: this.merchantID,
  		MerchantTradeNo: MerchantTradeNo,
  		MerchantTradeDate: sails.moment().format('YYYY/MM/DD HH:mm:ss'),
  		PaymentType: 'aio',
  		TotalAmount: totalAmount,
  		TradeDesc: tradeDesc || 'none.',
  		ItemName: itemArray ? itemArray.join('#') : '',
  		ReturnURL: this.resolve(domain, this.ReturnURL, true),
  		ChoosePayment: paymentMethod || 'ALL',
  		ClientBackURL: this.resolve(domain, this.ClientBackURL, true) + '?t=' + MerchantTradeNo,
  		PaymentInfoURL: this.resolve(domain, this.PaymentInfoURL, true)
  	};
    let allpay = await this.Allpay.create({
      OrderId: orderId,
      MerchantTradeNo: data.MerchantTradeNo,
      PaymentType: data.PaymentType
    });
  	return this.genCheckMacValue(data);
  };

  async paymentinfo(callBackData){
    try {
      let allPayInfo = await this.check(callBackData);
      allPayInfo.TradeNo = callBackData.TradeNo
      allPayInfo.RtnCode = callBackData.RtnCode;
      allPayInfo.RtnMsg = callBackData.RtnMsg;
      allPayInfo.PaymentType = callBackData.PaymentType;
      allPayInfo.TradeDate = callBackData.TradeDate;
      allPayInfo.shouldTradeAmt = callBackData.TradeAmt;
      allPayInfo.ExpireDate = callBackData.ExpireDate;

      if(callBackData.BankCode){
        allPayInfo.BankCode = callBackData.BankCode;
        allPayInfo.vAccount = callBackData.vAccount;
      }

      if(callBackData.PaymentNo){
        allPayInfo.PaymentNo = callBackData.PaymentNo;
        allPayInfo.Barcode1 = callBackData.Barcode1;
        allPayInfo.Barcode2 = callBackData.Barcode2;
        allPayInfo.Barcode3 = callBackData.Barcode3;
      }
      allPayInfo = await allPayInfo.save();
      return allPayInfo;
    } catch (e) {
      throw e;
    }
  }

  async paid(callBackData){
    try {
      let allPayInfo = await this.check(callBackData)
      allPayInfo.TradeNo = callBackData.TradeNo;
      allPayInfo.TradeAmt = callBackData.TradeAmt;
      allPayInfo.RtnCode = callBackData.RtnCode;
      allPayInfo.RtnMsg = callBackData.RtnMsg;
      allPayInfo.PaymentType = callBackData.PaymentType;
      allPayInfo.PaymentDate = callBackData.PaymentDate;
      allPayInfo = await allPayInfo.save();
      return allPayInfo;
    } catch (e) {
      throw e;
    }
  }

  async check(callBackData){
    try {
      let callBackCheckMacValue = callBackData.CheckMacValue
      let data = this.genCheckMacValue(callBackData);
      if(this.prod){
        if(data.CheckMacValue !== callBackCheckMacValue){
          throw new Error(`CheckMacError!!`);
        }
      }
      let findAllpayInfo = await this.Allpay.findOne({
        where:{
          MerchantTradeNo: callBackData.MerchantTradeNo
        }
      });
      if( ! findAllpayInfo)
        throw new Error(`${callBackData.MerchantTradeNo} 嚴重錯誤!!付款後找不到訂單!!`);
      return findAllpayInfo;
    } catch (e) {
      throw e;
    }
  }

  getPostUrl(){
    return this.AioCheckOut;
  };

  resolve(domain, path, absolute = false){
    let result =
      absolute ?
        domain || process.env.domain || 'http://localhost:1337' :
        '';

    if (result.slice(1) != '/' && path.indexOf('/') !== 0) {
      result += '/';
    }

    result += path;
    return result;
  };
}
