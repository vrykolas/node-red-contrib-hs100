module.exports = function(RED) {
    RED.nodes.registerType('hs100-action-on', function(config) {
        RED.nodes.createNode(this, config);

        const hs100Server = RED.nodes.getNode(config.plug);
        if(!hs100Server) {
            errorHandler(new Error('No Plug selected'));
            return;
        }

        const node = this;
        node.plug = hs100Server.plug;
        node.on('input', function(msg) {
            node.plug.setPowerState(true).then(function() {
                const warmupDelay = parseInt(config.warmupDelay, 10) * 1000;
                setTimeout(function() {
                    node.send({payload: msg});
                }, warmupDelay);
            }).catch(errorHandler);
        });

        function errorHandler(err) {
            node.error(err);
            node.status({fill: 'red', shape: 'dot', text: err.message});
        }
    });
};
