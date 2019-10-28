
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '..';
import {
  userA, userB, userInDatabase, addIngredientToDb, removeUserFromDb, removeIngredientInDb
} from './dummyData';

chai.use(chaiHttp);

describe('Admin can add ingredients', () => {
  let normalUser;
  let adminUser;
  let item;
  before(async () => {
    normalUser = await userInDatabase(userA, 3);
    adminUser = await userInDatabase(userB, 2);
    item = await addIngredientToDb({ name: 'test', unit: 'grams' });
  });
  after(async () => {
    await removeUserFromDb({ id: normalUser.id });
    await removeUserFromDb({ id: adminUser.id });
    await removeIngredientInDb({ id: item.id });
  });
  it('should successfully add an ingredient', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/ingredient')
      .set('Cookie', `token=${adminUser.token};`)
      .send({ name: 'tomato', unit: 'grams' });
    expect(response).to.have.status(201);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
    expect(response.body.data.message).to.be.a('string');
  });
  it('should return an error if the user is not an admin', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/ingredient')
      .set('Cookie', `token=${normalUser.token};`)
      .send({ name: 'tomato', unit: 'grams' });
    expect(response).to.have.status(403);
    expect(response.body.status).to.equal('fail');
  });
  it('should return a validation error if the inputs are entered in the wrong format', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/ingredient')
      .set('Cookie', `token=${adminUser.token};`)
      .send({ name: 'tomato', unit: 5 });
    expect(response).to.have.status(400);
    expect(response.body.status).to.equal('fail');
  });
  it('should return an error if the ingredient name already exists', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/ingredient')
      .set('Cookie', `token=${adminUser.token};`)
      .send({ name: 'test', unit: 'grams' });
    expect(response).to.have.status(400);
    expect(response.body.status).to.equal('fail');
  });
});

describe('Admin can get / edit / delete ingredient', () => {
  let normalUser;
  let adminUser;
  let item;
  before(async () => {
    normalUser = await userInDatabase(userA, 3);
    adminUser = await userInDatabase(userB, 2);
    item = await addIngredientToDb({ name: 'fish', unit: 'grams' });
  });
  after(async () => {
    await removeUserFromDb({ id: normalUser.id });
    await removeUserFromDb({ id: adminUser.id });
  });
  it('should successfully edit an ingredient', async () => {
    const response = await chai
      .request(server)
      .patch(`/v1.0/api/ingredient/${item.id}`)
      .set('Cookie', `token=${adminUser.token};`)
      .send({ name: 'tomato', unit: 'grams' });
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
    expect(response.body.data.message).to.be.a('string');
  });
  it('should throw an error when editing an ingredient that doesn\'t exist', async () => {
    const response = await chai
      .request(server)
      .patch('/v1.0/api/ingredient/4564')
      .set('Cookie', `token=${adminUser.token};`)
      .send({ name: 'fufu', unit: 'grams' });
    expect(response).to.have.status(404);
    expect(response.body.status).to.equal('fail');
  });
  it('should return a validation error if the inputs are entered in the wrong format', async () => {
    const response = await chai
      .request(server)
      .patch(`/v1.0/api/ingredient/${item.id}`)
      .set('Cookie', `token=${adminUser.token};`)
      .send({ name: 'fufu', unit: 9 });
    expect(response).to.have.status(400);
    expect(response.body.status).to.equal('fail');
  });
  it('should get all ingredients', async () => {
    const response = await chai
      .request(server)
      .get('/v1.0/api/ingredient/all')
      .set('Cookie', `token=${adminUser.token};`);
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
  });
  it('should successfully delete an ingredient', async () => {
    const response = await chai
      .request(server)
      .delete(`/v1.0/api/ingredient/${item.id}`)
      .set('Cookie', `token=${adminUser.token};`);
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data.message).to.be.a('string');
  });
});
