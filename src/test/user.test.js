import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '..';
import { Toolbox } from '../utils';
import { anotherUser, userInDatabase, secondUser, thirdUser } from './dummyData';
import env from '../config/env';

const { ADMIN_KEY } = env;
const { createToken } = Toolbox;

chai.use(chaiHttp);
let user;
describe('User route on profile update \n PUT /v1.0/api/user/profile/{id}', () => {
  it('should succesfully update a user profile', async () => {
    user = await userInDatabase(anotherUser);
    const update = {
      lastName: 'Chao',
      gender: 'male',
      addressLine1: 'ajayi estate',
      city: 'Busuri',
      state: 'Enugu',
      phoneNumber: '+2345960456883',
    };
    const response = await chai
      .request(server)
      .put(`/v1.0/api/user/profile/${user.id}`)
      .set('Cookie', `token=${user.token};`)
      .send(update);
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
    expect(response.body.data.message).to.be.a('string');
    expect(response.body.data.message).to.equal('Profile update was successful');
  });
  it('should return am authentication error of 401 for unknown user', async () => {
    const response = await chai
      .request(server)
      .put('/v1.0/api/user/profile/452')
      .set('Cookie', `token=${user.token};`)
      .send({ });
    expect(response).to.have.status(401);
    expect(response.body.status).to.equal('fail');
  });
});

describe('User route get profile \n GET /v1.0/api/user/profile/{id}', () => {
  it('should succesfully get a user profile', async () => {
    const response = await chai
      .request(server)
      .get(`/v1.0/api/user/profile/${user.id}`)
      .set('Cookie', `token=${user.token};`);
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
    expect(response.body.data.user.firstName).to.be.a('string');
  });
  it('should return a 401 error when user in token does not match user in url', async () => {
    const response = await chai
      .request(server)
      .get('/v1.0/api/user/profile/456')
      .set('Cookie', `token=${user.token};`);
    expect(response).to.have.status(401);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('Access denied, check your inputed details');
  });
  it('should return a 401 error if user in token does not exist', async () => {
    const token = createToken({ id: 70 });
    const response = await chai
      .request(server)
      .get('/v1.0/api/user/profile/456')
      .set('Cookie', `token=${token};`);
    expect(response).to.have.status(401);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('Access denied, check your inputed details');
  });
  it('should return a 401 errror when user token is not present', async () => {
    const response = await chai
      .request(server)
      .get('/v1.0/api/user/profile/456')
      .set('Cookie', 'token=;');
    expect(response).to.have.status(401);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('Access denied, Token required');
  });
});

describe('A user can delete their account', () => {
  let user2;
  it('should successfully delete a logged in user\'s account', async () => {
    user2 = await userInDatabase(secondUser);
    const response = await chai
      .request(server)
      .delete(`/v1.0/api/user/${user2.id}`)
      .set('Cookie', `token=${user2.token};`);
    expect(response).to.have.status(200);
  });
  it('should return an error if the userId is not in the proper format', async () => {
    const response = await chai
      .request(server)
      .delete('/v1.0/api/user/djjs')
      .set('Cookie', `token=${user2.token}`);
    expect(response).to.have.status(400);
    expect(response.body.status).to.equal('fail');
  });
  it('should return an error if the userId does not exist', async () => {
    const response = await chai
      .request(server)
      .delete('/v1.0/api/user/500')
      .set('Cookie', `token=${user2.token}`);
    expect(response).to.have.status(400);
  });
  it('should return an error if a user tries to delete a profile that\'s not his/hers', async () => {
    const response = await chai
      .request(server)
      .delete(`/v1.0/api/user/${user.id}`)
      .set('Cookie', `token=${user2.token}`);
    expect(response).to.have.status(401);
    expect(response.body.status).to.equal('fail');
  });
});

describe('User Role settings route \n POST /v1.0/api/user/role', () => {
  let user3;
  const load = { roleId: 2, adminKey: ADMIN_KEY };
  it('should throw an error if uan invalid admin key is given', async () => {
    user3 = await userInDatabase(thirdUser);
    const dummy = { roleId: 1, adminKey: 456 };
    const response = await chai
      .request(server)
      .patch('/v1.0/api/user/role')
      .set('Cookie', `token=${user3.token}`)
      .send(dummy);
    expect(response).to.have.status(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('Admin key must be a string');
  });
  it('should throw an error if an invalid role id is given', async () => {
    const dummy = { roleId: 3, adminKey: 456 };
    const response = await chai
      .request(server)
      .patch('/v1.0/api/user/role')
      .set('Cookie', `token=${user3.token}`)
      .send(dummy);
    expect(response).to.have.status(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('Please enter a valid role id');
  });
  it('Should throw an error if the admin key does not match', async () => {
    const dummy = { roleId: 2, adminKey: 'dfvfg' };
    const response = await chai
      .request(server)
      .patch('/v1.0/api/user/role')
      .set('Cookie', `token=${user3.token}`)
      .send(dummy);
    expect(response).to.have.status(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('Incorrect admin key');
  });
  it('Should throw an error if the user in token is not found', async () => {
    const token = createToken({ id: 70, email: 'retrs@greenpot.com', roleId: 3 });
    const dummy = { roleId: 2, adminKey: ADMIN_KEY };
    const response = await chai
      .request(server)
      .patch('/v1.0/api/user/role')
      .set('Cookie', `token=${token}`)
      .send(dummy);
    console.log('response', response.body);
    expect(response).to.have.status(404);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('User does not exist');
  });
  it('should successfully update a users role given the right parameters', async () => {
    const response = await chai
      .request(server)
      .patch('/v1.0/api/user/role')
      .set('Cookie', `token=${user3.token}`)
      .send(load);
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data.updatedRole).to.be.a('object');
    expect(response.body.data.message).to.be.a('string');
    expect(response.body.data.message).to.equal('User role update successful');
  });
});
