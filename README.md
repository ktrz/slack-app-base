
# Slack base app

My attempt to create a base for a Slack application that already can be installed and can interact with many teams.

## Setup

At first you need to create an app here: https://api.slack.com/apps

Then you can setup the app

```
$ yarn install
```
or
```
$ npm install
```

For development mode you can either create `.env` file in root directory according to `.env-template`. 
I'm using https://ngrok.com/ to tunnel globally available web url to my local machine. You can install `ngrok` using the following command
```
yarn global add ngrok
```
or
```
npm add --global ngrok
```
and then create tunnel (by default port should be 3000)
```
ngrok http 3000
```
After that you can copy the URL from the console and use it in your `.env` file.


## Running

```
$ yarn start
```
or
```
$ npm start
```
