
import React from 'react';
import './Stock.css';
import Market from '../../services/Market';

Market.getInstance()

class Stock extends React.Component {

    constructor(props) {
        super(props);
        this.name = props.name;
        this.time = new Date().getTime();
        this.stock = Market.getInstance().getStockPrice(this.name);
        this.updateStock = this.updateStock.bind(this);
        this.updateTime = this.updateTime.bind(this);
        // 
        this.timer = setTimeout(this.updateTime, 1000);
        this.state = {name : props.name, time : '', stock : '', color : 'normal'};
    }

    updateTime(noRepeat) {
        // check for stock price
        let time = new Date().getTime();
        time -= this.time;
        if(time < 30000) {
            time = 'Few seconds ago';
        } else if(time < 6000) {
            time = 'Minute(s) ago';
        } else {
            time = new Date(this.time).toLocaleTimeString();
        }
        this.setState({
            time : time
        });
        // check if the call is required to be recursive
        if(!noRepeat) {
            this.timer = setTimeout(this.updateTime, 5000);
        }
    }

    updateStock(stock) {
        let color = '';

        // parse for any possible string representation
        this.stock = parseFloat(this.stock);
        stock = parseFloat(stock).toFixed(2);

        if(this.stock < stock) {
            color = 'high';
        } else if(this.stock > stock) {
            color = 'low';
        } else {
            color = 'normal';
        }
        this.stock = stock;
        // update stock and color
        this.setState({
            stock : stock,
            color : color
        });
        this.time = new Date().getTime();
        // update Time with noRepeat=true
        this.updateTime(true);
    }

    componentDidMount() {
        // subscribe for stock price update
        Market.getInstance().subscribe(this.name, this.updateStock);
    }

    componentWillUnmount() {
        Market.getInstance().unsubscribe(this.name, this.updateStock);
        clearTimeout(this.timer);
    }

    render() {
        let content = 
            <tr>
                <td>{this.state.name}</td>
                <td className={this.state.color}>{this.state.stock}</td>
                <td className='timeUpdated'>{this.state.time}</td>
            </tr>
        ;
        return content;
    }

}

export default Stock;