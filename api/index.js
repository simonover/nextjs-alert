import express from 'express'
import * as ReactDOMServer from 'react-dom/server'
import cors from 'cors'
import bodyParser from 'body-parser'
import prerenderNode from 'prerender-node'

import deadPeople from './src/routes/deadPeople.js'
import admin from './src/routes/admin.js'
import articles from './src/routes/articles.js'
import comments from './src/routes/comment.js'
import candles from './src/routes/candles.js'

ReactDOMServer.renderToString()
const app = express()
const port = process.env.PORT || 4000

app.set('port', port)
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'https://alert.rip')
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization'
  )
  next()
})

app.use(cors())
app.use(express.static('public'))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(prerenderNode).set('prerenderToken', 'kweAPszwwQiFJKwXBhH5')

app.use('/api/admin', admin)
app.use('/api/deadpeople', deadPeople)
app.use('/api/news', articles)
app.use('/api/comments', comments)
app.use('/api/candles', candles)

app.use(express.static('../build'))

app.listen(port, '0.0.0.0', () =>
  console.log(`REST API server ready at: http://localhost:${port}`)
)
