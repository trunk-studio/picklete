
module.exports = (sequelize, DataTypes) ->
  Allpay = sequelize.define('Allpay', {
    # 歐付寶
    # 欄位名稱統一使用歐付寶回傳資料，所以不符合其他命名規則 
    # 訂單編號，提供給 allpay 使用
    # 訂單成立後更新的編號，由 allpay 提供
    TradeNo:
      type: DataTypes.STRING
      unique: true
    MerchantTradeNo:
      type: DataTypes.STRING
      unique: true
    # allpay 回傳資訊
    RtnCode: DataTypes.INTEGER
    # allpay 回傳資訊
    RtnMsg: DataTypes.STRING
    # allpay 付款時間
    PaymentDate: DataTypes.DATE
    # allpay 交易日期
    TradeDate: DataTypes.DATE
    # allpay 採用金流方式
    PaymentType: DataTypes.STRING
    # allpay 應該要收到的付款金額
    ShouldTradeAmt: DataTypes.FLOAT
    # allpay 付款金額
    TradeAmt: DataTypes.FLOAT
    # allpay bankcode
    BankCode: DataTypes.STRING
    # 要繳費的帳號
    vAccount: DataTypes.STRING
    # 過期日期
    ExpireDate: DataTypes.STRING
    # 支付交易編號
    PaymentNo: DataTypes.STRING
    # allpay 交易，用於 ibon, barcode 付帳流程上
    Barcode1: DataTypes.STRING
    Barcode2: DataTypes.STRING
    Barcode3: DataTypes.STRING
    # allpay 金額產生使用
    CheckMacValue: DataTypes.STRING
    # 訂單產生的時候的交易時間
    MerchantTradeDate: DataTypes.DATE
  }, classMethods: associate: (models) ->
    Allpay.belongsTo models.Order
    return
  )
  return Allpay
