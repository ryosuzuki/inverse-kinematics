const Serialport = require('serialport')
const express = require('express')
const path = require('path')
const app = express()
let data = {}
let portName = '/dev/cu.usbmodem14141'
let port = new Serialport(portName, {
  baudrate: 9600,
  parser: Serialport.parsers.readline('\n')
});

port.on('data', (data) => {
  console.log(data.toString())
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
})

app.post('/command', (req, res) => {
  let id = req.query.id
  let p = parseInt(id.split('-')[0])
  let n = parseInt(id.split('-')[1])
  data = { p: p, n: n}
  if (data.p && data.n) {
    port.write(JSON.stringify(data))
  }
  console.log(data);
  res.send('ok')
})

app.listen(3000, function() {
  console.log('listening 3000')
})