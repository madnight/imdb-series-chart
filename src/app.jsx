import React, { Component } from 'react'
import Navigation from './components/Navigation'
import 'normalize.css'
import "styles/base/_main.sass"  // Global styles
import "styles/base/_common.sass"  // Global styles
import styles from "./app.css"  // Css-module styles
import Highcharts from 'highcharts'
import { HighchartsChart, Chart, withHighcharts, XAxis, YAxis, Title,
    Subtitle, Legend, LineSeries, SplineSeries, Tooltip, Loading
} from 'react-jsx-highcharts'
import { Line } from 'react-chartjs-2'
import Timeout from 'await-timeout'
import Radium from 'radium'
import GithubCorner from 'react-github-corner'

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
}

class App extends Component {
    constructor() {
        super()
        this.state = {
            labels: [],
            title: '',
            data: [],
            id: ''
        }
        this.apiTimeout = 30 * 1000
        this.options = {apiKey: 'db3828ef', timeout: this.apiTimeout}
        this.timeout = new Timeout()
        this.defaultTitle = "tt0141842" // The Sopranos
    }

    getSeries(id) {
        return id.startsWith('tt') ?
            imdb.getById(id, this.options) : imdb.get(id, this.options)
    }

    async getImdb(id) {
        if (id == this.state.id) return
        this.setState({ data: [], title: '', labels: '' })

        try {
            const timerPromise = this.timeout.set(this.apiTimeout, 'Timeout!')
            const series = await Promise.race([this.getSeries(id), timerPromise])
            const episodes = await Promise.race([series.episodes(), timerPromise])

            const pad = (number, digits) =>
                Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number

            const randomColor = memoize((i) =>
                `#${Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, 0)}`)

            const ratings = episodes.map(e => ({
                name: e.name,
                episode: pad(e.episode, 2),
                season: pad(e.season, 2),
                y: parseFloat(e.rating),
                marker: { fillColor: randomColor(e.season) }
            }))

            this.setState({
                data: ratings,
                title: series.title,
                labels: episodes.map(e => e.name),
                id: id
            })
        } catch (e) {
            this.setState({title: "TV Show not found!", id: id})
        } finally {
            this.timeout.clear()
        }
    }

    componentWillMount() {
        if (!this.state.title) this.getImdb(this.defaultTitle)
    }

    componentDidMount() {
        if (this.nameInput) this.nameInput.focus()
    }

    input() {
        return (
            <center>
                <div className="row">
                    <div style={ {
                        width: '40%',
                        marginTop: 40 ,
                        '@media (max-width: 768px)': {
                            width: '80%',
                        }
                    } }>
                    <div className="input-field col s12" >
                        <input
                            id="input"
                            type="text"
                            ref={ i => i && setTimeout(() => { input.focus() }, 100) }
                            onKeyPress={ e =>
                                    e.key === 'Enter' && this.getImdb(e.target.value) }>
                                </input>
                                <label htmlFor="input">Series (e.g. Lost or IMDB id)</label>
                            </div>
                        </div>
                    </div>
                </center>
        )
    }

    render() {
        const pointFmt = "<span style='color:{point.color}'></span>" +
            " S{point.season}E{point.episode} <i>{point.name}</i><br>" +
            " <b>Rating: {point.y}</b><br/>"
        return (
            <div className='App'>
                <GithubCorner
                    href="https://github.com/madnight/imdb-series-chart/"
                />
                <div>
                    <center>
                        <div style={ {
                            width: '90%',
                            marginTop: 20,
                            '@media (max-width: 768px)': {
                                width: '100%',
                            }
                        } }>
                        <HighchartsChart plotOptions={plotOptions}>
                            <Loading isLoading={!this.state.title}>
                                { 'Fetching data... <br>Takes up to 30 seconds.' }
                            </Loading>
                            <Loading
                                isLoading={
                                    this.state.title == "TV Show not found!"}>
                                    { "<h1>TV Show not found!</h1>" }
                                </Loading>
                                <Chart backgroundColor={null}/>
                                <Title>{this.state.title}</Title>
                                <Subtitle>Source: www.omdbapi.com</Subtitle>
                                <Legend
                                    layout="vertical"
                                    align="right"
                                    verticalAlign="middle"/>
                                <Tooltip
                                    headerFormat="<span style='font-size: 10px'></span>"
                                    pointFormat={pointFmt}
                                />
                                <XAxis>
                                    <XAxis.Title>Episode</XAxis.Title>
                                </XAxis>
                                <YAxis id="number">
                                    <SplineSeries
                                        id="imdb"
                                        name={this.state.title}
                                        data={this.state.data}/>
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

export default withHighcharts(Radium(App), Highcharts)
