import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '..';
import { anotherUser, userInDatabase } from './dummyData';

chai.use(chaiHttp);
let user;
describe('User route on profile update \n PUT /v1.0/api/user/profile/{id}', () =>{
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
