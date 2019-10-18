/* eslint-disable import/no-extraneous-dependencies */
import { UserService } from '../services';
import { Toolbox } from '../utils';

const { addUser } = UserService;
const { createToken } = Toolbox;

export const newUser = {
  firstName: 'ginny',
  lastName: 'chang',
  email: 'jingh@gmail.com',
  password: 'biyyP4U.ee',
  gender: 'male',
  birthDate: '1994-04-16',
  addressLine1: 'No 34, cintro street',
  addressLine2: 'Northpoint drive Allen',
  city: 'Gidi',
  state: 'Lagos',
  country: 'Nigeria',
  phoneNumber: '+2349055679332'
};

export const anotherUser = {
  firstName: 'joh',
  lastName: 'chang',
  email: 'joh@gmail.com',
  password: 'biyyP4U.ee',
  gender: 'male',
  birthDate: '1994-04-16',
  addressLine1: 'No 34, cintro street',
  addressLine2: 'Northpoint drive Allen',
  city: 'Gidi',
  state: 'Lagos',
  country: 'Nigeria',
  phoneNumber: '+2349055679332'
};

export const anotherUser2 = {
  firstName: 'joh',
  lastName: 'chang',
  email: 'user2@gmail.com',
  password: 'biyyP4U.ee',
  gender: 'male',
  birthDate: '1994-04-16',
  addressLine1: 'No 34, cintro street',
  addressLine2: 'Northpoint drive Allen',
  city: 'Gidi',
  state: 'Lagos',
  country: 'Nigeria',
  phoneNumber: '+2349055679332'
};


export const userInDatabase = async (body) => {
  const user = await addUser({ ...body });
  user.token = createToken({ email: user.email, id: user.id });
  return user;
};
