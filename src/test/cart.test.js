import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '..';
import {
  userA, userInDatabase, removeUserFromDb, addMealToDb
} from './dummyData';

chai.use(chaiHttp);

describe('User add meal to cart', () => {
  let normalUser;
  let meal1;
  let meal2;
  let meal3;
  before(async () => {
    normalUser = await userInDatabase(userA, 3);
    meal1 = await addMealToDb({
      name: 'chicken pie',
      recipe: 'http://www.test.com',
      price: 500,
      prepTime: '10 minutes',
      imageUrl: 'http://www.test.com'
    });
    meal2 = await addMealToDb({
      name: 'apple pie',
      recipe: 'http://www.test.com',
      price: 300,
      prepTime: '10 minutes',
      imageUrl: 'http://www.test.com'
    });
    meal3 = await addMealToDb({
      name: 'fish pie',
      recipe: 'http://www.test.com',
      price: 400,
      prepTime: '20 minutes',
      imageUrl: 'http://www.test.com'
    });
  });
  after(async () => {
    await removeUserFromDb({ id: normalUser.id });
  });
  it('should be unsuccessfull if the request is not authenticated ', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/cart')
      .send({
        meals: [
          { mealId: meal1.id, quantity: 10 },
          { mealId: meal2.id, quantity: 10 }
        ]
      });
    expect(response).to.have.status(401);
    expect(response.body.status).to.equal('fail');
  });
  it('should be unsuccessfull if the meal id does not exist ', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/cart')
      .set('Cookie', `token=${normalUser.token};`)
      .send({
        meals: [
          { mealId: 500000, quantity: 10 },
          { mealId: meal2.id, quantity: 10 }
        ]
      });
    expect(response).to.have.status(400);
    expect(response.body.status).to.equal('fail');
  });
  it('should be unsuccessfull if the meal id does not exist ', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/cart')
      .set('Cookie', `token=${normalUser.token};`)
      .send({
        meals: [
          { mealId: 500000, quantity: 10 },
          { mealId: meal2.id, quantity: 10 }
        ]
      });
    expect(response).to.have.status(400);
    expect(response.body.status).to.equal('fail');
  });
  it('should be unsuccessfull if the request body is in the wrong format ', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/cart')
      .set('Cookie', `token=${normalUser.token};`)
      .send({
        meals: [
          { mealId: 500000, quantity: 'sjjdjs' },
          { mealId: meal2.id, quantity: 10 }
        ]
      });
    expect(response).to.have.status(400);
    expect(response.body.status).to.equal('fail');
  });
  it('should successfully add meals to cart', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/cart')
      .set('Cookie', `token=${normalUser.token};`)
      .send({
        meals: [
          { mealId: meal1.id, quantity: 10 },
          { mealId: meal2.id, quantity: 10 },
          { mealId: meal3.id, quantity: 10 }
        ]
      });
    expect(response).to.have.status(201);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
    expect(response.body.data.message).to.be.a('string');
  });
  it('should successfully get all meals in cart', async () => {
    const response = await chai
      .request(server)
      .get('/v1.0/api/cart')
      .set('Cookie', `token=${normalUser.token};`);
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
  });
  it('should successfully edit a meal', async () => {
    const response = await chai
      .request(server)
      .patch(`/v1.0/api/cart/${meal3.id}/${15}`)
      .set('Cookie', `token=${normalUser.token};`);
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
    expect(response.body.data.message).to.be.a('string');
  });
  it('should successfully delete a meal in cart', async () => {
    const response = await chai
      .request(server)
      .delete(`/v1.0/api/cart/${meal3.id}`)
      .set('Cookie', `token=${normalUser.token};`);
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
    expect(response.body.data.message).to.be.a('string');
  });
});
