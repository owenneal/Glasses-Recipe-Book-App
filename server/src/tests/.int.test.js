const mongoose = require('mongoose');
const Item = require('../../src/models/Item');

describe('Database Integration Tests', () => {
  beforeAll(async () => {
    await mongoose.connect('mongodb://mongo:27017/testdb');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should save an item to the database', async () => {
    const item = new Item({ name: 'Test Item' });
    const savedItem = await item.save();
    expect(savedItem._id).toBeDefined();
  });

  it('should fetch items from the database', async () => {
    const items = await Item.find();
    expect(items.length).toBeGreaterThan(0);
  });
});
