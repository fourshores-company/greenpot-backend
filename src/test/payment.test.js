import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '..';
import {
  userA, userInDatabase, removeUserFromDb, addMealToDb, addCartToDb
} from './dummyData';

chai.use(chaiHttp);

describe('Pay for orders', () => {
  let normalUser;
  let meal;
  before(async () => {
    normalUser = await userInDatabase(userA, 3);
    meal = await addMealToDb({
      name: 'panini',
      recipe: 'http://www.test.com',
      price: 100,
      prepTime: '10 minutes',
      imageUrl: 'http://www.test.com'
    });
    await addCartToDb({
      meals: [
        { mealId: meal.id, quantity: 10 },
      ],
      userId: normalUser.id,
    });
  });
  after(async () => {
    await removeUserFromDb({ id: normalUser.id });
  });
  it('should successfully create paystack url for specific order', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/pay/paystack')
      .set('Cookie', `token=${normalUser.token};`)
      .send({ address: '123 corbin street, off apapa, lagos, nigeria' });
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
    expect(response.body.data.message).to.be.a('string');
  });
  it('should fail if input parameter is in wrong format', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/pay/paystack')
      .set('Cookie', `token=${normalUser.token};`)
      .send({ address: 50 });
    expect(response).to.have.status(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error).to.be.a('object');
  });
});
