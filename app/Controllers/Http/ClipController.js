'use strict'
const Env = use('Env')
const axios = use('axios')
const Database = use('Database')

class ClipController {

  async index({ request, view }) {
    var req = request.only(['gamertag'])
    var gamertag = req.gamertag.replace(' ', '%20')

    var xuid = await axios({
      method: 'get',
      url: 'https://xboxapi.com/v2/xuid/' + gamertag,
      headers: {
        'X-AUTH': Env.get('X-AUTH')
      }
    })
    xuid = xuid.data.xuid
    console.log(xuid)

    var res = await axios({
      method: 'get',
      url: 'https://xboxapi.com/v2/' + xuid + '/game-clips',
      headers: {
        'X-AUTH': Env.get('X-AUTH')
      }
    })

    var clips = res.data

    return view.render('video', {
      clips: clips
    })
  }

}

module.exports = ClipController
