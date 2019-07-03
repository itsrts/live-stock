
let object = undefined;

let stats = {};

let handlers = {};

let newStocks = [];

let marketStatus = [];

let websocketUrl = {
    production : 'wss://stocks.mnet.website',
    development: 'ws://stocks.mnet.website'
};

class Market {
    constructor() {
        let env = process.env.NODE_ENV || 'development';
        let url = websocketUrl[env];
        this.socket = new WebSocket(url);
    }

    subscribeForNewStocks(handler) {
        newStocks.push(handler);
    }

    subscribeForMarketStatus(handler) {
        marketStatus.push(handler);
    }

    subscribe(stock, handler) {
        if(!handlers[stock]) {
            handlers[stock] = [];
        }
        handlers[stock].push(handler);
    }

    unsubscribe(stock, handler) {
        if(handlers[stock]) {
            handlers[stock] = [].filter((value, index, arr) => {
                return handler !== value;
            });
        }
    }

    publish(stock, payload) {
        if(handlers[stock]) {
            let arr = handlers[stock];
            arr.forEach(handler => {
                handler.call(null, payload);
            });
        }
    }

    publishNewStock(name) {
        newStocks.forEach(handler => {
            handler.call(null, name);
        });
    }

    publishMarketStatus(status) {
        marketStatus.forEach(handler => {
            handler.call(null, status);
        });
    }

    init() {
        this.socket.onopen = function () {
            this.publishMarketStatus('The market is up and moving, Connection OK');
            console.log('Connected!');
        };
        this.socket.onmessage = (event) => {
            // console.log('Received data: ' + event.data);
            let data = JSON.parse(event.data);
            data.forEach(element => {
                let name = element[0];
                let stock = element[1];
                // check if it is a new stock
                if(!stats[name]) {
                    this.publishNewStock(name);
                }
                stats[name] = stock;
                this.publish(name, stock);
            });
            console.log(JSON.stringify(stats));
        };
        this.socket.onclose = () => {
            this.publishMarketStatus('The market seems closed for now, Connection Lost');
            console.log('Lost connection!');
        };
        this.socket.onerror = () => {
            this.publishMarketStatus(`There's too much chaos in the market, some ERROR occured`);
            console.log('Error!');
        };
    }

    close() {
        this.socket.close();
    }

    getStockPrice(name) {
        return stats[name]? stats[name] : 0;
    }

    /**
     * @returns {Market}
     */
    static getInstance() {
        if(object === undefined) {
            object = new Market();
        }
        return object;
    }
}

export default Market;