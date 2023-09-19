import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import SequelizeTeam from '../database/models/SequelizeTeam';
import { team, teams } from './mocks/Team.mock';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testando as rotas /teams', () => {
  it('Lista todos os times corretamente', async function() {
    sinon.stub(SequelizeTeam, 'findAll').resolves(teams as any)

    const { status, body } = await chai.request(app).get('/teams');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(teams);
  });

  it('Lista um livro de acordo com seu id', async function() {
    sinon.stub(SequelizeTeam, 'findByPk').resolves(team as any);

    const { status, body } = await chai.request(app).get('/teams/1');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(team);
  });

  it('Retorna not found caso o livro não exista', async function() {
    sinon.stub(SequelizeTeam, 'findByPk').resolves(null);

    const { status, body } = await chai.request(app).get('/teams/1');

    expect(status).to.equal(404);
    expect(body.message).to.equal('Team not found');
  });

  afterEach(sinon.restore);
});
