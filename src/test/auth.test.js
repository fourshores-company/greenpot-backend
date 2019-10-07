import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '..';
import { newUser } from './dummyData';

chai.use(chaiHttp);

describe('Authentication route', () => {
  it('should successfully signup a new user', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/auth/signup')
      .send(newUser);
    console.log('user data: ', response.body.data);
    expect(response).to.have.status(201);
    expect(response.body.data).to.be.a('object');
    expect(response.body.data.user.token).to.be.a('string');
    expect(response.body.data.user.firstName).to.be.a('string');
    expect(response.body.data.user.lastName).to.be.a('string');
  });
  it('should return a validation error when supplied and empty email', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/auth/signup')
      .send({ ...newUser, email: '' });
    expect(response).to.have.status(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error).to.be.a('object');
    expect(response.body.error.message).to.equal('Please enter a valid company email address');
  });
  it('should return an integrity error when an existing user\'s email', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/auth/signup')
      .send(newUser);
    expect(response).to.have.status(409);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error).to.be.a('object');
    expect(response.body.error.message).to.equal(`User with email "${newUser.email}" already exists`);
  });
});
