const express = require('express')
const app = express()
const apps = require('./apps.js')
const morgan = require('morgan')

app.use(morgan('dev'))


app.get('/apps', (req, res) => {
  const { sort, genres } = req.query
  let results = [...apps];

  if (genres) {
    const genresOptions = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'];

    if (!genresOptions.includes(genres.charAt(0).toUpperCase() + genres.slice(1).toLowerCase())) {
      return res.status(400).send("must select between genres Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'")
    }

    results = results.filter(app => {
      let appsGenre = app["Genres"].split(/[\s;]+/)[0]
      return  genres.toLowerCase() === appsGenre.toLowerCase()
    });
  }

  if (sort) {

    if (!['rating', 'app'].includes(sort.toLowerCase())) {
      return res.status(400).send('sort by rating or app')
    }

    let sortKey = sort.charAt(0).toUpperCase() + sort.slice(1)

    results.sort((a , b) => {
      return a[sortKey] > b[sortKey] ? 1 : a[sortKey] < b[sortKey] ? -1 : 0;
    })
  }


  res.json(results)
})


module.exports = app;
