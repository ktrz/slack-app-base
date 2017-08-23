module.exports = (store, { appId, appSecret }) => {
  return {
    install,
    postMessage
  }

  function install(code) {
    return getOathAccess(code)
      .then(({ body }) => JSON.parse(body))
      .then(
        body => store.addInstallation(body)
          .then(() => getTeamInfo(body.team_id)
            .then(({ body, statusCode }) => {
              if (statusCode == 200) {
                return JSON.parse(body).team.domain;
              }
            })
          ),
        err => console.error('failed:', err)
      )
  }

  function getTeamInfo(teamId) {
    const request = require('request-promise-native');
    const data = store.read()
    const token = data[teamId][0].access_token
    return request.post(
      'https://slack.com/api/team.info',
      {
        form: { token: token },
        resolveWithFullResponse: true,
      }
    )
  }

  function getOathAccess(code) {
    const request = require('request-promise-native')
    return request.post(
      'https://slack.com/api/oauth.access',
      {
        form: {
          client_id: appId,
          client_secret: appSecret,
          code: code
        },
        resolveWithFullResponse: true,
      }
    )
  }

  function postMessage(team, channel, text) {
    const request = require('request-promise-native')
    const token = store.read()[team][0].access_token
    request.post('https://slack.com/api/chat.postMessage',
      {
        form: {
          token,
          channel,
          text,
        }
      }
    ).then(
      body => console.log('successful!  Server responded with:', typeof body, body),
      err => console.error('failed:', err)
    )
  }
}