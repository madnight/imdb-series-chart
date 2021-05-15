import 'normalize.css'
import "styles/base/_main.sass"
import "styles/base/_common.sass"

import GithubCorner                        from 'react-github-corner'
import Highcharts                          from 'highcharts'
import Radium                              from 'radium'
import Timeout                             from 'await-timeout'
import axios                               from 'axios'
import React, { Component }                from 'react'
import { Autocomplete }                    from 'react-materialize'
import { reduce, flow, flatten, at, drop } from 'lodash/fp'
import { randomColor, pad, query }         from './utils'
import { HighchartsChart, Chart,
    withHighcharts, XAxis, YAxis, Title,
    Subtitle, Legend, SplineSeries,
    Tooltip, Loading }                     from 'react-jsx-highcharts'

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

    constructor(props) {
        super(props)
        this.state = {
            labels: [],
            title: '',
            data: [],
            id: ''
        }
        this.apiTimeout = 30 * 1000
        this.timeout = new Timeout()
        this.defaultTitle = "tt0141842" // The Sopranos
        this.complList = {}
        this.API = "https://imdb.beuke.org/series-384357a.json?sql="
    }

    async getSeries(id) {
        const baseQuery = query("select * from series where ")
        const orderBy = query(" order by CAST(seasonNumber as" +
             " INT), CAST(episodeNumber as INT)")
        return id.startsWith('tt') ?
            axios.get(this.API + baseQuery +
                query("parentTconst = \"" + id + "\"" + orderBy))
            : axios.get(this.API + baseQuery +
                query(" seriesTitle = \"" + id + "\"" + orderBy))
    }

    async getImdb(id) {
        if (id === this.state.id) return
        this.setState({ data: [], title: '', labels: '' })

        try {
            const series = await this.getSeries(id)

            const ratings = series.data.rows.map( e => {
                /* eslint-disable no-unused-vars */
                const [seasonNo, episodeNo, _, episode, rating]
                    = [...(drop(2)(e))]
                return ({
                    name: episode,
                    episode: pad(episodeNo, 2),
                    season: pad(seasonNo, 2),
                    y: parseFloat(rating),
                    marker: { fillColor: randomColor(seasonNo) }
                })
            })

            this.setState({
                data: ratings,
                title: series.data.rows[0][4],
                labels: "",
                id: id
            })

        } catch (e) {
            this.setState({title: "TV Show not found!", id: id})
        }
    }

    async componentDidMount() {
        this.complList = flow(
            at("data.rows"),
            flatten,
            reduce((r, i) => {
                r[i] = null
                return r
            }, {}))((
            await axios
                .get((this.API +
                query("select DISTINCT seriesTitle from series limit 1000")
                ))))
        document.getElementById("input").focus()
        if (!this.state.title) this.getImdb(this.defaultTitle)
    }

    input() {
        return (
            <center>
                <div className="row">
                    <div style={ {
                        width: '40%',
                        marginTop: 40,
                        '@media (max-width: 768px)': {
                            width: '80%',
                        }
                    } }>
                        <Autocomplete
                            title='Series Title or IMDB ID'
                            id="input"
                            options={{
                                data: this.complList,
                                onAutocomplete: v => this.getImdb(v),
                                minLength: 2,
                            }}
                            onKeyPress={ e => e.key === 'Enter'
                                && this.getImdb(e.target.value) }
                            minLength={ 2 }
                            s={ 12 }
                            limit={ 5 }
                        />
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
                                    { 'Fetching data...' }
                                </Loading>
                                <Loading
                                    isLoading={
                                        this.state.title === "TV Show not found!"}>
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
                                    headerFormat=
                                        "<span style='font-size: 10px'></span>"
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
