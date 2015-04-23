'use strict';

var os = require('os');
var ifaces = os.networkInterfaces();

var publicAddress = "";

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // Skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses.
      return;
    }

    publicAddress = iface.address;
  });
});

module.exports = publicAddress;
