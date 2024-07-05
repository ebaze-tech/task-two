const request = require('supertest');
const app = require('../server'); 
const { sequelize, User, Organisation, UserOrganisation } = require('../models/index');

describe('Authentication Endpoints', () => {
  let accessToken = ''; // To store the accessToken for subsequent authenticated requests

  // Register User
  it('should register user successfully', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        firstName: 'Mark',
        lastName: 'Angel',
        email: 'mark.angel@gmail.com',
        password: 'password123',
        phone: '1234567890'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data.user).toHaveProperty('userId');
    expect(res.body.data.user).toHaveProperty('firstName', 'Mark');
    expect(res.body.data.user).toHaveProperty('lastName', 'Angel');
    expect(res.body.data.user).toHaveProperty('email', 'mark.angel@example.com');
    accessToken = res.body.data.accessToken; // Store accessToken for use in subsequent tests
  });

  // Login User
  it('should log the user in successfully', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'john.doe@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'success');
    expect(res.body.data).toHaveProperty('accessToken');
  });

  // Invalid Login
  it('should fail if invalid credentials are provided', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'john.doe@example.com',
        password: 'invalidpassword',
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('status', 'error');
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  // Access Authenticated Route
  it('should access authenticated route successfully', async () => {
    const res = await request(app)
      .get('/protected-route')
      .set('Authorization', `Bearer ${accessToken}`); // Set Authorization header with accessToken

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'success');
  });

// Cleanup (if needed)
afterAll(async () => {
    await sequelize.close();
  
    await User.destroy({ where: {}, truncate: true });
    await Organisation.destroy({ where: {}, truncate: true });
    await UserOrganisation.destroy({ where: {}, truncate: true });
  });
  
});


// module.exports = {
//     testMatch: ['**/*.test.js']
// }