const { after, afterEach, before, describe, it } = require('mocha')
const chai = require('chai')
const { createSandbox } = require('sinon')
const sinonChai = require('sinon-chai')
const models = require('../../models')
const {getAllVillains,
    getVillainBySlug,
    saveNewVillain, } = require('../../controllers/villains')
    const {mockVillainsList,
        mockVillain,
        addVillain,
        addedVillainResp} = require('./mocks/villains')

    chai.use(sinonChai)
    const { expect } = chai

    describe('Controllers - Villains', (req, resp) => {
        
            let sandbox 
            let response
            let stubbedSend
            let stubbedSendStatus
            let stubbedFindAll

            before(() => {
                sandbox = createSandbox()

                stubbedSend = sandbox.stub()
                stubbedSendStatus = sandbox.stub()
                stubbedFindAll = sandbox.stub(models.villains, 'findAll')

                response = {
                    send: stubbedSend,
                    sendStatus: stubbedSendStatus

                }
            })

            afterEach(() => {
                sandbox.reset()
            })

            after(() =>{
                sandbox.restore()
            })

        describe('getAllVillains', () => { 
            it('list all villains and send JSON', async() => {
                stubbedFindAll.return()

                await getAllVillains({}, response)
            })   
        })
        describe('getVillainBySlug', () => {
        })
        describe('saveNewVillain  ', () => {
        })
    })