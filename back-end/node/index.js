const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const frontEndPath=path.join(__dirname, '/../../front-end')
express()
  .use(express.static(frontEndPath))
  .get('/', (req, res)=>{
    res.sendFile(frontEndPath+'/index.html');
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT } serving frontend from `+frontEndPath))