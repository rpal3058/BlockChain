import BlockChain from '../block_chain'
import Block from '../block'
import chai from 'chai' 
const expect = chai.expect
import 'mocha'
import { SHA256 } from 'crypto-js'

describe("Mined block validator", () => {
    let bc_1:BlockChain
    let bc_2:BlockChain
    beforeEach(()=>{
        //creating a new instance of the BlockChain
        bc_1 = new BlockChain
        bc_2 = new BlockChain
    })

    it("should check if the first block is the genesis block ",()=>{
        let genesisBlock = bc_1.chain[0] //getting the details from the new instance of the blockchain create
        expect(genesisBlock.toString()).to.be.equal(Block.genesisBlock().toString())
    })

    it("should check if the chain length is increasing when we are adding a new bloc",()=>{
        bc_1.addBlock('Test_1')
        let length = bc_1.chain.length //getting the details from the new instance of the blockchain create
        expect(length).to.be.equal(2)
    })

    it("should check if the new block is added to the chain",()=>{
        bc_1.addBlock('Test_1') //updating the new instance of the blockchain create
        let data = bc_1.chain[bc_1.chain.length-1].data
        expect(data).to.be.equal('Test_1')
    })

    it("should check if the chain has a valid genesis block",()=>{
        let success = bc_1.validateChain(bc_2.chain)
        expect(success).to.be.equal(true)
    })

    it("should check if the test fails when the last hash stored in the new block is not equal to the hash of the block before that",()=>{
        bc_2.addBlock('Test_1')
        bc_2.chain[1].lastHash="null"         

        let success = bc_1.validateChain(bc_2.chain)
        expect(success).to.be.equal(false)
    })
    
    it("should check if the test fails when the hash of new block doesnt matches with our own generated hash",()=>{
        bc_2.addBlock('Test_1')    
        bc_2.chain[1].data="Test_2"
    
        let success = bc_1.validateChain(bc_2.chain)
        expect(success).to.be.equal(false)
    })

    it("should check if the chain is getting replaced when a new valid longer chain comes in",()=>{
        bc_2.addBlock('Test_1')    
        let temp:any 
        temp = bc_1.replaceChain(bc_2.chain)
        expect(temp.toString()).to.be.equal(bc_2.chain.toString())
    })

    it("should check if the test fails when a shorter new chain is passed",()=>{
        bc_1.addBlock('Test_1')    
        let temp:any 
        temp = bc_1.replaceChain(bc_2.chain)
        expect(temp).to.be.equal(false)
    })

    it("should check if the test fails when a new chain is not valid",()=>{
        bc_2.addBlock('Test_1')    
        bc_2.chain[1].data="Test_2"
   
        let temp:any 
        temp = bc_1.replaceChain(bc_2.chain)
        expect(temp).to.be.equal(false)
    })
})