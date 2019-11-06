import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import server from '..';
import {
  userA, userB, userInDatabase, addIngredientToDb, addMealToDb,
  removeUserFromDb, addCategoryToDb, addIngredientToMealInDb,
  removeIngredientInDb, removeMealFromDb,
} from './dummyData';

chai.use(chaiHttp);
describe('Admin meal tests', () => {
  let normalUser;
  let adminUser;
  let meal;
  let ingredient;
  let category;
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
    category = await addCategoryToDb({
      category: 'vegetarian',
      description: 'Meals for the lovers of all things vegetarian',
    });
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
  it('shoulf succesfully add a new meal category', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/meal/category')
      .set('Cookie', `token=${adminUser.token};`)
      .send({
        category: 'Keto Diet',
        description: 'Meals for those on a keto diet',
      });
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
    expect(response.body.data.message).to.be.a('string');
  });
  it('should return an error if category input is in wrong format', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/meal/category')
      .set('Cookie', `token=${adminUser.token};`)
      .send({
        category: 5,
        description: 'Meals for those on a keto diet',
      });
    expect(response).to.have.status(400);
    expect(response.body.status).to.equal('fail');
  });
  it('should return an error if category already exists', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/meal/category')
      .set('Cookie', `token=${adminUser.token};`)
      .send({
        category: 'Keto Diet',
        description: 'Meals for those on a keto diet',
      });
    expect(response).to.have.status(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('category already exists');
  });
  it('should succesfully add a meal to a category', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/meal/category/add-meal')
      .set('Cookie', `token=${adminUser.token};`)
      .send({
        mealId: meal.id,
        categoryId: category.id,
      });
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
    expect(response.body.data.message).to.be.a('string');
  });
  it('should return an error if input meal has been added to input category', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/meal/category/add-meal')
      .set('Cookie', `token=${adminUser.token};`)
      .send({
        mealId: meal.id,
        categoryId: category.id,
      });
    expect(response).to.have.status(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('This meal is already in this category');
  });
  it('should return an error if a category does not exist', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/meal/category/add-meal')
      .set('Cookie', `token=${adminUser.token};`)
      .send({
        mealId: meal.id,
        categoryId: 546,
      });
    expect(response).to.have.status(404);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('category does not exist in our database');
  });
  it('shoulf return an error if meal does not exist', async () => {
    const response = await chai
      .request(server)
      .post('/v1.0/api/meal/category/add-meal')
      .set('Cookie', `token=${adminUser.token};`)
      .send({
        mealId: 4355,
        categoryId: category.id,
      });
    expect(response).to.have.status(404);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('meal does not exist in our database');
  });
  it('should return an error if an unauthorized user tries to delete a meal from a category', async () => {
    const response = await chai
      .request(server)
      .delete(`/v1.0/api/meal/category/${category.id}/meal/${meal.id}`)
      .set('Cookie', `token=${normalUser.token};`);
    expect(response).to.have.status(403);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('Halt! You\'re not authorised');
  });
  it('should return an error if the meal id or category id does not exist', async () => {
    const response = await chai
      .request(server)
      .delete('/v1.0/api/meal/category/400/meal/5')
      .set('Cookie', `token=${adminUser.token};`);
    expect(response).to.have.status(404);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('meal does not exist in our database');
  });
  it('should return an error if format of the meal or category id is wrong', async () => {
    const response = await chai
      .request(server)
      .delete('/v1.0/api/meal/category/efver/meal/dfd')
      .set('Cookie', `token=${adminUser.token};`);
    expect(response).to.have.status(400);
    expect(response.body.status).to.equal('fail');
    expect(response.body.error.message).to.equal('Please enter a positive number');
  });
  it('should remove a meal from a meal category successfully', async () => {
    const response = await chai
      .request(server)
      .delete(`/v1.0/api/meal/category/${category.id}/meal/${meal.id}`)
      .set('Cookie', `token=${adminUser.token};`);
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
    expect(response.body.data.message).to.equal('meal deleted successfully');
  });
});

describe('Admin can remove ingredients from a meal', () => {
  let normalUser;
  let adminUser;
  let meal;
  let ingredient;
  before(async () => {
    normalUser = await userInDatabase(userA, 3);
    adminUser = await userInDatabase(userB, 2);
    meal = await addMealToDb({
      name: 'Fried Rice',
      recipe: 'https://recipes.com/fried',
      price: '5000.00',
      prepTime: '45 minutes',
      imageUrl: 'https://images.com/fried',
    });
    ingredient = await addIngredientToDb({ name: 'testingredient', unit: 'grams' });
    await addIngredientToMealInDb({
      ingredientId: ingredient.id,
      mealId: meal.id,
      ingredientQuantity: 3
    });
  });
  after(async () => {
    await removeUserFromDb({ id: normalUser.id });
    await removeUserFromDb({ id: adminUser.id });
    await removeIngredientInDb({ id: ingredient.id });
    await removeMealFromDb({ id: meal.id });
  });
  it('should remove a meal ingredient successfully', async () => {
    const response = await chai
      .request(server)
      .delete(`/v1.0/api/meal/${meal.id}/ingredient/${ingredient.id}`)
      .set('Cookie', `token=${adminUser.token};`);
    expect(response).to.have.status(200);
    expect(response.body.status).to.equal('success');
    expect(response.body.data).to.be.a('object');
    expect(response.body.data.message).to.be.a('string');
  });
  it('should return an error if a normal user tries to remove a meal ingredient', async () => {
    const response = await chai
      .request(server)
      .delete(`/v1.0/api/meal/${meal.id}/ingredient/${ingredient.id}`)
      .set('Cookie', `token=${normalUser.token};`);
    expect(response).to.have.status(403);
    expect(response.body.status).to.equal('fail');
  });
  it('should return an error if the meal id or ingredient id does not exist', async () => {
    const response = await chai
      .request(server)
      .delete('/v1.0/api/meal/400/ingredient/2')
      .set('Cookie', `token=${adminUser.token};`);
    expect(response).to.have.status(404);
    expect(response.body.status).to.equal('fail');
  });
  it('should return an error if format of the meal or ingredient id is wrong', async () => {
    const response = await chai
      .request(server)
      .delete('/v1.0/api/meal/dfdf/ingredient/aaa')
      .set('Cookie', `token=${adminUser.token};`);
    expect(response).to.have.status(400);
    expect(response.body.status).to.equal('fail');
  });
});
