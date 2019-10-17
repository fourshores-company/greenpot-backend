import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '..';
import { Toolbox } from '../utils';
import { anotherUser, userInDatabase } from './dummyData';

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
