const {expect} = require('chai')
const supertest = require('supertest')
const app = require('../app')


describe('GET /apps endpoint', () => {
  it('returns an array of apps', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .expect('Content-Type', /json/)
      .then( res => {
        expect(res.body).to.be.an('array').that.has.lengthOf.at.least(1)
        const appResult = res.body[0]
        expect(appResult).to.include.keys('App', 'Genres', 'Rating')
      })
  })

  it('can sort by "App" (name) ascending', () => {
    return supertest(app)
      .get('/apps')
      .query({sort: 'app'})
      .expect(200)
      .expect('Content-Type', /json/)
      .then(res => {
        const results = res.body
        let sorted = true
        let i = 0
        //iterate through results comparing each index with future index [1,2,3] = 2 cycles of checking
        //if current index el is > next el, that is descending and should break loop
        while (i < results.length - 1) {
          if (results[i]["App"] > results[i + 1]["App"]) {
            sorted = false;
            break;
          }
          i++
        }
        expect(sorted).to.be.true;
      })
  })

  it('can filter results by "Genres" ', () => {
    return supertest(app)
      .get('/apps')
      .query({ genres: 'Action' })
      .expect(200)
      .expect('Content-Type', /json/)
      .then((res) => {
        const appArr = res.body;
        appArr.forEach(app => {
          expect(app["Genres"]).to.have.string('Action')
        })
      })

  })
})
