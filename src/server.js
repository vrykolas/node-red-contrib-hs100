const Hs100Api = require('fx-hs100-api');
const hs100Client = new Hs100Api.Client();

module.exports = function(RED) {
    hs100Client.startDiscovery();

    function Hs100ServerNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.plugName = config.plugName;
        node.host = config.host;
        node.port = config.port;
        createClient(node);
    }
    RED.nodes.registerType('hs100-server', Hs100ServerNode);

    function createClient (node) {
        node.plug = hs100Client.getPlug({
            host: node.host,
            port: node.port
        });
    }

    RED.httpAdmin.get('/hs100/server', function(req, res) {
        const plugs = [];
        hs100Client.devices.forEach(function(plug) {
            if(plug.status === 'online') {
                plugs.push({
                    name: plug.name,
                    host: plug.host,
                    port: plug.port,
                    timeout: plug.timeout
                });
            }
        });
        res.end(JSON.stringify(plugs));
    });
};
