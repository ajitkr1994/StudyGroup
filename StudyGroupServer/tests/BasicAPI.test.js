const request = require('supertest')
const app = require('../server')
describe('Post Endpoints', () => {
  it('should get', async () => {
    const res = await request(app)
      .get('/api/users');
    //   .send({
    //     userId: 1,
    //     title: 'test is cool',
    //   })
    expect(res.statusCode).toEqual(200)
  })
})
