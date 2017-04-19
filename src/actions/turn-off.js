module.exports = function(RED) {
    RED.nodes.registerType('hs100-action-off', function(config) {
        RED.nodes.createNode(this, config);

        const hs100Server = RED.nodes.getNode(config.plug);
        if(!hs100Server) {
            errorHandler(new Error('No Plug selected'));
            return;
        }

        const node = this;
        node.plug = hs100Server.plug;

        node.on('input', function(msg) {
            const cooloffDelay = parseInt(config.cooldownDelay, 10) * 1000;
            setTimeout(function() {
                node.plug.setPowerState(false).then(function() {
                    node.send({payload: msg});
                }).catch(errorHandler);
            }, cooloffDelay);
        });

        function errorHandler(err) {
            node.error(err);
            node.status({fill: 'red', shape: 'dot', text: err.message});
        }
    });
};
