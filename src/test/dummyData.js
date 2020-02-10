/* eslint-disable import/no-extraneous-dependencies */
import {
  UserService, RoleService, IngredientService, MealService,
  CategoryService, OrderService, CartService
} from '../services';
import { Toolbox } from '../utils';

const { addUser, updateBykey, deleteBykey } = UserService;
const { assignRole } = RoleService;
const { addIngredient } = IngredientService;
const { addMeal, addIngredientToMeal } = MealService;
const { addCategory } = CategoryService;
const { addMealsToCart} = CartService;
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

export const userA = {
  firstName: 'joh',
  lastName: 'chang',
  email: 'userA@gmail.com',
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

export const userB = {
  firstName: 'joh',
  lastName: 'chang',
  email: 'userB@gmail.com',
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
  await updateBykey({ isVerified: true }, { id: user.id });
  await assignRole(user.id, roleId);
  user.token = createToken({ email: user.email, id: user.id, roleId });
  return user;
};

export const addIngredientToDb = async (ingredient) => {
  const value = await addIngredient(ingredient);
  return value;
};

export const removeIngredientInDb = async (id) => {
  await IngredientService.deleteBykey(id);
};

export const removeUserFromDb = async (id) => {
  await deleteBykey(id);
};

export const addMealToDb = async (meal) => {
  const value = await addMeal(meal);
  return value;
};

export const addIngredientToMealInDb = async (payload) => {
  const value = await addIngredientToMeal(payload);
  return value;
};

export const addCategoryToDb = async (category) => {
  const value = await addCategory(category);
  return value;
};

export const removeMealFromDb = async (payLoad) => {
  await MealService.deleteMealBykey(payLoad);
};

export const addCartToDb = async (payload) => {
  await addMealsToCart(payload);
};
