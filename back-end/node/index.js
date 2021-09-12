const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const frontEndPath=path.join(__dirname, '/../../front-end')
express()
  .use(express.static(frontEndPath))
  .get('/login', (req, res)=>{
    res.sendFile(frontEndPath+'/login.html');
  })
  .get('/mathematics/*', (req, res)=>{
    res.sendFile(frontEndPath+'/index.html');
  })
  .get('/mathematics', (req, res)=>{
    res.sendFile(frontEndPath+'/index.html');
  })
  .get('/programming/*', (req, res)=>{
    res.sendFile(frontEndPath+'/index.html');
  })
  .get('/programming', (req, res)=>{
    res.sendFile(frontEndPath+'/index.html');
  })
  .get('/ai/*', (req, res)=>{
    res.sendFile(frontEndPath+'/index.html');
  })
  .get('/ai', (req, res)=>{
    res.sendFile(frontEndPath+'/index.html');
  })
  .get('/business/*', (req, res)=>{
    res.sendFile(frontEndPath+'/index.html');
  })
  .get('/business', (req, res)=>{
    res.sendFile(frontEndPath+'/index.html');
  })
  .get('/', (req, res)=>{
    res.sendFile(frontEndPath+'/index.html');
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT } serving frontend from `+frontEndPath))