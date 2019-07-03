import React from 'react';
import './App.css';
import Stock from './components/stock/Stock';
import Market from './services/Market';


class App extends React.Component {

	constructor(props) {
		super(props);
		this.newStock = this.newStock.bind(this);
		this.marketStatus = this.marketStatus.bind(this);
		this.state = {
			stocks : [],
			status : ''
		};
	}

	newStock(stock) {
		debugger;
		let stocks = this.state.stocks;
		stocks.push(stock);
		this.setState({
			stocks : stocks
		});
	}

	marketStatus(status) {
		this.setState({
			status : status
		});
	}

	componentDidMount() {
		Market.getInstance().init();
		Market.getInstance().subscribeForNewStocks(this.newStock);
		Market.getInstance().subscribeForMarketStatus(this.marketStatus);
		
	}

	render() {
		let stocksHTML = '';
		if(this.state.stocks.length === 0) {
			stocksHTML = <tr><td colspan='3'>Loading ...</td></tr>;
		} else {
			stocksHTML = this.state.stocks.map(stock => {
				return <Stock name={stock} />
			});
		}
		return (
			<div className="App">
				<header className="App-header">
					<h1>{this.state.status}</h1>
					{/* <img src={logo} className="App-logo" alt="logo" /> */}
					<div>
						<table>
							<thead>
								<tr>
									<td>Stock</td>
									<td>Price</td>
									<td>Last Update</td>
								</tr>
							</thead>
							<tbody>
								{stocksHTML}
							</tbody>
						</table>
					</div>
				</header>
			</div>
		);
	}
}

export default App;
