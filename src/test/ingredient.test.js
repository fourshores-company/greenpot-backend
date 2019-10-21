import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '..';
import {
  userA, userB, userInDatabase, addIngredientToDb, removeUserFromDb
} from './dummyData';

chai.use(chaiHttp);

describe('Admin can add ingredients', () => {
  let normalUser;
  let adminUser;
  before(async () => {
    normalUser = await userInDatabase(userA, 3);
    adminUser = await userInDatabase(userB, 2);
    await addIngredientToDb({ name: 'test', unit: '1 gram' });
  });
  after(async () => {
    await removeUserFromDb({ id: normalUser.id });
    await removeUserFromDb({ id: adminUser.id });
  });
  it('should successfully add an ingredient', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/ingredient')
      .set('Cookie', `token=${adminUser.token};`)
      .send({ name: 'tomato', unit: '1 gram' });
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
      .send({ name: 'tomato', unit: '1 gram' });
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
      .send({ name: 'test', unit: '1 gram' });
    expect(response).to.have.status(400);
    expect(response.body.status).to.equal('fail');
  });
});
