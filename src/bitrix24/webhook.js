import {Bitrix24} from 'b24'

class Bitrix24WebHook {
  constructor() {
    var _ = this

    _.url    = '' // HOST
    _.user   = '' // USER
    _.token  = '' // TOKEN
    _.config = {
      config: {
        mode   : 'webhook'
      , host   : _.url
      , user_id: _.user
      , code   : _.token
      }
    }
    _.bitrix24 = new Bitrix24(_.config)

    _.trigger = async (point, params = {}) => {
      try
      {
        const res = await _.bitrix24.callMethod(point, params)

        return res
      }
      catch (err)
      {
        return err.error
      }
    }
  }
}

module.exports = Bitrix24WebHook
