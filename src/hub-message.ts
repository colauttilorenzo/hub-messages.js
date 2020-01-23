/*
    +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    DOC HubMessageJS
    -------------------
    Author              Colautti Lorenzo
    Last Update         15/01/2020
    Dependencies        nodejs, npm, typescript
    Git                 https://github.com/colauttilorenzo/hub-messages.js/
    Version             1.0.0
    Licence             MIT Licence
    +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    
    -- chanels creation
    HubMessage.channels.create('test');             // crea il canale 'test'
    HubMessage.channels.create('test02');           // crea il canale 'test02'
    HubMessage.channels.create('test03');           // crea il canale 'test03'

    -- obtaining all registered chanels
    HubMessage.channels.get();

    -- using default chanel
    HubMessage.subscribe('message01', function (param) { });
    HubMessage.publish('message01');
    HubMessage.unsubscribe('message01');

    -- broadcast on every registered chanel (also default chanel)
    HubMessage.broadcast('message01');

    -- using a specific registered chanel
    HubMessage.use('test').subscribe('message-test', function (param) { });
    HubMessage.use('test').publish('message-test');
    HubMessage.use('test').unsubscribe('message-test');

    -- removing chanel named: 'test03'
    HubMessage.use('test03').dispose();

    -- cloning the chanel named 'test02' in a new chanel named 'test03'
    HubMessage.use('test').clone('test03');

*/


export class HubMessage {

}

declare const window: any;
window.HubMessage = HubMessage;

















(function () {

    window.message = new function () {

        var _DEFAULT_KEY = '_';
        var _hub = {};

        _hub[_DEFAULT_KEY] = {};

        var _message = function (channel) {

            if (channel == undefined || (channel != undefined && channel.replace(/ /gm) == '')) {
                channel = _DEFAULT_KEY;
            }

            this.instance = function (channel) {

                var channel = channel;
                var createParameter = function (channel, message, data) {
                    return {
                        event: { channel: channel, message: message },
                        data: data
                    };
                };

                this.publish = function (message, data) {
                    //TODO: check if _hub[channel] exists
                    //TODO: check if _hub[channel][message] exists
                    var param = createParameter(channel, message, data);
                    for (var i = 0; i < _hub[channel][message].length; i++) {
                        _hub[channel][message][i](param);
                    }

                    delete param;
                };

                if (channel == _DEFAULT_KEY) {
                    this.broadcast = function (message, data) {
                        //TODO: check if _hub[channel] exists
                        //TODO: check if _hub[channel][message] exists
                        for (var __key in _hub) {
                            if (_hub[__key][message] != undefined) {
                                var param = createParameter(__key, message, data);
                                for (var i = 0; i < _hub[__key][message].length; i++) {
                                    _hub[__key][message][i](param);
                                }
                            }
                        }

                        delete param;
                    };
                }

                this.subscribe = function (message, handler) {
                    //TODO: check if _hub[channel] exists
                    //TODO: check if _hub[channel][message] exists
                    if (_hub[channel][message] == undefined) {
                        _hub[channel][message] = [];
                    }

                    _hub[channel][message].push(handler);
                };

                this.unsubscribe = function (message) {
                    //TODO: check if _hub[channel] exists
                    //TODO: check if _hub[channel][message] exists
                    delete _hub[channel][message];
                };

                this.clone = function (newName) {
                    //TODO: check if _hub[channel] exists
                    if (_hub[newName] == undefined) {
                        _hub[newName] = Object.assign({}, _hub[channel]);
                    }
                    else {
                        //TODO: warning ...key already exists
                    }
                };

                this.dispose = function () {
                    if (channel == undefined || (channel != undefined && channel.replace(/ /gm) == '')) {
                        //TODO: warning ...channel not defined or empty
                        return;
                    }

                    if (channel == _DEFAULT_KEY) {
                        //TODO: warning ...channel could not be default
                        return;
                    }

                    if (_hub[channel] != undefined) {
                        _hub[channel] = undefined;
                        delete _hub[channel];
                    }
                    else {
                        //TODO: warning ...key not found
                    }
                };

            };

            return new instance(channel);

        };

        var me = this;

        me.channels = {

            create: function (name) {
                if (_hub[name] == undefined) {
                    _hub[name] = Object.assign({}, _hub[_DEFAULT_KEY]);
                }
                else {
                    //TODO: warning ...key already exists
                }
            },

            get: function () {
                return Object.keys(_hub);
            }

        };

        me.message = _message(_DEFAULT_KEY);

        me.useChanel = function (name) {
            return _message(name);
        };

        return {
            channels: me.channels,
            use: me.useChanel,
            subscribe: me.message.subscribe,
            unsubscribe: me.message.unsubscribe,
            publish: me.message.publish,
            broadcast: me.message.broadcast
        };

    };

})();