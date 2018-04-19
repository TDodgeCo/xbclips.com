'use strict'
const Env = use('Env')
const axios = use('axios')
const Database = use('Database')

class ClipController {


  // Basic form request from homepage
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

  // store creates a route that dynamically pulls the gameClipUri based off the gameClipId
  async store ({ request, view }) {
      const url = request.url().split('/')
      var index = url.length
      var gTag = url[index - 2]
      var clipId = url[index - 1]

      var xuid = await axios({
        method: 'get',
        url: 'https://xboxapi.com/v2/xuid/' + gTag,
        headers: {
          'X-AUTH': Env.get('X-AUTH')
        }
      })
      xuid = xuid.data.xuid

      var gamertag = await axios({
        method: 'get',
        url: 'https://xboxapi.com/v2/gamertag/' + xuid,
        headers: {
          'X-AUTH': Env.get('X-AUTH')
        }
      })
      gamertag = gamertag.data.gamertag

      var res = await axios({
        method: 'get',
        url: 'https://xboxapi.com/v2/' + xuid + '/game-clips',
        headers: {
          'X-AUTH': Env.get('X-AUTH')
        }
      })
      var clips = res.data

      // helper function for determining the array index of the object that has the same gameClipId
      var findClip = function (arr) {
        return arr.gameClipId == clipId
      }
      var clipIndex = clips.findIndex(findClip)

      var clipObj = clips[clipIndex]

      return view.render('video', {
        clip: clipObj,
        gTag: gamertag
      })

      console.log(xuid + ' ' + res)
      console.log(clipIndex)
  }

}

module.exports = ClipController
