/**
 * PaymentController
 *
 * @description :: Server-side logic for managing Payments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

let PaymentController = {

  paid: async(req, res) => {
    try {
      console.log('req',req.body);
      let data = req.body;
      let paid = await allpay.paid(data);
      let order = await db.Order.findById(paid.OrderId);
      if(!order)
        throw new Error(`${paid} 嚴重錯誤!!付款後找不到訂單!!`);

      //  order 資料
      order.paymentIsConfirmed = true
      order.paymentConfirmDate = data.PaymentDate;
      order.paymentConfirmAmount = data.TradeAmt;
      order.status = 'paymentConfirm';
      await order.save();

      let messageConfig = await CustomMailerService.paymentConfirm(order);
      let message = await db.Message.create(messageConfig);
      await CustomMailerService.sendMail(message);

      return res.ok('1|OK');
    } catch (e) {
      console.error(e.stack);
      let {message} = e;
      res.serverError(message);
    }
  },

  paymentinfo: async(req, res) => {
    try {
      let data = req.body;
      console.log("req",req.body);
      let paymentinfo = await allpay.paymentinfo(data);
      let order = await db.Order.findById(paymentinfo.OrderId);

      if(!order)
        throw new Error(`${find} 找不到訂單!!`);


      order.allPayRtnCode = data.RtnCode;
      order.allPayRtnMsg = data.RtnMsg;
      order.allPayPaymentType = data.PaymentType;
      order.allPayTradeDate = data.TradeDate;
      order.paymentCreateConfirmAmount = data.TradeAmt;
      order.ExpireDate = data.ExpireDate;

      if(data.BankCode){
        order.BankCode = data.BankCode;
        order.vAccount = data.vAccount;
      }

      if(data.PaymentNo){
        order.PaymentNo = data.PaymentNo;
        order.Barcode1 = data.Barcode1;
        order.Barcode2 = data.Barcode2;
        order.Barcode3 = data.Barcode3;
      }

      let result = await order.save();

      result.bankId = data.BankCode;
      result.bankAccountId = data.vAccount;
      result.order = order;

      if (result.allPayPaymentType.toLowerCase().indexOf("credit") > -1) {
        result.paymentMethod = "信用卡 / 付款狀態：已完成付款";
      } else {
        result.paymentMethod = "ATM繳款/ " + result.bankId + " 帳號 " + result.bankAccountId;
      }


      let messageConfig = await CustomMailerService.orderConfirm(result);
      let message = await db.Message.create(messageConfig);
      await CustomMailerService.sendMail(message);

      return res.ok('1|OK');
    } catch (e) {
      console.error(e.stack);
      let {message} = e;
      res.serverError(message);
    }
  }
};

module.exports = PaymentController;
