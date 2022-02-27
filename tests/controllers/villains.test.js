
const {
    after, afterEach, before, beforeEach, describe, it
  } = require('mocha')
  const chai = require('chai')
  const { createSandbox } = require('sinon')
  const sinonChai = require('sinon-chai')
  const models = require('../../models')
  const { getAllVillains, getVillainBySlug, newVillain } = require('../../controllers/villains')
  const { villainsList, singleVillain, mockSave, mockResponse } = require('../mocks/villains')
  
  chai.use(sinonChai)
  const { expect } = chai
  
  describe('Controllers - Villains', () => {
    let response
    let sandbox
    let stubbedCreate
    let stubbedFindAll
    let stubbedFindOne
    let stubbedSend
    let stubbedSendStatus
    let stubbedStatus
    let stubbedStatusDotSend
  
    before(() => {
      sandbox = createSandbox()
  
      stubbedCreate = sandbox.stub(models.villains, 'create')
      stubbedFindAll = sandbox.stub(models.villains, 'findAll')
      stubbedFindOne = sandbox.stub(models.villains, 'findOne')
  
  
      stubbedSend = sandbox.stub()
      stubbedSendStatus = sandbox.stub()
      stubbedStatus = sandbox.stub()
      stubbedStatusDotSend = sandbox.stub()
  
      response = {
        send: stubbedSend,
        sendStatus: stubbedSendStatus,
        status: stubbedStatus,
      }
    })
  
    beforeEach(() => {
      stubbedStatus.returns({ send: stubbedStatusDotSend })
    })
  
    afterEach(() => {
      sandbox.reset()
    })
  
    after(() => {
      sandbox.restore()
    })
  
    describe('getAllVillains', () => {
      it('retrieve a list of villians from the db and call response.send with that list', async () => {
        stubbedFindAll.returns(villainsList)
  
        await getAllVillains({}, response)
  
        expect(stubbedFindAll).to.have.callCount(1)
        expect(stubbedSend).to.have.been.calledWith(villainsList)
      })
  
      it('responds with a 500 status and error message weh ndb call throws an error', async () => {
        stubbedFindAll.throws('error')
  
        await getAllVillains({}, response)
  
        expect(stubbedFindAll).to.have.callCount(1)
        expect(stubbedStatus).to.have.been.calledWith(500)
        expect(stubbedStatusDotSend).to.have.been.calledWith('cannot retrieve villains, try again.')
      })
    })
  
    describe('getAllVillainsBySlug', () => {
      it('retrieve single villian associated with provided slug from db and calls the response.send', async () => {
        stubbedFindOne.returns(singleVillain)
        const request = { params: { slug: 'captain-hook' } }
  
        await getVillainBySlug(request, response)
  
        expect(stubbedFindOne).to.have.been.calledWith({ where: { slug: 'captain-hook' } })
        expect(stubbedSend).to.have.been.calledWith(singleVillain)
      })
      it('response with a 404 status when no matching villain is found', async () => {
        stubbedFindOne.returns(null)
        const request = { params: { slug: 'not-found' } }
  
        await getVillainBySlug(request, response)
  
        expect(stubbedFindOne).to.have.been.calledWith({ where: { slug: 'not-found' } })
        expect(stubbedSendStatus).to.have.been.calledWith(404)
      })
  
      it('responsds with a 500 status and error message when db call throws and error', async () => {
        stubbedFindOne.throws('Error!')
        const request = { params: { slug: 'error' } }
  
        await getVillainBySlug(request, response)
  
        expect(stubbedFindOne).to.have.been.calledWith({ where: { slug: 'error' } })
        expect(stubbedStatus).to.have.been.calledWith(500)
        expect(stubbedStatusDotSend).to.have.been.calledWith('cannot retrieve villain')
      })
    })
  
    describe('saveNewVillain', () => {
      // eslint-disable-next-line max-len
      it('creates an new villain db record from the data entered and resposneds with a 200 status and the new villain', async () => {
        stubbedCreate.returns(mockResponse)
        const request = { body: mockSave }
  
        await newVillain(request, response)
  
        expect(stubbedCreate).to.have.been.calledWith(mockSave)
        expect(stubbedStatus).to.have.been.calledWith(201)
        expect(stubbedStatusDotSend).to.have.been.calledWith(mockResponse)
      })
  
      it('respond with 400 status and error message when there is a missing field', async () => {
        const request = { body: { name: mockSave.name, slug: mockSave.slug } }
  
        await newVillain(request, response)
  
        expect(stubbedCreate).to.have.callCount(0)
        expect(stubbedStatus).to.have.been.calledWith(400)
        expect(stubbedStatusDotSend).to.have.been.calledWith('Missing field: name, movie, or slug')
      })
  
      it('responsed with a 500 status and error message wehn db call throws an error', async () => {
        stubbedCreate.throws('error')
        const request = { body: mockSave }
  
        await newVillain(request, response)
  
        expect(stubbedCreate).to.have.been.calledWith(mockSave)
        expect(stubbedStatus).to.have.been.calledWith(500)
        expect(stubbedStatusDotSend).to.have.been.calledWith('cannot save new villain')
      })
    })
  })
  