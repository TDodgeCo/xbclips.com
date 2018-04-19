'use strict'
const axios = use('axios')
const Env = use('Env')

class GamertagController {
  async index({
    params, view
  }) {
    let gamertag = params.gtag

    var xuid = await axios({
      method: 'get',
      url: 'https://xboxapi.com/v2/xuid/' + gamertag,
      headers: {
        'X-AUTH': Env.get('X-AUTH')
      }
    })
    xuid = xuid.data.xuid
    console.log(xuid)

    var gTag = await axios({
      method: 'get',
      url: 'https://xboxapi.com/v2/gamertag/' + xuid,
      headers: {
        'X-AUTH': Env.get('X-AUTH')
      }
    })
    gTag = gTag.data.gamertag
    console.log(gTag)

    var res = await axios({
      method: 'get',
      url: 'https://xboxapi.com/v2/' + xuid + '/game-clips',
      headers: {
        'X-AUTH': Env.get('X-AUTH')
      }
    })

    var clips = res.data

    return view.render('videos', {
      clips: clips,
      gTag: gTag
    })
  }
}


module.exports = GamertagController
