/* eslint-disable import/no-extraneous-dependencies */
import { UserService, RoleService } from '../services';
import { Toolbox } from '../utils';

const { addUser } = UserService;
const { assignRole } = RoleService;
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

export const secondUser = {
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
export const thirdUser = {
  firstName: 'joh',
  lastName: 'chang',
  email: 'user3@gmail.com',
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


export const userInDatabase = async (body, roleId = 2) => {
  const user = await addUser({ ...body });
  await assignRole(user.id, roleId);
  user.token = createToken({ email: user.email, id: user.id, roleId });
  return user;
};
