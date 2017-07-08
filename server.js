const Serialport = require('serialport')
const express = require('express')
const path = require('path')
const app = express()
let data = {}
let portName = '/dev/cu.usbmodem1411'

let port = new Serialport(portName, {
  baudrate: 9600,
  parser: Serialport.parsers.readline('\n')
});

port.on('data', (data) => {
  console.log(data.toString())
})

app.use('/', express.static(__dirname))
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
})

app.post('/move', (req, res) => {
  let angle1 = parseInt(req.query.angle1)
  let angle2 = parseInt(req.query.angle2)
  let data = { angle1: angle1, angle2: angle2 }
  if (data.angle1 && data.angle2) {
    port.write(JSON.stringify(data))
  }
  console.log(data);
  res.send(data)
})

app.listen(8080, function() {
  console.log('listening 8080')
})