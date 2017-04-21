module.exports = function(RED) {
  function hs100Status(config) {
    RED.nodes.createNode(this, config);

    const node = this;
    const configNode = RED.nodes.getNode(config.plug);
    node.deviceId = configNode.deviceId;
    const hs100Client = configNode.hs100Client;

    node.on('input', (msg) => {
      if(!hs100Client.devices.has(node.deviceId)) {
        return node.send([null, null, msg]);
      }

      const plug = hs100Client.devices.get(node.deviceId);
      plug.getPowerState().then(function(state) {
        if(state) {
          return node.send([msg, null, null]);
        }
        node.send([null, msg, null]);
      }).catch((err) => {
        node.error(err);
        node.status({fill: 'red', shape: 'dot', text: err.message});
      });
    });
  }

  RED.nodes.registerType('hs100-status', hs100Status);
};
