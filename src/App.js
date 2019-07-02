import React from 'react';
import './App.css';
import Stock from './components/stock/Stock';
import Market from './services/Market';


class App extends React.Component {

	constructor(props) {
		super(props);
		this.newStock = this.newStock.bind(this);
		this.state = {
			stocks : []
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

	componentDidMount() {
		Market.getInstance().init();
		Market.getInstance().subscribeForNewStocks(this.newStock);
	}

	render() {
		let stocksHTML = this.state.stocks.map(stock => {
			return <Stock name={stock} />
		});
		return (
			<div className="App">
				<header className="App-header">
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
