import React, { Component } from 'react'
import Navigation from './components/Navigation'
import 'normalize.css';
import "styles/base/_main.sass"  // Global styles
import "styles/base/_common.sass"  // Global styles
import styles from "./app.sass"  // Css-module styles
import Highcharts from 'highcharts'
import {
  HighchartsChart, Chart, withHighcharts, XAxis, YAxis, Title, Subtitle, Legend, LineSeries, SplineSeries, Tooltip
} from 'react-jsx-highcharts'
import { Line } from 'react-chartjs-2'
import Timeout from 'await-timeout'

const imdb = require('imdb-api')

const plotOptions = {
  spline: {
    lineWidth: 0,
    states: {
      hover: {
        lineWidth: 0
      }
    },
    marker: {
      enabled: true,
      fillColor: "#FF69B4"
    },
  },
  series: {
    showInLegend: false,
    pointStart: 1
  },
};

class App extends Component {
  constructor() {
    super()
    this.state = {
      labels: [],
      title: '',
      data: [],
      id: "tt0141842"
    };

    this.updateInput = this.updateInput.bind(this)
    this.getImdb = this.getImdb.bind(this)
    this.loader = this.loader.bind(this)
    this.movieNotFound = this.movieNotFound.bind(this)
    this.focusUsernameInputField = this.focusUsernameInputField.bind(this)
    this.render = this.render.bind(this)
  }

  async getImdb() {
    this.setState({title: ""})
    const id = this.state.id
    const apiTimeout = 30 * 1000
    const options = {apiKey: 'db3828ef', timeout: apiTimeout}
    const timeout = new Timeout()
    try {
      const timerPromise = timeout.set(apiTimeout, 'Timeout!');
      const getSeries = (id.charAt(0) == 't' && id.charAt(1) == 't') ? imdb.getById(id, options) : imdb.get(id, options)
      const series = await Promise.race([getSeries, timerPromise])
      const episodes = await Promise.race([series.episodes(), timerPromise])
      const ratings = episodes.map(e => ({name: e.name, y: parseFloat(e.rating)}))
      const labels = episodes.map(e => e.name)
      const title = series.title
      this.setState({ data: ratings, title: title, labels: labels, id: id });
    } catch (e) {
      this.setState({title: "invalid"})
    } finally {
      timeout.clear();
    }
  }

  updateInput(event){
    this.setState({id : event.target.value})
  }

  componentWillMount() {
    this.getImdb()
  }

  componentDidMount() {
    if (this.nameInput) this.nameInput.focus()
  }

  focusUsernameInputField(input) {
    if (input) {
      setTimeout(() => { input.focus() }, 100)
    }
  }

  loader() {
    return (
      <center>
        <div style={ {width: '70%', marginTop: 200} }>
          <h5>Processing Request. This may take up to 30 seconds...</h5><br></br>
          <div className="progress">
            <div className="indeterminate"></div>
          </div>
        </div>
      </center>
    )
  }

  input() {
    return (
      <center>
        <div className="row">
          <div style={ {width: '50%'} }>
            <div className="input-field col s12" >
              <input id="input" type="text" ref={this.focusUsernameInputField} onChange={this.updateInput} onKeyPress={(e) => { if (e.key === 'Enter') this.getImdb() }}></input>
              <label htmlFor="input">Series (e.g. Lost or IMDB id)</label>
            </div>
          </div>
        </div>
      </center>
    )
  }
  movieNotFound() {
    return [
      <center>
        <div style={ {width: '70%', marginTop: 200} }>
          <h1>TV Show not Found!</h1>
        </div>
      </center>,
      this.input()
    ]
  }

  render() {
    if (!this.state.title) return this.loader()
    if (this.state.title == "invalid") return this.movieNotFound()
    return (
      <div className='App'>
        <div>
          <HighchartsChart plotOptions={plotOptions}>
            <Chart />
            <Title>{this.state.title}</Title>
            <Subtitle>Source: www.omdbapi.com</Subtitle>
            <Legend layout="vertical" align="right" verticalAlign="middle" />
            <Tooltip headerFormat="<span style='font-size: 10px'>Episode {point.x}</span><br/>"
                     pointFormat="<span style='color:{point.color}'></span> {point.name}: <b>{point.y}</b><br/>"
            />
            <XAxis>
              <XAxis.Title>Episode</XAxis.Title>
            </XAxis>
            <YAxis id="number">
              <SplineSeries id="imdb" name={this.state.title} data={this.state.data} />
            </YAxis>
          </HighchartsChart>
          {this.input()}
        </div>
      </div>
    )
  }
}
export default withHighcharts(App, Highcharts)
