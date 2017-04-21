module.exports = function(RED) {
  function hs100ActionOn(config) {
    RED.nodes.createNode(this, config);

    const node = this;
    const configNode = RED.nodes.getNode(config.plug);
    node.deviceId = configNode.deviceId;
    const hs100Client = configNode.hs100Client;

    node.on('input', (msg) => {
      if(!hs100Client.devices.has(node.deviceId)) {
        return;
      }

      const plug = hs100Client.devices.get(node.deviceId);
      plug.setPowerState(true).then(() => {
        const warmupDelay = parseInt(config.warmupDelay, 10) * 1000;
        setTimeout(() => {
          node.send(msg);
        }, warmupDelay);
      }).catch((err) => {
        node.error(err);
        node.status({fill: 'red', shape: 'dot', text: err.message});
      });
    });
  }
  RED.nodes.registerType('hs100-action-on', hs100ActionOn);
};
