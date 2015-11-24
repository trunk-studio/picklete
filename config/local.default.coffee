module.exports = {
  createInitData: true
  useAllPay: true
  environment: ''
  initData: ''
  domain: 'http://localhost:1337'
  cookieVersion:'0.1'
  shipment: 'agricloud'
  freeShippingInformation:'*購買兩件以上享有免運費優惠！'
  mailRemarks:'麻煩請於出貨前三天前匯款，未在時間匯款，出貨時間將移至下週出貨(每筆訂單有7天匯款時間，逾時系統會取消訂單)，造成不便請多見諒。'
  deliveryTime:[
    "",
    "2015-11-18",
    "2015-11-25",
    "2015-12-02",
    "2015-12-09",
    "2015-12-16",
    "2015-12-23",
    "2015-12-30"
  ]
  deliveryTimeShow:[
    "",
    "2015-11-16 ~ 2015-11-18",
    "2015-11-23 ~ 2015-11-25",
    "2015-11-30 ~ 2015-12-02",
    "2015-12-07 ~ 2015-12-09",
    "2015-12-14 ~ 2015-12-16",
    "2015-12-21 ~ 2015-12-23",
    "2015-12-28 ~ 2015-12-30"
  ]
  # mail: {
  #   type: 'ses'
  #   active: false
  #   config: {
  #     from: '',
  #     transporter: {
  #       accessKeyId: '',
  #       secretAccessKey: '',
  #     }
  #   }
  # }
  mail: {
    type: 'smtp'
    active: true
    config:{
      from: 'GMAIL_USER@gmail.com',
      transporter: {
          port: 465,
          host: 'smtp.gmail.com',
          domains: [
            "gmail.com",
            "googlemail.com"
          ],
          secure: true,
          auth: {
            user: 'GMAIL_USER_ACCOUNT',
            pass: 'GMAIL_USER_PASSWORD',
            # xoauth2: ''
          },
          # ignoreTLS: false,
          # name: '',
          # localAddress: '',
          # connectionTimeout: 2000,
          # greetingTimeout: 2000,
          # socketTimeout: 2000,
          debug: true,
          authMethod: 'PLAIN',
          # tls: {}
      }
    }
  }
  db: {
    'username': process.env.MYSQL_USER || "root"
    'password': process.env.MYSQL_PASSWORD || "root"
    'host': process.env.MYSQL_1_PORT_3306_TCP_ADDR || "127.0.0.1"
    'port': process.env.MYSQL_1_PORT_3306_TCP_PORT || 3306
    'database': 'picklete',
    'dialect': 'mysql',
    'force': true
  }
  allpay: {
    merchantID: '2000132',
    hashKey: '5294y06JbISpM5x9',
    hashIV: 'v77hoKGq4kWxNNIS',
    debug: true,
    ReturnURL:'/allpay/paid',
    ClientBackURL:'/shop/done',
    PaymentInfoURL:'/allpay/paymentinfo',
    paymentMethod:[
      {
        code: 'ATM',
        name: 'ATM'
      },{
        code: 'Credit',
        name: '信用卡'
      }
    ]
  }
  i18n: {
    localesDirectory: '/config/locales'
  }
  store:{
    name:'i+DEAL創而有意',
    name2:'i+DEAL',
    name3:'創而有意',
    serviceMail:'service@wevo.com.tw'
  }
  googleAnalytics: {
    trackingID: ''
  }
  passport:{
    local: strategy: require('passport-local').Strategy
    facebook:{
      name: 'Facebook'
      protocol: 'oauth2'
      strategy: require('passport-facebook').Strategy
      options:{
        clientID: '1598226980388780'
        clientSecret: '71ae89eba342ce5a48a30a870d6bd473'
        profileFields: [ 'id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName' ]
        callbackURL: "http://localhost:1337/auth/facebook/callback"
      }
    }
  }
}
