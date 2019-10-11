import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '..';
import { Toolbox } from '../utils';
import { newUser } from './dummyData';

const {
  createToken,
} = Toolbox;

chai.use(chaiHttp);

let userInDatabase;
describe('Authentication route on signup \n POST /v1.0/api/auth/signup', () => {
  it('should successfully signup a new user', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/auth/signup')
      .send(newUser);
    userInDatabase = response.body.data.user;
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

describe('Authentication route for email verification \n GET/v1.0/api/auth/verify?token=', () => {
  it('should return a success response of 200 when user has been verified', async () => {
    const { firstName, token } = userInDatabase;
    const response = await chai
      .request(server)
      .get(`/v1.0/api/auth/verify?token=${token}`);
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
    expect(response.body.data.message).to.be.a('string');
    expect(response.body.data.message).to.equal(`Welome ${firstName}, you have been verified!`);
  });
  it('should return 400 error if there is no token in url', async () => {
    const response = await chai
      .request(server)
      .get('/v1.0/api/auth/verify?token=');
    expect(response).to.have.status(400);
    expect(response.body.error.message).to.equal('We could not verify your email, the token provided was invalid');
  });
  it('should return an error if an invalid token is in url', async () => {
    const response = await chai
      .request(server)
      .get('/v1.0/api/auth/verify?token=jhgvgfghjy67809hiuh7g.kbyu');
    expect(response).to.have.status(400);
    expect(response.body.error.message).to.equal('We could not verify your email, the token provided was invalid');
  });
  it('should return a 404 error if user in verification token does not exist', async () => {
    const token = createToken({ id: 70 });
    const response = await chai
      .request(server)
      .get(`/v1.0/api/auth/verify?token=${token}`);
    expect(response).to.have.status(404);
    expect(response.body.error.message).to.equal('Sorry, we do not recognise this user in our database');
  });
});

describe('Authentication routes for password reset \n POST /v1.0/api/auth/reset-password', () => {
  it('should return a success response of 200 when a password has been reset', async () => {
    const { token } = userInDatabase;
    const resetValues = { password: 'defc34.Ase', confirmPassword: 'defc34.Ase' };
    const response = await chai
      .request(server)
      .post('/v1.0/api/auth/reset-password')
      .set('Cookie', `token=${token};`)
      .send(resetValues);
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
    expect(response.body.data.message).to.be.a('string');
    expect(response.body.data.message).to.equal('Password has been changed successfully');
  });
  it('should return a 400 error when password validation does not pass', async () => {
    const { token } = userInDatabase;
    const resetValues = { password: 'defc34.Ase', confirmPassword: 'defc34.Dse' };
    const response = await chai
      .request(server)
      .post('/v1.0/api/auth/reset-password')
      .set('Cookie', `token=${token};`)
      .send(resetValues);
    expect(response).to.have.status(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('Please make sure the passwords match');
  });
  it('should return a 401 error when no token is detected', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/auth/reset-password')
      .set('Cookie', 'token=;');
    expect(response).to.have.status(401);
    expect(response.body.error.message).to.equal('Access denied, Token required');
  });
  it('should return a 400 error when an invalid token is detected', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/auth/reset-password')
      .set('Cookie', 'token=sdfrfvrfvr546;');
    expect(response).to.have.status(400);
    expect(response.body.error.message).to.equal('We could not verify your email, the token provided was invalid');
  });
  it('should return a 404 error if user in token does not exist', async () => {
    const token = createToken({ id: 70 });
    const resetValues = { password: 'defc34.Dse', confirmPassword: 'defc34.Dse' };
    const response = await chai
      .request(server)
      .post('/v1.0/api/auth/reset-password')
      .set('Cookie', `token=${token};`)
      .send(resetValues);
    expect(response).to.have.status(404);
    expect(response.body.error.message).to.equal('Sorry, we do not recognise this user in our database');
  });
});
