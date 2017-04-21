const Hs100Api = require('fx-hs100-api');
const hs100Client = new Hs100Api.Client();

module.exports = function(RED) {
  hs100Client.startDiscovery();

  function Hs100ServerNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.deviceId = config.deviceId;
    node.hs100Client = hs100Client;
  }
  RED.nodes.registerType('hs100-server', Hs100ServerNode);

  RED.httpAdmin.get('/hs100/server', function(req, res) {
    const plugs = [];
    hs100Client.devices.forEach(function(plug) {
      plugs.push({
        name: plug.name,
        deviceId: plug.deviceId
      });
    });
    res.end(JSON.stringify(plugs));
  });
};
