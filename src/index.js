'use strict'
import express from 'express'
import bodyParser from 'body-parser'
import slackApiFactory from './slackApi'
import storeFactory from './store'
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(
    'Express server   listening on port %d in %s mode',
    server.address().port,
    app.settings.env
  )
})



const store = storeFactory()
const slackApi = slackApiFactory(store, {
  appId: process.env.SLACK_APP_ID,
  appSecret: process.env.SLACK_APP_SECRET
})

app.post('/exampleCommand', (req, res) => {
  const text = req.body.text
  const params = text.split(' ').filter(p => p !== '')
  const data = {
    text: `You've sent exampleCommand with ${params.length ? '' : 'no'} params`,
    attachments: params.map(p => ({ text: p }))
  }
  res.json(data)
})

app.post('/event', (req, res) => {
  const body = req.body
  switch (body.type) {
    case 'url_verification':
      res.send(body.challenge)
      return
    case 'event_callback':
      if (body.event.type === 'message' && body.event.user) {
        slackApi.postMessage(body.team_id, body.event.channel, 'test message')
        res.status(200).end()
      }
      return
    default:
      break
  }

  res.status(400).end()
})

app.get('/install', (req, res) => {
  console.log('install')
  slackApi.install(req.query.code).then(team => {
    console.log('installed team:', team)
    res.redirect(`http://${team}.slack.com`)
  }).catch(err => {
    console.error(err)
    res.status(500).end()
  })
})

