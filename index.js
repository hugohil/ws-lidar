const args = require('minimist')(process.argv.slice(2))

const RPLidar = require('node-rplidar')
const WebSocket = require('ws')

let ID = 0

const serial = args.serial || '/dev/ttyUSB0'
const lidar = RPLidar(serial)


const host = args.host || '127.0.0.1'
const port = args.port || 8080

function setupWS () {
  const ws = new WebSocket(`ws://${host}:${port}`,  {
    perMessageDeflate: false,
  })
  
  ws.on('open', () => {
    ws.send(`lidar-register/${ID}`)

    lidar.on('data', data => {
      data.serial = ID
      ws.send(JSON.stringify(data))
    })
  })
  
  ws.on('message', (data) => {
    // console.log(data)
    if (data.indexOf('needs-lidar-registration') > -1) {
      ws.send(`lidar-register/${ID}`)
    }
  })
  
  ws.on('error', console.warn)
  ws.on('close', (code) => {
    console.log('closed with code', code)
    setTimeout(() => {
      setupWS()
    }, 1500)
  })
}


lidar
  .init()
  .then(lidar.info)
  .then(info => {
    ID = args.name || info.serialnumber
    setupWS()
    return lidar.health()
  })
  .then(health => {
    console.log('health', health) // 0 = good, 1 = warning, 2 = error
    if (health.status === 0) {
      lidar.scan()
    }
  })
