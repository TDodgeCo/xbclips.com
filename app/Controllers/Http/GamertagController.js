'use strict'
const axios = use('axios')
const Env = use('Env')

class GamertagController {
  async index({
    params, request, view
  }) {

    let gamertag;

    if (params.gtag) {
      gamertag = params.gtag
    } else {
      var req = request.only(['gamertag'])
      gamertag = req.gamertag.replace(' ', '%20')
    }

    var xuid = await axios({
      method: 'get',
      url: 'https://xboxapi.com/v2/xuid/' + gamertag,
      headers: {
        'X-AUTH': Env.get('X-AUTH')
      }
    }).catch( error => {
      console.log(error)
    })
    xuid = xuid.data.xuid
    console.log(xuid)

    var gTag = await axios({
      method: 'get',
      url: 'https://xboxapi.com/v2/gamertag/' + xuid,
      headers: {
        'X-AUTH': Env.get('X-AUTH')
      }
    }).catch( error => {
      console.log(error)
    })
    gTag = gTag.data.gamertag
    console.log(gTag)

    var res = await axios({
      method: 'get',
      url: 'https://xboxapi.com/v2/' + xuid + '/game-clips',
      headers: {
        'X-AUTH': Env.get('X-AUTH')
      }
    }).catch( error => {
      console.log(error)
    })

    var clips = res.data

    return view.render('videos', {
      clips: clips,
      gTag: gTag
    })
  }
}


module.exports = GamertagController
