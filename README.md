# ws-lidar

Simple WebScokets forward tool for RPLidar.

## Installation

```sh
npm i
```

## Usage

```sh
# these are the default values
node index.js --serial /dev/ttyUSB0 --host 127.0.0.1 --port 8080
```

* For Linux users, serial port is probably `/dev/ttyUSB0`.
* For macOS users, serial port is probably `/dev/tty.SLAB_USBtoUART`.
* For Windows users, serial port is one of your `COM` ports (see your "Device Manager").

Default will send the device serial number as `ID`, but you can also provide a `--name` argument.
