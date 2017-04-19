module.exports = function(RED) {
    RED.nodes.registerType('hs100-status', function(config) {
        RED.nodes.createNode(this, config);

        const hs100Server = RED.nodes.getNode(config.plug);
        if(!hs100Server) {
            errorHandler(new Error('No Plug selected'));
            return;
        }

        const node = this;
        node.plug = hs100Server.plug;

        node.on('input', function() {
            node.plug.getPowerState().then(function(state) {
                if(state) {
                    return node.send([true, false]);
                }
                node.send([false, true]);
            }).catch(errorHandler);
        });

        function errorHandler(err) {
            node.error(err);
            node.status({fill: 'red', shape: 'dot', text: err.message});
        }
    });
};
