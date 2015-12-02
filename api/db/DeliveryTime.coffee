
module.exports = (sequelize, DataTypes) ->
  DeliveryTime = sequelize.define('DeliveryTime', {

    deliveryTime: DataTypes.DATEONLY
    deliveryTimeShow: DataTypes.STRING

  }, classMethods: associate: (models) ->
    return
  )
  return DeliveryTime
