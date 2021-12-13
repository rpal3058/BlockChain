import SHA256 from 'crypto-js/sha256';
import {DIFFICULTY,TIMER}  from '../config'

export default class Block {
    timeStamp: any;
    lastHash: any;
    hash: any;
    data: any;
    nonce: any;
    difficulty:any

    constructor(_timeStamp:any, _lastHash:any, _hash:any, _data:any,_nonce:any, _difficulty:any){
        this.timeStamp=_timeStamp;
        this.lastHash=_lastHash;
        this.hash=_hash;
        this.data=_data;
        this.nonce=_nonce
        this.difficulty = _difficulty || DIFFICULTY
    }

    toString(){
        return (
        `Block Detail : 
         timeStamp = ${this.timeStamp},
         lastHash  = ${this.lastHash.substring(0,10)},
         currentHash  = ${this.hash.substring(0,10)},
         data  = ${this.data},
         nonce = ${this.nonce},
         diffculty = ${this.difficulty}`
        )
    }

    static genesisBlock(){
        return new Block('Genesis Time','---','f1r57-h45h',[],0, DIFFICULTY)
    }

    static mineBlock(_lastBlock:Block, _data:any){
        let _timeStamp = Date.now()
        let _lastHash = _lastBlock.hash
        let _lastTimeStamp = _lastBlock.timeStamp
        let _hash
        let _nonce=0
        let _difficulty
        do{
            _nonce++
            _difficulty=this.adjustDifficulty(_lastBlock,_timeStamp) 
            _hash = this.hashFunction(_timeStamp,_lastHash,_data,_nonce,_difficulty)
        }while(_hash.substring(0,_difficulty)!=("0").repeat(_difficulty))
        return new Block(_timeStamp, _lastHash, _hash,_data,_nonce,_difficulty)
    }

    static adjustDifficulty(_lastBlock:Block,_timeStamp:number){
        let _difficulty = _lastBlock.difficulty
        _timeStamp-_lastBlock.timeStamp>TIMER ?  _difficulty-- : _difficulty++
        return _difficulty
    }
    
    static hashFunction(_timeStamp:any, _lastHash: any, _data: any,_nonce:any,_difficulty:any){
        let _hash
        _hash = SHA256(`${_timeStamp}${_lastHash}${_data}${_nonce}`).toString()//return the object and to get in the strng format we use JS toString function
        return _hash
    }
    
    static hashGeneratorFromBlock(_block:Block ){
        const {timeStamp, lastHash, data,nonce,difficulty} = _block
        let _hashGenerated = this.hashFunction(timeStamp, lastHash, data,nonce,difficulty)
        return _hashGenerated
    }
}