const request = require('supertest');
const app = require('../../src/app');

describe('API E2E Tests', () => {
  it('should return a list of items', async () => {
    const res = await request(app).get('/api/items');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('items');
  });

  it('should create a new item', async () => {
    const res = await request(app)
      .post('/api/items')
      .send({ name: 'New Item' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});
