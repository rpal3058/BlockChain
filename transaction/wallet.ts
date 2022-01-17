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
    
    sendTransaction(recipientAddress: any, amountToTransfer: number){
        if(this.balance > amountToTransfer){
            let signature  = this.signTransaction(recipientAddress,amountToTransfer)
            let transaction = TransactionReceipt.createNewTransactionReceipt(this,recipientAddress,amountToTransfer,signature)
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
        _pool.forEach((_pool:any) =>{
            _pool.output.map((tx:any) => {
                if(tx.wallet=="sender" && walletToBeUpdated.publicKey==tx.address){
                    walletToBeUpdated.balance = tx.amount
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


/*****************
 DUMP (Delete later):

    // checkBalanceInPool(){
    //     //calculating the balance when sending funds
    //     let transactionArray: any
    //     transactionArray = []
    //     for(let transactions of this.pool.transactionPool){
    //         transactionArray = transactions.output.filter((e:any) => (e.address===this.publicKey && e.wallet==="sender"))
    //     }
    //     let balanceAfterExpense = transactionArray[transactionArray.length-1]?.amount

    //     //calculating the balance when receving funds funds
    //     transactionArray.length=0
    //     for(let transactions of this.pool.transactionPool){
    //         transactionArray = transactions.output.filter((e:any) => (e.address===this.publicKey && e.wallet==="receiver"))
    //     }

    //     let income=0
    //     for(let i=0; i<transactionArray.length;i++){
    //         income = transactionArray[i].amount+income
    //     }

    //     return (Number(balanceAfterExpense)+Number(income))
    // }


      static updateBalance(walletToBeUpdated: any){
        //calculating the balance when sending funds
        let transactionArray: any
        transactionArray = []
        .bc.chain.forEach((blocks:any) => {
            for(let transactions of blocks.data){
                transactionArray = transactions.output.filter((e:any) => (e.address===this.publicKey && e.wallet==="sender"))
            }             
        });
        
        let balanceAfterExpense = transactionArray[transactionArray.length-1]?.amount
    
        //calculating the balance when receving funds funds
        transactionArray.length=0
        this.bc.chain.forEach((blocks:any) => {
            for(let transactions of blocks.data){
                transactionArray = transactions.output.filter((e:any) => (e.address===this.publicKey && e.wallet==="receiver"))
            }             
        });
    
        let income=0
        for(let i=0; i<transactionArray.length;i++){
            income = transactionArray[i].amount+income
        }

        this.balance = balanceAfterExpense + income
    }   


*******************/
