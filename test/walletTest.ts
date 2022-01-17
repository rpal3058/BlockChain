import { expect } from 'chai'
import Chain_Utils from '../chainUtils'
import Wallet from '../transaction/wallet'
import BlockChain from '../blockchain/block_chain'
import TransactionPool from '../transaction/transactionPool'

describe("Testing wallets", () => {
    let sender: Wallet
    let recipient: Wallet
    let amountToTransfer_1: number
    let amountToTransfer_2: number
    let chain: BlockChain
    let pool: TransactionPool
    
    beforeEach(()=>{
        chain = new BlockChain()
        pool = new TransactionPool()
        sender = new Wallet(pool,chain)
        recipient = new Wallet(pool,chain)
        amountToTransfer_1 = 100
        amountToTransfer_2=50
        chain.addBlock('Test1')
    })

    it("should check if valid signature is getting generated",()=>{
        let signature = sender.signTransaction(recipient,amountToTransfer_1)
        let msg = Chain_Utils.encodeSHA256(sender,recipient,amountToTransfer_1)
        let verification = sender.key.verify(msg,signature)
        expect(verification).to.be.equal(true)
    })

    it("should check if the transaction is getting added to the transactions pool",()=>{
        sender.sendTransaction(recipient.publicKey,amountToTransfer_1)
        sender.sendTransaction(recipient.publicKey,amountToTransfer_2)
        expect(sender.pool?.transactionPool.length).to.be.equal(2)
    })
})