import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import SequelizeMatch from '../database/models/SequelizeMatch';
import SequelizeUser from '../database/models/SequelizeUser';
import SequelizeTeam from '../database/models/SequelizeTeam';
import { match, matches, matchesInProgress, matchesFinished, newMatch, sendMatch, sendEqualTeamsMatch } from './mocks/Match.mock';
import loginMock from './mocks/Login.mock';
import JWT from '../utils/JWTUtils';
import Validations from '../middlewares/Validations';

import * as bcrypt from 'bcryptjs';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testando as rotas /matches', () => {
  it('Lista todas as partidas corretamente', async function() {
    sinon.stub(SequelizeMatch, 'findAll').resolves(matches as any)

    const { status, body } = await chai.request(app).get('/matches');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(matches);
  })

  it('Retorna todas as partidas em andamento com sucesso', async function () {
    sinon.stub(SequelizeMatch, 'findAll').resolves(matchesInProgress as any);

    const { status, body } = await chai.request(app).get('/matches?inProgress=true');
    
    expect(status).to.equal(200);
    expect(body).to.deep.equal(matchesInProgress);
  });

  it('Retorna todas as partidas finalizadas com sucesso', async function () {
    sinon.stub(SequelizeMatch, 'findAll').resolves(matchesFinished as any);
    
    const { status, body } = await chai.request(app).get('/matches?inProgress=false');
    
    expect(status).to.equal(200);
    expect(body).to.deep.equal(matchesFinished);
  });

  it('Finaliza uma partida com sucesso', async function() {
    sinon.stub(SequelizeUser, 'findOne').resolves(loginMock.existingUser as any);
    sinon.stub(bcrypt, 'compareSync').resolves(true);
    sinon.stub(SequelizeMatch, 'findByPk').resolves(match as any);
    sinon.stub(SequelizeMatch, 'update').resolves([1]);

    const responseLogin = await chai.request(app).post('/login').send(loginMock.validLoginBody);
    const { status, body } = await chai.request(app).patch('/matches/1/finish')
      .set('authorization', `Bearer ${responseLogin.body.token}`);

    expect(status).to.equal(200);
    expect(body).to.be.deep.equal({ message: 'Finished' });
  });

  it('Atualiza uma partida com sucesso', async function() {
    sinon.stub(SequelizeUser, 'findOne').resolves(loginMock.existingUser as any);
    sinon.stub(bcrypt, 'compareSync').resolves(true);
    sinon.stub(SequelizeMatch, 'findByPk').resolves(match as any);
    sinon.stub(SequelizeMatch, 'update').resolves([1]);

    const responseLogin = await chai.request(app).post('/login').send(loginMock.existingUser);
    const { status, body } = await chai.request(app).patch('/matches/1')
      .set('authorization', `Bearer ${responseLogin.body.token}`);

    expect(status).to.equal(200);
    expect(body).to.be.deep.equal({ message: 'Updated' });
  });

  it('Cria uma nova partida com sucesso', async function() {
    sinon.stub(SequelizeUser, 'findOne').resolves(loginMock.existingUser as any);
    sinon.stub(bcrypt, 'compareSync').resolves(true);
    sinon.stub(SequelizeTeam, 'findByPk')
      .onFirstCall().resolves({ id: 12, teamName: 'firstTeam' } as any)
      .onSecondCall().resolves({ id: 8, teamName: 'secondTeam' } as any);

    sinon.stub(SequelizeMatch, 'create').resolves(newMatch as any);

    const responseLogin = await chai.request(app).post('/login').send(loginMock.validLoginBody);
    const { status, body } = await chai.request(app).post('/matches')
      .set('authorization', `Bearer ${responseLogin.body.token}`)
      .send(sendMatch);

    expect(status).to.equal(201);
    expect(body).to.be.deep.equal(newMatch);
  });

  it('Retorna um erro ao criar uma partida com dois times iguais', async function() {
    sinon.stub(SequelizeUser, 'findOne').resolves(loginMock.existingUser as any);
    sinon.stub(bcrypt, 'compareSync').resolves(true);

    const responseLogin = await chai.request(app).post('/login').send(loginMock.validLoginBody);
    const { status, body } = await chai.request(app).post('/matches')
      .set('authorization', `Bearer ${responseLogin.body.token}`)
      .send(sendEqualTeamsMatch);

    expect(status).to.equal(422);
    expect(body).to.be.deep.equal({ message: 'It is not possible to create a match with two equal teams' });
  });

  it('Retorna um erro ao criar uma partida com um time que não existe', async function() {
    sinon.stub(SequelizeUser, 'findOne').resolves(loginMock.existingUser as any);
    sinon.stub(bcrypt, 'compareSync').resolves(true);

    sinon.stub(SequelizeTeam, 'findByPk')
      .onFirstCall().resolves(null)
      .onSecondCall().resolves({ id: 8, teamName: 'secondTeam' } as any);

    const responseLogin = await chai.request(app).post('/login').send(loginMock.validLoginBody);
    const { status, body } = await chai.request(app).post('/matches')
      .set('authorization', `Bearer ${responseLogin.body.token}`)
      .send(sendMatch);

    expect(status).to.equal(404);
    expect(body).to.be.deep.equal({ message: 'There is no team with such id!' });
  });

  afterEach(sinon.restore);
})