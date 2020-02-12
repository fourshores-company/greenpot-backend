
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '..';
import {
  userA, userB, userInDatabase, removeUserFromDb, addMealToDb, addCartToDb
} from './dummyData';

chai.use(chaiHttp);

describe('Users can place orders', () => {
  let normalUser;
  let adminUser;
  let meal1;
  let orderId;
  before(async () => {
    normalUser = await userInDatabase(userA, 3);
    adminUser = await userInDatabase(userB, 2);
    meal1 = await addMealToDb({
      name: 'chicken pie',
      recipe: 'http://www.test.com',
      price: 100,
      prepTime: '10 minutes',
      imageUrl: 'http://www.test.com'
    });
    await addCartToDb({
      meals: [
        { mealId: meal1.id, quantity: 10 },
      ],
      userId: normalUser.id,
    });
  });
  after(async () => {
    await removeUserFromDb({ id: normalUser.id });
  });
  it('should successfully place an order via client side', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/order/paystack/verify-client?reference=ekbgxzalif')
      .set('Cookie', `token=${normalUser.token};`);
    expect(response).to.have.status(201);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
    expect(response.body.data.message).to.be.a('string');
  }); // 7vv4mug68h
  it('should fail client side if order status was abandoned or failed', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/order/paystack/verify-client?reference=motfhd07br')
      .set('Cookie', `token=${normalUser.token};`);
    expect(response).to.have.status(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error).to.be.a('object');
  });
  it('should fail if order with payment reference has been created', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/order/paystack/verify-client?reference=ekbgxzalif')
      .set('Cookie', `token=${normalUser.token};`);
    expect(response).to.have.status(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error).to.be.a('object');
  });
  it('should successfully get a users orders', async () => {
    const response = await chai
      .request(server)
      .get('/v1.0/api/order/')
      .set('Cookie', `token=${normalUser.token};`);
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
  });

  // TODO: move these admin actions to separate describe function
  it('should sucessfully get all orders by adim', async () => {
    const response = await chai
      .request(server)
      .get('/v1.0/api/order/all')
      .set('Cookie', `token=${adminUser.token};`);
    orderId = response.body.data.orders[0].id;
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
  });
  it('should return an error if a user is unauthorized', async () => {
    const response = await chai
      .request(server)
      .get('/v1.0/api/order/all')
      .set('Cookie', `token=${normalUser.token};`);
    expect(response).to.have.status(403);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('Halt! You\'re not authorised');
  });

  // TODO: move these admin actions to separate describe function
  it('should successfully get orders by status as admin', async () => {
    const response = await chai
      .request(server)
      .get('/v1.0/api/order/key?status=pending')
      .set('Cookie', `token=${adminUser.token};`);
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
  });
  it('should return an error while getting orders by status if there are no orders', async () => {
    const response = await chai
      .request(server)
      .get('/v1.0/api/order/key?status=completed')
      .set('Cookie', `token=${adminUser.token};`);
    expect(response).to.have.status(404);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error).to.be.a('object');
    expect(response.body.error.message).to.equal('There are no completed orders');
  });
  it('should return an error while getting orders if status parameter is wrong', async () => {
    const response = await chai
      .request(server)
      .get('/v1.0/api/order/key?status=boogie')
      .set('Cookie', `token=${adminUser.token};`);
    expect(response).to.have.status(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error).to.be.a('object');
    expect(response.body.error.message).to.equal('please input a status (completed or pending)');
  });

  // TODO: move these admin actions to separate describe function
  it('should successfully add feedback to order', async () => {
    const response = await chai
      .request(server)
      .post(`/v1.0/api/order/${orderId}/feedback`)
      .set('Cookie', `token=${normalUser.token};`)
      .send({ feedback: 'great order. I was very happy with  the service' });
    expect(response).to.have.status(201);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
  });
  it('should fail to add feedback to order if order is short', async () => {
    const response = await chai
      .request(server)
      .post(`/v1.0/api/order/${orderId}/feedback`)
      .set('Cookie', `token=${normalUser.token};`)
      .send({ feedback: 'great' });
    expect(response).to.have.status(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('Please enter a valid feedback. more than 10 characters and less than 500');
  });
  it('should fail to add feedback to order if order id is in wrong format', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/order/fg/feedback')
      .set('Cookie', `token=${normalUser.token};`)
      .send({ feedback: 'great' });
    expect(response).to.have.status(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('Please enter a positive number');
  });
  it('should fail to add feedback to order if order does not exist', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/order/1000/feedback')
      .set('Cookie', `token=${normalUser.token};`)
      .send({ feedback: 'great order. I was very happy with  the service' });
    expect(response).to.have.status(404);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('order does not exist in our database');
  });

  // admin get feedback
  it('should successfully get all order feedback by admin', async () => {
    const response = await chai
      .request(server)
      .get('/v1.0/api/order/feedback')
      .set('Cookie', `token=${adminUser.token};`);
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
  });
  it('should return an error if a user is unauthorized', async () => {
    const response = await chai
      .request(server)
      .get('/v1.0/api/order/feedback')
      .set('Cookie', `token=${normalUser.token};`);
    expect(response).to.have.status(403);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('Halt! You\'re not authorised');
  });


  // TODO: move these admin actions to separate describe function
  it('should sucessfully update order by adim', async () => {
    const response = await chai
      .request(server)
      .patch(`/v1.0/api/order/${orderId}?status=completed`)
      .set('Cookie', `token=${adminUser.token};`);
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
  });
  // TODO: add more 'should' instances (failures).
});

describe('User can place orders via server api', () => {
  let normalUser;
  let meal1;
  before(async () => {
    normalUser = await userInDatabase(userA, 3);
    meal1 = await addMealToDb({
      name: 'chicken pie',
      recipe: 'http://www.test.com',
      price: 100,
      prepTime: '10 minutes',
      imageUrl: 'http://www.test.com'
    });
    await addCartToDb({
      meals: [
        { mealId: meal1.id, quantity: 10 },
      ],
      userId: normalUser.id,
    });
  });
  after(async () => {
    await removeUserFromDb({ id: normalUser.id });
  });
  it('should successfully place an order server-side', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/order/paystack/verify-server')
      .set('Cookie', `token=${normalUser.token};`)
      .send({
        event: 'charge.success',
        data: {
          id: 84,
          domain: 'test',
          status: 'success',
          reference: '7vv4mug68h',
          gateway_response: 'Approved',
          metadata: {
            userId: normalUser.id,
            meals: [{ mealId: meal1.id, quantity: 10 }],
            address: '123 corbin street, off apapa, lagos, nigeria',
            price: 1000,
          }
        }
      });
    expect(response).to.have.status(201);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
    expect(response.body.data.message).to.be.a('string');
  });
  it('should fail if order with payment reference has been created', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/order/paystack/verify-server')
      .set('Cookie', `token=${normalUser.token};`)
      .send({
        event: 'charge.success',
        data: {
          id: 84,
          domain: 'test',
          status: 'success',
          reference: '7vv4mug68h',
          gateway_response: 'Approved',
        }
      });
    expect(response).to.have.status(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error).to.be.a('object');
  });
});
