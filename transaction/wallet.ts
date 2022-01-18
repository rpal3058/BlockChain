import TransactionReceipt from './transaction';
import TransactionPool from './transactionPool';
import Chain_Utils from '../chainUtils';
import BlockChain from '../blockchain/block_chain';

export default class Wallet{
    key: any
    balance :  any
    publicKey : any
    pool: TransactionPool
    bc:BlockChain
    constructor(_pool:TransactionPool, _bc:BlockChain){
        this.key = Chain_Utils.keyPairGenerator()
        this.publicKey = this.key.getPublic().encode('hex')
        this.balance=50
        this.pool = _pool
        this.bc = _bc
    }

    toString(){
        return (
        `Wallet Detail : 
         Address = ${this.publicKey.toString()},
         Balance = ${this.balance}`
        )
    }
    
    sendTransaction(recipientAddress: any, amountToTransfer: number,awardAmount: number){        
        if(this.balance > amountToTransfer){
            let signature  = this.signTransaction(recipientAddress,amountToTransfer)
            let transaction = TransactionReceipt.createNewTransactionReceipt(this,recipientAddress,amountToTransfer,awardAmount,signature)
            let verificiation = this.pool.verify(this,recipientAddress,amountToTransfer,signature)
            if(verificiation){
                this.pool.addToPool(transaction)               
            }else{
                console.log("Error: transaction could not be added to the pool")
            }
        }else{
        console.log("Error: transaction could not be added to the pool")
        }   
    }

    static updateBalance(walletToBeUpdated: any, _pool:any){
        console.log(walletToBeUpdated.balance)
        _pool.forEach((_pool:any) =>{
            _pool.output.map((tx:any) => {
                if(tx.wallet=="sender" && walletToBeUpdated.publicKey==tx.address){
                    console.log(walletToBeUpdated.balance)
                    walletToBeUpdated.balance -= tx.amount
                } else if(tx.wallet=="receiver" && walletToBeUpdated.publicKey==tx.address){
                    walletToBeUpdated.balance += tx.amount
                }                
            })
        })
        return walletToBeUpdated.balance
    }   

    signTransaction(recipient: any,amount: number){
        let data = Chain_Utils.encodeSHA256(this, recipient, amount)
        let signature = this.key.sign(data)
        return signature
    }
    
}

