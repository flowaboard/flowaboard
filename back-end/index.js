const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, '/../front-end')))
  .use(express.static(path.join(__dirname, '/../node_modules')))
  .use(express.static(path.join(__dirname, '/../')))
  .get('/', (req, res)=>{
    res.sendFile(path.join(__dirname + '../front-end/index.html'));
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))