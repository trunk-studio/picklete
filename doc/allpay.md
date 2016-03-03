# Allpay串接
## 前置
1. sequelize
2. Mysql 準備一個 Allpay table [可參考](https://github.com/FuYaoDe/picklete/blob/agricloud_develop/api/db/Allpay.coffee)

```
  CREATE TABLE `Allpays` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `TradeNo` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `MerchantTradeNo` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `RtnCode` int(11) DEFAULT NULL,
  `RtnMsg` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `PaymentDate` datetime DEFAULT NULL,
  `TradeDate` datetime DEFAULT NULL,
  `PaymentType` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `shouldTradeAmt` float DEFAULT NULL,
  `TradeAmt` float DEFAULT NULL,
  `BankCode` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `vAccount` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ExpireDate` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `PaymentNo` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Barcode1` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Barcode2` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Barcode3` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `CheckMacValue` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `MerchantTradeDate` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `OrderId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `TradeNo` (`TradeNo`),
  UNIQUE KEY `MerchantTradeNo` (`MerchantTradeNo`),
  KEY `OrderId` (`OrderId`),
  CONSTRAINT `allpays_ibfk_1` FOREIGN KEY (`OrderId`) REFERENCES `Orders` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
  ) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
```
   Allpay 跟 Order 建立關聯

## 使用
```
let Allpay = require('../api/services/AllpayService');
let allpay = new Allpay({
  merchantID: 特店編號(MerchantID),
  hashKey: all in one 介接的 HashKey,
  hashIV: all in one 介接的 HashIV,
  // debug 用於 mocha test
  debug: true,
  // 需要用 allpay 測試後台要改為 true ， mocha test 改 false
  prod: process.env.NODE_ENV === 'production',
  // 付款結果通知 restful api，不需包含 domain
  ReturnURL: /allpay/paid,
  // 建立訂單後 [返回廠商]的按鈕的 redirect 網址，不需包含 domain
  ClientBackURL: /shop/done,
  // 訂單建立完成後 restful api，不需包含 domain
  PaymentInfoURL: /allpay/paymentinfo,
  // 傳入 allpay 的 sequelize model 
  allpayModel: db.Allpay
});
```

## 創建訂單
```
let allpayConfig = await allpay.getAllpayConfig({
  orderId: order.id,
  // 訂單編號，注意不可重複
  MerchantTradeNo: '123123123',
  tradeDesc: '產品描述',
  // 產品總金額
  totalAmount: order.paymentTotalAmount,
  // 交易方法，目前僅支援 Credit/ATM
  paymentMethod: paymentMethod,
  // 物品名稱陣列
  itemArray: itemArray,
  domain: 'http://localhost:1337',
});

let AioCheckOut = allpay.getPostUrl();

res.view('allPay',{
  allpayConfig,
  AioCheckOut
});

```
allPay.jade
```
block body
  div.container 交易進行中，請勿關閉視窗....
      form#form1(name='form1', method='post',action= AioCheckOut)
        input(type='hidden', name='MerchantID' value= allPayData.MerchantID)
        input(type='hidden', name='MerchantTradeNo' value= allPayData.MerchantTradeNo)
        input(type='hidden', name='MerchantTradeDate' value= allPayData.MerchantTradeDate)
        input(type='hidden', name='PaymentType' value= allPayData.PaymentType)
        input(type='hidden', name='TotalAmount' value= allPayData.TotalAmount)
        input(type='hidden', name='TradeDesc' value= allPayData.TradeDesc)
        input(type='hidden', name='ItemName' value= allPayData.ItemName)
        input(type='hidden', name='ReturnURL' value= allPayData.ReturnURL)
        input(type='hidden', name='ChoosePayment' value= allPayData.ChoosePayment)
        input(type='hidden', name='ClientBackURL' value= allPayData.ClientBackURL)
        input(type='hidden', name='CheckMacValue' value= allPayData.CheckMacValue)
        input(type='hidden', name='PaymentInfoURL' value= allPayData.PaymentInfoURL)
        //- a.btn.btn-primary(onClick='$("form[name=\'form1\']").submit()') 查詢
  block js
    script.
      $( document ).ready( $("form[name='form1']").submit() );
```

## 訂單創建成功
Allpay 會發送 post 給剛剛在 PaymentInfoURL 設定的 restful api，可以使用
```
let data = req.body;
await allpay.paymentinfo(data);
return res.ok('1|OK');
```
更新 DB 並回傳 '1|OK' 給 Allpay

## 付款成功
Allpay 會發送 post 給剛剛在 ReturnURL 設定的 restful api，可以使用
```
let data = req.body;
await allpay.paid(data);
return res.ok('1|OK');
```
更新 DB 並回傳 '1|OK' 給 Allpay


# 測試
創建好訂單，把 server 架在能對外的 IP ， port 僅能使用 80、443
[Allpay測試後台](http://vendor-stage.allpay.com.tw)
帳號：StageTest
密碼：test1234

## ATM 測試付款
1. 左方選單  一般訂單查詢 > 全方位金流訂單
2. 廠商訂單編號輸入剛剛創建訂單傳入的 MerchantTradeNo
3. 將搜尋到訂單滑到最右邊有 `模擬付款` 的選項
4. 如果付款成功會 alert `模擬付款成功！` ，失敗時會收到 alert `模擬付款訊息已送出 並未收到正確訊息"1|OK" 請檢查您的接收程式是否有誤`

## 信用卡測試付款
1. 創建訂單時選擇信用卡付款
2. 最後一步驟會要求輸入卡號，電話請輸入您的號碼，待會會收到驗證簡訊
```
信用卡測試卡號: 4311-9522-2222-2222
信用卡測試安全碼: 222
信用卡測試有效年月: 大於測試時間
```
3. 收到驗證簡訊輸入並確認，完成付款
