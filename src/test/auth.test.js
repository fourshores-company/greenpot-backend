import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '..';
import { newUser } from './dummyData';

chai.use(chaiHttp);


describe('Authentication route on signup \n POST /v1.0/api/auth/signup', () => {
  it('should successfully signup a new user', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/auth/signup')
      .send(newUser);
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
    expect(response.body.error.message).to.equal('Please enter a valid email address');
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

describe('Authentication route on login \n POST /v1.0/api/auth/login', () => {
  it('should succesfully login an existing user', async () => {
    const { email, password } = newUser;
    const loginUser = { email, password };
    const response = await chai
      .request(server)
      .post('/v1.0/api/auth/login')
      .send(loginUser);
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
    expect(response.body.data.message).to.be.a('string');
    expect(response.body.data.message).to.equal('Login Successful');
  });
  it('should fail when an incorrect password is inputed with status 401', async () => {
    const { email } = newUser;
    const loginUser = { email, password: 'ewsdc546.343DE' };
    const response = await chai
      .request(server)
      .post('/v1.0/api/auth/login')
      .send(loginUser);
    expect(response).to.have.status(401);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('This password is incorrect');
  });
  it('should fail when the user does not exist in database with a 404 error', async () => {
    const loginUser = { email: 'jeff@gmail.com', password: 'ewsdc546.343DE' };
    const response = await chai
      .request(server)
      .post('/v1.0/api/auth/login')
      .send(loginUser);
    expect(response).to.have.status(404);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal(`User with email "${loginUser.email}" does not exists. Please check your details`);
  });
});
