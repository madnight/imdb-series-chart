import React, { Component } from 'react'
import Navigation from './components/Navigation'
import 'normalize.css';
import "styles/base/_main.sass"  // Global styles
import "styles/base/_common.sass"  // Global styles
import styles from "./app.sass"  // Css-module styles
import Highcharts from 'highcharts'
import {
  HighchartsChart, Chart, withHighcharts, XAxis, YAxis, Title, Subtitle, Legend, LineSeries, SplineSeries
} from 'react-jsx-highcharts'
import { Line } from 'react-chartjs-2';

const plotOptions = {
  spline: {
    lineWidth: 4,
    states: {
      hover: {
        lineWidth: 5
      }
    },
    marker: {
      enabled: false
    },
  },
  series: {
    pointStart: 1
  }
};

class App extends Component {
  constructor() {
    super()
    this.state = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      title: 'My First dataset',
      data: [65, 59, 80, 81, 56, 55, 40],
      id: "tt0141842"
    };

    this.updateInput = this.updateInput.bind(this);
    this.getImdb = this.getImdb.bind(this);
  }

  async getImdb() {
    const imdb = require('imdb-api')
    const id = this.state.id
    console.log(id)
    const options = {apiKey: 'db3828ef', timeout: 30000}
    const series = (id.charAt(0) == 't' && id.charAt(1) == 't') ? await imdb.getById(id, options) : await imdb.get(id, options)

    const episodes = await series.episodes()
    const ratings = episodes.map(e => parseFloat(e.rating))
    const labels = episodes.map(e => e.name)
    const title = series.title
    this.setState({ data: ratings, title: title, labels: labels, id: id });
  }


  updateInput(event){
    this.setState({id : event.target.value})
  }
  componentWillMount() {
    this.getImdb()
  }

  render() {
    return (
      <div className='App'>
        <div>
          <HighchartsChart plotOptions={plotOptions}>
            <Chart />
            <Title>{this.state.title}</Title>
            <Subtitle>Source: www.omdbapi.com</Subtitle>
            <Legend layout="vertical" align="right" verticalAlign="middle" />
            <XAxis>
              <XAxis.Title>Episode</XAxis.Title>
            </XAxis>
            <YAxis id="number">
              <SplineSeries id="imdb" name={this.state.title} data={this.state.data} />
            </YAxis>
          </HighchartsChart>
          <center>
            <div class="row">
            <div style={ {width: '50%'} }>
              <div class="input-field col s12" >
                <input id="input" type="text" onChange={this.updateInput} onKeyPress={(e) => (e.key === 'Enter') && this.getImdb()}></input>
                <label for="input">Series (e.g. Lost or IMDB id)</label>
              </div>
              </div>
            </div>
          </center>
        </div>
      </div>
    )
  }
}
export default withHighcharts(App, Highcharts);
