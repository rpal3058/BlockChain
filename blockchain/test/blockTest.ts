import Block from '../block'
import chai from 'chai' 
const expect = chai.expect
import 'mocha'
import { SHA256 } from 'crypto-js'

describe("Mined block validator", () => {
    let firstBlock:any
    let addedBlock:any
    beforeEach(()=>{
        firstBlock = Block.genesisBlock()
        addedBlock = Block.mineBlock(firstBlock,'Test')
    })

    //We can only test for 2 things here the last hash and data accuracy. 
    //The rest i.e tmestamp and current Hash cannot be regenerated to compare since each time it will show a different value
    it("should check if the added block has the right last hash",()=>{
        expect(addedBlock.lastHash).to.be.equal('f1r57-h45h')
    })

    it("should check if data provided matches the input",()=>{
        expect(addedBlock.data).to.be.equal('Test')
    })
}) 