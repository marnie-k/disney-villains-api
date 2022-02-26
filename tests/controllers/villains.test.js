const chai = require('chai')
const { after, afterEach, before, beforeEach, describe, it } = require('mocha')
const { createSandbox } = require('sinon')
const sinonChai = require('sinon-chai')
const models = require('../../models')
const {getAllVillains,
    getVillainBySlug,
    saveNewVillain, } = require('../../controllers/villains')
    const {mockVillainsList,
        mockVillain,
        addVillain,
        addedVillainResp} = require('../mocks/villains') //error here?

    chai.use(sinonChai)
    const { expect } = chai

    describe('Controllers - Villains', (req, resp) => {
            let response
            let sandbox 
            let stubbedFindAll
            let stubbedFindOne
            let stubbedSend
            let stubbedSendStatus
            let stubbedStatus
            let stubbedStatusDotSend


            before(() => {
                sandbox = createSandbox()
                
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

            after(() =>{
                sandbox.restore()
            })

        describe('getAllVillains', () => { 
            it('list all villains and send JSON', async() => {
                stubbedFindAll.returns(mockVillainsList)

                await getAllVillains({}, response)

                expect(stubbedFindAll).to.have.callCount(1)
                expect(stubbedStatus).to.have.been.calledWith(500) // doesn't like .calledWith
                expect(stubbedStatusDotSend).to.have.been.calledWith('Unable to retrieve. Please try again')
            })   

            it('responds with a 500 status and error message when the database throws an error', async() => {
                stubbedFindAll.throws('Error')

                await getAllVillains({}, response)

                expect(stubbedFindAll).to.have.callCount(1)

            })
            
        })
        describe('getVillainBySlug', () => {
            it('Retrieves villain by slug', async() =>{
                stubbedFindOne = (mockVillain)
                const request = { params: { slug: 'captain-hook' } }

                await getVillainBySlug({}, response)

                expect (stubbedFindOne).to.have.been.calledWith( { where: { slug: 'captain-hook' } }) // doesn't like .calledWith
                expect (stubbedSend).to.have.been.calledWith(mockVillain)
            })

            it('Responds with a 404 status when no match is found', async() =>{
                stubbedFindOne.return(null)
                const request = { params: { slug: 'not-found' } }

                await getVillainBySlug({}, response)

                expect (stubbedFindOne).to.have.been.calledWith( { where: { slug: 'not-found' } }) // doesn't like .calledWith
                expect (stubbedSendStatus).to.have.been.calledWith(404)
            })

            it('Responds with a 500 status and an error message when the database throws an error', async() =>{

            })
        })
        describe('saveNewVillain  ', () => {
        })
    })