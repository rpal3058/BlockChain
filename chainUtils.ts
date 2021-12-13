import {ec} from 'elliptic'; //importing a class of ec  
const EC = new ec('secp256k1'); //new instance of class of ec
import { SHA256 } from 'crypto-js'
import Wallet from './transaction/wallet';


export default class Chain_Utils{

    static keyPairGenerator(){
        let key = EC.genKeyPair()
        return key
    }

    static encodeSHA256(sender:Wallet,recipient:Wallet, amountToTransfer: any ){
        let data = SHA256(`${sender}${recipient}${amountToTransfer}`).toString()
        return data
    }
    
}
