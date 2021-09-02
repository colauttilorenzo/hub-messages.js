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
    HubMessage.channels.create('test');:            // crea il canale 'test'
    HubMessage.channels.create('test02');           // crea il canale 'test02'
    HubMessage.channels.create('test03');           // crea il canale 'test03'

    -- obtaining all registered chanels
    HubMessage.channels.get('test02');               // estrae il canale 'test02'
    HubMessage.use('test02');

    -- using default chanel
    HubMessage.use('test02').subscribe('message01', function (param) { });
    HubMessage.use('test02').publish('message01', {});
    HubMessage.use('test02').unsubscribe('message01');

    -- broadcast on every registered chanel (also default chanel)
    HubMessage.broadcast('message01', {});

    -- using a specific registered chanel
    HubMessage.use('test').subscribe('message-test', function (param) { });
    HubMessage.use('test').publish('message-test');
    HubMessage.use('test').unsubscribe('message-test');

    -- removing chanel named: 'test03'
    HubMessage.channels.remove('test03');

    -- cloning the chanel named 'test02' in a new chanel named 'test03'
    var channel = HubMessage.use('test02');
    HubMessage.channels.clone('test03', channel);

*/

class Message {

    public readonly name: string;
    public readonly delegate: Function;

    public constructor(name: string, delegate: Function) {
        this.name = name;
        this.delegate = delegate;
    }

}

class Channel {

    public readonly isChannel: boolean = true;

    public readonly messages: Message[] = [];
    public readonly name: string;

    public readonly instance: Channel;

    public constructor(name: string) {
        this.name = name;
        this.instance = this;
    }

    private getMessagesByName(messageName: string): Array<Message> {
        if (messageName == undefined || messageName == '') {
            throw 'messageName must be valued';
        }

        const messages: Array<Message> = [];
        for (let i = 0; i < this.messages.length; i++) {
            if (this.messages[i].name == messageName) {
                messages.push(this.messages[i]);
            }
        }

        return messages;
    }

    public subscribe(messageName: string, delegate: Function): void {
        if ((typeof messageName === 'string' && messageName.trim() !== '') === false) {
            throw 'messageName must be valued';
        }

        if (typeof delegate !== 'function') {
            throw 'delegate must be type of Function';
        }

        const message: Message = new Message(messageName, delegate)
        this.messages.push(message);
    }

    public getSubscriptions(): string[] {
        const result: string[] = new Array<string>();
        this.messages.forEach(function (mex) { result.push(mex.name); });

        return result;
    }

    public unsubscribe(messageName: string): void {
        if (messageName == undefined || messageName == '') {
            throw 'messageName must be valued';
        }

        let messageIndex: number = -1;
        for (let i = 0; i < this.messages.length; i++) {
            if (this.messages[i].name == messageName) {
                messageIndex = i;
                break;
            }
        }

        if (messageIndex > -1) {
            this.messages.splice(messageIndex, 1);
        }
    }

    public publish(messageName: string, data: any): void {
        if (messageName == undefined || messageName == '') {
            throw 'messageName must be valued';
        }

        const messages: Array<Message> = this.getMessagesByName(messageName);
        for (var i = 0; i < messages.length; i++) {
            var message = messages[i];
            const param: any = { event: { channel: this.instance, message: message }, data: data };
            message.delegate(param);
        }
    }

}

class ChannelCollection {

    public readonly channels: Channel[];

    public constructor() {
        this.channels = [];
    }

    public create(channelName: string): void {
        if (channelName == undefined || channelName == '') {
            throw 'channelName must be valued';
        }

        const channel: Channel = new Channel(channelName);
        this.channels.push(channel);
    }

    public get(channelName: string): Channel | undefined {
        if (channelName == undefined || channelName == '') {
            throw 'channelName must be valued';
        }

        let channel: Channel | undefined = undefined;
        for (let i = 0; i < this.channels.length; i++) {
            if (this.channels[i].name == channelName) {
                channel = this.channels[i];
                break;
            }
        }

        return channel;
    }

    public remove(channelName: string) {
        if (channelName == undefined || channelName == '') {
            throw 'channelName must be valued';
        }
    }

    public clone(channelName: string, channel: Channel) {
        if (channelName == undefined || channelName == '') {
            throw 'channelName must be valued';
        }

        if (channel == undefined || (channel != undefined && channel.isChannel == true)) {
            throw 'channel must be type of Channel';
        }

    }

}

export abstract class HubMessage {

    public static readonly channels: ChannelCollection = new ChannelCollection();

    public static use(channelName: string): Channel | undefined {
        if (channelName == undefined || channelName == '') {
            throw 'channelName must be valued';
        }

        return HubMessage.channels.get(channelName);
    }

    public static broadcast(messageName: string, data: any): void {
        if (messageName == undefined || messageName == '') {
            throw 'messageName must be valued';
        }

        for (let i = 0; i < HubMessage.channels.channels.length; i++) {
            HubMessage.channels.channels[i].publish(messageName, data);
        }
    }

}

declare global {
    interface Window {
        HubMessage: HubMessage;
    }
}

window.HubMessage = HubMessage;