import TransactionReceipt from './transaction';
import BlockChain from '../blockchain/block_chain';
import TransactionPool from './transactionPool';
import Chain_Utils from '../chainUtils';

export default class Wallet{
    key: any
    balance :  any
    constructor(){
        const key = Chain_Utils.keyPairGenerator()
        this.key = key
        this.balance=50
    }

    sendTransaction(recipient: Wallet, amountToTransfer: number, blockchain:BlockChain){
        if(blockchain){
            this.balance = Wallet.checkBalance(blockchain)
        }

        // if(this.balance>amountToTransfer){
            let signature  = this.signTransaction(recipient,amountToTransfer)
            let newTransaction = TransactionReceipt.createNewTransactionReceipt(this,recipient,amountToTransfer,signature)
            return TransactionPool.add(newTransaction, this,recipient,amountToTransfer,signature)
        // }
    }

    static checkBalance(_blockchain:BlockChain){
        // let total=0;
        // total+ = _blockchain.filter(word => word.length > 6)
    }

    signTransaction(recipient: Wallet,amount: number){
        let data = Chain_Utils.encodeSHA256(this.key, recipient, amount)
        let signature = this.key.sign(data)
        return signature
    }




}