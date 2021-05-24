const RPLidar = require('node-rplidar')
const lidar = RPLidar('/dev/tty.SLAB_USBtoUART')
const WebSocket = require('ws')

let ID = 0

function setupWS () {
  const ws = new WebSocket('ws://127.0.0.1:8080',  {
    perMessageDeflate: false,
  
  })
  
  ws.on('open', () => {
    ws.send(`lidar-register/${ID}`)
  })
  
  ws.on('message', (data) => {
    console.log(data)
    if (data.indexOf('needs-lidar-registration') > -1) {
      ws.send(`lidar-register/${ID}`)
    }
  })
  
  lidar.on('data', data => {
    data.serial = ID
    ws.send(JSON.stringify(data))
  })
}


lidar
  .init()
  .then(lidar.info)
  .then(info => {
    ID = info.serialnumber
    setupWS()
    return lidar.health()
  })
  .then(health => {
    console.log('health', health) // 0 = good, 1 = warning, 2 = error
    if (health.status === 0) {
      lidar.scan()
    }
  })
