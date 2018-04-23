import React, { Component } from 'react'
import Navigation from './components/Navigation'
import 'normalize.css';
import "styles/base/_main.sass"  // Global styles
import "styles/base/_common.sass"  // Global styles
import styles from "./app.css"  // Css-module styles
import Highcharts from 'highcharts'
import { HighchartsChart, Chart, withHighcharts, XAxis, YAxis, Title,
  Subtitle, Legend, LineSeries, SplineSeries, Tooltip, Loading
} from 'react-jsx-highcharts'
import { Line } from 'react-chartjs-2'
import Timeout from 'await-timeout'

const memoize = require('fast-memoize')
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
      id: ""
    };

    this.getImdb = this.getImdb.bind(this)
    this.render = this.render.bind(this)
  }

  async getImdb(id) {
    if (id == this.state.id)
      return
    console.log(id)
    console.log(this.state.id)
    console.log(id == this.state.id)
    this.setState({ data: [], title: "", labels: "" })
    const apiTimeout = 5 * 1000
    const options = {apiKey: 'db3828ef', timeout: apiTimeout}
    const timeout = new Timeout()
    try {
      const timerPromise = timeout.set(apiTimeout, 'Timeout!');
      const getSeries = (id.charAt(0) == 't' && id.charAt(1) == 't') ? imdb.getById(id, options) : imdb.get(id, options)
      const series = await Promise.race([getSeries, timerPromise])
      const episodes = await Promise.race([series.episodes(), timerPromise])
      const pad = (number, digits) =>
        Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number

      const randomColor = memoize((i) => `#${Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, 0)}`)
      const ratings = episodes.map(e => ({
        name: e.name,
        episode: pad(e.episode, 2),
        season: pad(e.season, 2),
        y: parseFloat(e.rating),
        marker: { fillColor: randomColor(e.season) }
      }))
      const labels = episodes.map(e => e.name)
      const title = series.title
      this.setState({ data: ratings, title: title, labels: labels, id: id });
    } catch (e) {
      this.setState({title: "TV Show not found!", id: id})
    } finally {
      timeout.clear();
    }
  }

  componentWillMount() {
    if (!this.state.title)
      this.getImdb("tt0141842")
  }

  componentDidMount() {
    if (this.nameInput) this.nameInput.focus()
  }

  input() {
    return (
      <center>
        <div className="row">
          <div style={ {width: '40%', marginTop: 40 } }>
            <div className="input-field col s12" >
              <input
                id="input"
                type="text"
                ref={ i => i && setTimeout(() => { input.focus() }, 100) }
                onKeyPress={ e => e.key === 'Enter' && this.getImdb(e.target.value) }>
              </input>
              <label htmlFor="input">Series (e.g. Lost or IMDB id)</label>
            </div>
          </div>
        </div>
      </center>
    )
  }

  render() {
    return (
      <div className='App'>
        <div>
          <center>
            <div style={ {width: '90%', marginTop: 20 } }>
              <HighchartsChart plotOptions={plotOptions}>
                <Loading isLoading={!this.state.title}>{ 'Fetching data...' }</Loading>
                <Loading isLoading={this.state.title == "TV Show not found!"}>{ "<h1>TV Show not found!</h1>" }</Loading>
                <Chart backgroundColor={null}/>
                <Title>{this.state.title}</Title>
                <Subtitle>Source: www.omdbapi.com</Subtitle>
                <Legend layout="vertical" align="right" verticalAlign="middle" />
                <Tooltip headerFormat="<span style='font-size: 10px'></span>"
                  pointFormat="<span style='color:{point.color}'></span> S{point.season}E{point.episode} <i>{point.name}</i><br> <b>Rating: {point.y}</b><br/>"
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
</center>
          </div>
        </div>
    )
  }
}
export default withHighcharts(App, Highcharts)
