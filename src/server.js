const Hs100Api = require('fx-hs100-api');
const hs100Client = new Hs100Api.Client();

module.exports = function(RED) {
    hs100Client.startDiscovery();

    function Hs100ServerNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.deviceId = config.deviceId;
        createClient(node);
    }
    RED.nodes.registerType('hs100-server', Hs100ServerNode);

    function createClient (node) {
        if(!hs100Client.devices.has(node.deviceId)) {
            console.log('Disconnected from Harmony Hub: ' + e)
        }
        node.plug = hs100Client.devices.get(node.deviceId);
    }

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
