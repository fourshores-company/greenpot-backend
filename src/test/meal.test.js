import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '..';
import {
  userA, userB, userInDatabase, addIngredientToDb, addMealToDb, removeUserFromDb
} from './dummyData';

chai.use(chaiHttp);
describe('Admin can add meals and add ingredients to meals', () => {
  let normalUser;
  let adminUser;
  let meal;
  let ingredient;
  before(async () => {
    normalUser = await userInDatabase(userA, 3);
    adminUser = await userInDatabase(userB, 2);
    meal = await addMealToDb({
      name: 'Jollof Rice',
      recipe: 'https://recipes.com/jollof',
      price: '5000.00',
      prepTime: '45 minutes',
      imageUrl: 'https://images.com/jollof',
    });
    ingredient = await addIngredientToDb({ name: 'fish', unit: 'grams' });
  });
  after(async () => {
    await removeUserFromDb({ id: normalUser.id });
    await removeUserFromDb({ id: adminUser.id });
  });
  it('should successfully add a meal', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/meal')
      .set('Cookie', `token=${adminUser.token};`)
      .send({
        name: 'Egusi Soup',
        recipe: 'https://recipes.com/egusi',
        price: '5000.00',
        prepTime: '2 hours',
        imageUrl: 'https://images.com/egusi',
      });
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
    expect(response.body.data.message).to.be.a('string');
  });
  it('should return an error if a user is unauthorized', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/meal')
      .set('Cookie', `token=${normalUser.token};`)
      .send({
        name: 'Egusi Soup',
        recipe: 'https://recipes.com/egusi',
        price: '5000.00',
        prepTime: '2 hours',
        imageUrl: 'https://images.com/egusi',
      });
    expect(response).to.have.status(403);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('Halt! You\'re not authorised');
  });
  it('should return a validation error if input format is wrong', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/meal')
      .set('Cookie', `token=${adminUser.token};`)
      .send({
        name: 'Egusi Soup',
        recipe: 'https://recipes.com/egusi',
        price: 'sfsf',
        prepTime: '2 hours',
        imageUrl: 'https://images.com/egusi',
      });
    expect(response).to.have.status(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('Please add price of meal');
  });
  it('Should return an error if meal already exists', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/meal')
      .set('Cookie', `token=${adminUser.token};`)
      .send({
        name: 'Egusi Soup',
        recipe: 'https://recipes.com/egusi',
        price: '5000.00',
        prepTime: '2 hours',
        imageUrl: 'https://images.com/egusi',
      });
    expect(response).to.have.status(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('meal already exists');
  });
  it('should successfully add an ingredient to a meal', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/meal/add-ingredient')
      .set('Cookie', `token=${adminUser.token};`)
      .send({
        mealId: meal.id,
        ingredientId: ingredient.id,
        ingredientQuantity: 5,
      });
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
    expect(response.body.data.message).to.be.a('string');
  });
  it('should return an error if ingredient does not exist', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/meal/add-ingredient')
      .set('Cookie', `token=${adminUser.token};`)
      .send({
        mealId: 1,
        ingredientId: 400,
        ingredientQuantity: 5,
      });
    expect(response).to.have.status(404);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('ingredient does not exist in our database');
  });
  it('should return an error if mean does not exist', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/meal/add-ingredient')
      .set('Cookie', `token=${adminUser.token};`)
      .send({
        mealId: 4099,
        ingredientId: 1,
        ingredientQuantity: 5,
      });
    expect(response).to.have.status(404);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('meal does not exist in our database');
  });
  it('should successfully return all meals', async () => {
    const response = await chai
      .request(server)
      .get('/v1.0/api/meal')
      .set('Cookie', `token=${adminUser.token};`);
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
  });
});
