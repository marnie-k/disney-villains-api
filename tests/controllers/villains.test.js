/* eslint-disable max-len */

const {
  after, afterEach, before, beforeEach, describe, it
} = require('mocha')
const chai = require('chai')
const { createSandbox } = require('sinon')
const sinonChai = require('sinon-chai')
const models = require('../../models')
const { getAllVillains, getVillainBySlug, saveNewVillain } = require('../../controllers/villains')
const { villainsList, mockVillain, addVillain, addedVillainResp } = require('../mocks/villains')

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
      expect(stubbedStatusDotSend).to.have.been.calledWith('Unable to retreive villain. Please try again.')
    })
  })

  describe('getAllVillainsBySlug', () => {
    it('retrieve single villian associated with provided slug from db and calls the response.send', async () => {
      stubbedFindOne.returns(mockVillain)
      const request = { params: { slug: 'captain-hook' } }

      await getVillainBySlug(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({ where: { slug: 'captain-hook' } })
      expect(stubbedSend).to.have.been.calledWith(mockVillain)
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
      expect(stubbedStatusDotSend).to.have.been.calledWith('Unable to retreive villain. Please try again.')
    })
  })

  describe('saveNewVillain', () => {
    // eslint-disable-next-line max-len
    it('creates an new villain db record from the data entered and resposneds with a 200 status and the new villain', async () => {
      stubbedCreate.returns(addedVillainResp)
      const request = { body: { name: 'Red Skull', movie: 'Captain America: The First Avenger', slug: 'red-skull' } }

      await saveNewVillain(request, response) //  villains.js:35:53 tests/controllers/villains.test.js:117:13

      // eslint-disable-next-line max-len
      expect(stubbedCreate).to.have.been.calledWith({ name: 'Red Skull', movie: 'Captain America: The First Avenger', slug: 'red-skull' }) // :119:42 -   AssertionError: expected create to have been called with arguments undefined
      expect(stubbedStatus).to.have.been.calledWith(201)
      expect(stubbedStatusDotSend).to.have.been.calledWith(addedVillainResp)
    })

    it('respond with 400 status and error message when there is a missing field', async () => {
      const request = { body: { addVillain } } // 125:48) - TypeError: Cannot read properties of undefined (reading 'name')

      await saveNewVillain(request, response)

      expect(stubbedCreate).to.have.callCount(0)
      expect(stubbedStatus).to.have.been.calledWith(400)
      expect(stubbedStatusDotSend).to.have.been.calledWith('The following paraneters are required: name, movie, slug')
    })

    it('responsed with a 500 status and error message wehn db call throws an error', async () => {
      stubbedCreate.throws('error')
      const request = { body: { name: 'Red Skull', movie: 'Captain America: The First Avenger', slug: 'red-skull' } }

      await saveNewVillain(request, response)

      expect(stubbedCreate).to.have.been.calledWith({ name: 'Red Skull', movie: 'Captain America: The First Avenger', slug: 'red-skull' }) // 140:42 AssertionError: expected create to have been called with arguments undefined
      expect(stubbedStatus).to.have.been.calledWith(500)
      expect(stubbedStatusDotSend).to.have.been.calledWith('Unable to create villain. Please try again.')
    })
  })
})

