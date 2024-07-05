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



const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Make sure you export your Express app from app.js

chai.use(chaiHttp);
const { expect } = chai;

describe('Auth API', () => {
  describe('POST /auth/register', () => {
    it('should register user successfully with default organisation', (done) => {
      chai.request(app)
        .post('/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: '123456',
          phone: '1234567890',
        })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body.status).to.equal('success');
          expect(res.body.message).to.equal('Registration successful');
          done();
        });
    });

    it('should fail if required fields are missing', (done) => {
      chai.request(app)
        .post('/auth/register')
        .send({
          lastName: 'Doe',
          email: 'john@example.com',
          password: '123456',
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.be.an('object');
          expect(res.body.errors).to.be.an('array');
          done();
        });
    });

    it('should fail if there’s a duplicate email', (done) => {
      chai.request(app)
        .post('/auth/register')
        .send({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: '123456',
          phone: '1234567890',
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.be.an('object');
          expect(res.body.errors).to.be.an('array');
          done();
        });
    });
  });

  describe('POST /auth/login', () => {
    it('should log the user in successfully', (done) => {
      chai.request(app)
        .post('/auth/login')
        .send({
          email: 'john@example.com',
          password: '123456',
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.status).to.equal('success');
          expect(res.body.message).to.equal('Login successful');
          done();
        });
    });

    it('should fail if credentials are invalid', (done) => {
      chai.request(app)
        .post('/auth/login')
        .send({
          email: 'john@example.com',
          password: 'wrongpassword',
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.be.an('object');
          expect(res.body.status).to.equal('Bad request');
          expect(res.body.message).to.equal('Authentication failed');
          done();
        });
    });
  });
});
