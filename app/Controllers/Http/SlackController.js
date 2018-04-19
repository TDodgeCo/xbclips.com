'use strict'
const Env = use('Env')
const axios = use('axios')

class SlackController {
  async index ({ request, response }) {
    // get the necessary responses from slack

    var dirtyText = request.only(['text'])
    var response_url = request.only(['response_url'])
    var token = request.only(['token'])

    dirtyText = dirtyText.text
    response_url = response_url.response_url
    token = token.token

    if (token !== Env.get('SLACK-TOKEN')) {
      response.forbidden('Tokens do not match. Cannot process your request.')
    }
    var textArr = dirtyText.split('')
var len = textArr.length
var vidIndex,
    gTag,
    responseMessage,
    gif

// find out if there was a gif flag
if (textArr[0] + textArr[1] === '-g') {
  gif = true
}
else gif = false

// find out if there was a number flag on the request
if (textArr[len -2] === '-') {
  vidIndex = textArr[len - 1] - 1
  for (let i = 3; i > 0; i--) {
    textArr.pop()
  }
  gTag = textArr.join('').replace(' ', '%20')
  responseMessage = ' Clip #' + (vidIndex + 1) + ' from your collection is coming up.'
  + '\n To get a list of your available clips and their index, navigate to https://xbclips/' + dirtyText;
}
else {
  gTag = dirtyText.replace(' ', '%20')
  vidIndex = 0
  responseMessage = ' Your latest clip is coming up.'
}
var gamertag = gTag.replace('%20', ' ')

// tell slack that we've received the response, allowing us to send delayed responses
  var responseObj = {
    'response_type': 'in_channel',
    'text': 'On it, ' +  gamertag + '.' + responseMessage
  }
response.json(responseObj)

// get the gamertag's xuid from xboxapi
axios({
  method: 'get',
  url: 'https://xboxapi.com/v2/xuid/' + gTag,
  headers: {
    'X-AUTH': Env.get('X-AUTH')
  }
}).then( response =>  {
  var xuid = response.data.xuid
  // use the xuid to find the latest clip for that xuid
  axios({
    method: 'get',
    url: 'https://xboxapi.com/v2/' + xuid + '/game-clips',
    headers: {
      'X-AUTH': Env.get('X-AUTH')
    }
  }).then( response =>  {
    var clip = response.data[vidIndex].gameClipId

    // TODO need to remove the -g flag from the array for this to work

    // if (gif) {
    //   axios({
    //     method: 'post',
    //     url: 'https://api.gifs.com/media/import',
    //     data: {
    //       source: 'https://gameclipscontent-d2013.xboxlive.com/xuid-2535462000518699-private/ffea9691-3979-43fb-92fc-0fa436e609f5.MP4?sv=2015-12-11&sr=b&si=DefaultAccess&sig=P%2BHIUDQRJaL9Lq9zXxunELY9Aj%2FiJtjBmvkAJFeQzQY%3D&__gda__=1522813177_1454885f83dffe0b7b10756707332897'
    //     }
    //   }).then( response => {
    //     let gifPage = response.data.success.page
    //     let gifDirect = response.data.success.files.gif
    //     axios.post(response_url, {
    //       response_type: 'in_channel',
    //       text: gifDirect
    //     }).then(function(response) {
    //       console.log('gif successfully sent')
    //     })
    //   })
    // }

    axios({
      method: 'post',
      url: 'https://www.googleapis.com/urlshortener/v1/url?key=' + Env.get('GOOG_API'),
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        'longUrl': 'https://xbclips.com/clips/' + gTag + '/' + clip
      }
    }).then( response =>  {
      var shortUrl = response.data.id

      // shorten URL and post that video clip to slack
      axios.post(response_url, {
        response_type: 'in_channel',
        text: shortUrl + '\n This video will expire in 60 minutes.'
      }).then(function(response) {
        console.log('clip successfully sent')
      })
    })
  })
})
console.log('Slash Command Text: ' + gamertag + '\n' + 'Response URL: ' + response_url)
  }
}

module.exports = SlackController
