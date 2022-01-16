import SHA256 from 'crypto-js/sha256';
import Block from './block'

export default class BlockChain{
    chain:Array<Block>
   
    //pushing the genesis block to the chain everytime a new instance of the chain is created
    constructor (){
        this.chain = [Block.genesisBlock()]
    }

    addBlock(_data:any){
        let lastBlock = this.chain[this.chain.length-1]
        let newBlock =  Block.mineBlock(lastBlock,_data)
        this.chain.push(newBlock)
        return newBlock
    }

    validateChain(_chain:any){ //the input condition is being added here because it helps in P2P server file where the function doesnt get triggered because of difference of format between "this" ad=nd the input i.e "Chain"
        //validating the genesis block of the new chain is a valid geneis block
        if(_chain[0].hash!==Block.genesisBlock().hash) return false
    
        let i = _chain.length-1  
        //Validating the last hash stored in the new chain is actually equal to the hash of the block before that      
        if(i>=1 && (_chain[i].lastHash!==_chain[i-1].hash)) return false        
        
        //Validating the hash of new block matches with our own generated hash. This is make sure that new block has not been tampereed with
        if(i>=1 && (_chain[i].hash!==Block.hashGeneratorFromBlock(_chain[i]))) {
            return false 
        }
        return true    
    }

    replaceChain(_chain:any){
        //checking if the chain is of length greater than the current chain
        if(this.chain.length>=_chain.length){
            console.log("The length of the new chain is smaller or equal to the available chain")
            return false
        }

        //checking if the chain is valid and of length greater than the current chain
        if(this.validateChain(_chain)==false){
            console.log("The chain is not valid")
            return false
        }

        console.log("replacing the chain with the new one")
        this.chain = _chain
        return this.chain    
    }

}

