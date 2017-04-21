module.exports = function(RED) {
  function hs100ActionOff(config) {
    RED.nodes.createNode(this, config);

    const node = this;
    const configNode = RED.nodes.getNode(config.plug);
    node.deviceId = configNode.deviceId;
    const hs100Client = configNode.hs100Client;

    node.on('input', (msg) => {
      if(!hs100Client.devices.has(node.deviceId)) {
        return;
      }

      const cooloffDelay = parseInt(config.cooldownDelay, 10) * 1000;
      setTimeout(() => {
        const plug = hs100Client.devices.get(node.deviceId);
        plug.setPowerState(true).then(() => {
          node.send(msg);
        }).catch((err) => {
          node.error(err);
          node.status({fill: 'red', shape: 'dot', text: err.message});
        });
      }, cooloffDelay);
    });
  }
  RED.nodes.registerType('hs100-action-off', hs100ActionOff);
};
