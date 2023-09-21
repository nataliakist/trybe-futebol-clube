import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import SequelizeMatch from '../database/models/SequelizeMatch';
import SequelizeTeam from '../database/models/SequelizeTeam';
import { matches } from './mocks/Match.mock';
import { teams } from './mocks/Team.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testando as rotas /leaderboard', () => {
  it('Retorna as performances dos times em casa com sucesso, em ordem decrescente', async function () {
		sinon.stub(SequelizeTeam, 'findAll').resolves(teams as any)
		sinon.stub(SequelizeMatch, 'findAll').resolves(matches as any)

		const { status, body } = await chai.request(app).get('/leaderboard/home');

		expect(status).to.equal(200);
  });

  it('Retorna as performances dos times fora de casacom sucesso, em ordem decrescente', async function () {
		sinon.stub(SequelizeTeam, 'findAll').resolves(teams as any)
		sinon.stub(SequelizeMatch, 'findAll').resolves(matches as any)

		const { status, body }  = await chai.request(app).get('/leaderboard/away');

		expect(status).to.equal(200);
	});

  afterEach(sinon.restore);
});