import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import SequelizeUser from '../database/models/SequelizeUser';
import JWT from '../utils/JWTUtils';
import Validations from '../middlewares/Validations';
import loginMock from './mocks/Login.mock';

import * as bcrypt from 'bcryptjs';
import LoginService from '../services/LoginService';
import LoginController from '../controllers/LoginController';

chai.use(chaiHttp);

const { expect } = chai;

describe('As rotas /login', function () { 
   beforeEach(function () { sinon.restore(); });

  it('Ao não receber um e-mail, retorna um erro', async function () {
      // Arrange
      const httpRequestBody = loginMock.noEmailLoginBody

      // Act
      const httpResponse = await chai.request(app).post('/login').send(httpRequestBody);

      // Assert
      expect(httpResponse.status).to.equal(400);
      expect(httpResponse.body).to.be.deep.equal({ message: 'All fields must be filled' });
  });

  it('Recebendo um e-mail inexistente, retorna um erro', async function () {
    // Arrange
    const httpRequestBody = loginMock.notExistingUserBody
    sinon.stub(SequelizeUser, 'findOne').resolves(null);

    // Act
    const httpResponse = await chai.request(app).post('/login').send(httpRequestBody);

    // Assert
    expect(httpResponse.status).to.equal(401);
    expect(httpResponse.body).to.be.deep.equal({ message: 'Invalid email or password' });
  });

  it('Recebendo um e-mail existente e uma senha errada, retorna um erro', async function () {
    // Arrange
    const httpRequestBody = loginMock.existingUserWithWrongPasswordBody 

    const mockReturn = SequelizeUser.build(loginMock.existingUser);

    sinon.stub(SequelizeUser, 'findOne').resolves(mockReturn);

    // Act
    const httpResponse = await chai.request(app).post('/login')
      .send(httpRequestBody);

    // Assert
    expect(httpResponse.status).to.equal(401);
    expect(httpResponse.body).to.be.deep.equal({ message: 'Invalid email or password' });
  });

  it('Recebendo um e-mail e uma senha válida, retorna um token', async function () {
    // Arrange
    const httpRequestBody = loginMock.validLoginBody
    const mockReturn = SequelizeUser.build(loginMock.existingUser);
    sinon.stub(SequelizeUser, 'findOne').resolves(mockReturn);
    sinon.stub(bcrypt, 'compareSync').returns(true);
    sinon.stub(Validations, 'validateLogin').returns();

    // Act
    const httpResponse = await chai.request(app).post('/login').send(httpRequestBody);

    // Assert
    expect(httpResponse.status).to.equal(200);
    expect(httpResponse.body).to.have.key('token');
  });

  // it('GET /role ao receber um token válido, retorna o role do user', async function () {
	// 	sinon.stub(LoginController, 'getUserRole').resolves(loginMock.existingUser.role as any);
  //   sinon.stub(Validations, 'validateToken').returns();

	// 	const httpResponse = await chai.request(app).get('/login/role')
  //   .set('authorization', loginMock.validToken)
	// 	.send();

	// 	const { status, body } = httpResponse;

	// 	expect(status).to.equal(200);
	// 	expect(body).to.deep.equal({ role: 'admin' });
	// });
});