import { expect } from 'chai'
import Chain_Utils from '../chainUtils'
import Wallet from '../transaction/wallet'
import TransactionPool from '../transaction/transactionPool'
import TransactionReceipt from '../transaction/transaction'
import BlockChain from '../blockchain/block_chain'

describe("Testing wallets", () => {
    let sender: Wallet
    let recipient: Wallet
    let recipient2: Wallet
    let amountToTransfer: number
    let chain: BlockChain

    beforeEach(()=>{
        sender = new Wallet()
        recipient = new Wallet()
        recipient = new Wallet()
        chain = new BlockChain
        amountToTransfer = 100
    })

    // it("should check if the balance being calculated is correct or not ",()=>{

    // })

    it("should check if valid signature is getting generated",()=>{
        let signature = sender.signTransaction(recipient,amountToTransfer)
        let msg = Chain_Utils.encodeSHA256(sender,recipient,amountToTransfer)
        let verification = sender.key.verify(msg,signature)
        expect(verification).to.be.equal(true)
    })

    it("should check if the transaction is getting added to the transactions pool",()=>{
        let transactionPoolLength = sender.sendTransaction(recipient,amountToTransfer,chain)
        expect(transactionPoolLength).to.be.equal(1)
    })



})