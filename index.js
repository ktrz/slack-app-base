'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const server = app.listen(process.env.PORT || 3000, () => {
  console.log('Express server   listening on port %d in %s mode', server.address().port, app.settings.env);
});

const store = require('./store')()
const slackApi = require('./slackApi')(store, {
  appId: process.env.SLACK_APP_ID,
  appSecret: process.env.SLACK_APP_SECRET
})

app.post('/exampleCommand', (req, res) => {
  const text = req.body.text;
  const params = text.split(' ')

  let data = {
    text: `You've sent exampleCommand with params`,
    attachments: params.map(p => ({ text: p }))
  };
  res.json(data);
});

app.post('/event', (req, res) => {
  const body = req.body
  console.log(body, typeof body)
  switch (body.type) {
    case 'url_verification':
      res.send(body.challenge)
      return
    case 'event_callback':
      if (body.event.type === 'message' && body.event.user) {
        const data = {
          attachments: [{
            image_url: 'https://http.cat/302.jpg',
            text: '302: Found',
          }]
        };
        slackApi.postMessage(body.team_id, body.event.channel, 'test message')
        res.json(data)
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

