/**
 * Created by Henry on 2017/5/23.
 */
'use strict';
var Promise = require('bluebird');
var rpc = Promise.promisifyAll(require('./insclient'));
var co = require('co');
var DbOpt = require('../models/Dbopt');

var Address = require('../models/Address');
var Transaction = require('../models/Transaction');
var Block = require('../models/Block');

function* sync_address(tx){
        var addr_array = [];
        var txid = tx.hash;
        for (var i in tx.inputs ) {
            var input = tx.inputs[i];
            try{
                var doc = yield Address.findOne({_id : input.address }).exec();//find_address(input.address);
                if (doc) {
                    var utxo = doc.utxo;
                    for (var j in utxo) {
                        var ux = utxo[j];
                        if (input.fromTx === ux.txid && input.fromIndex === ux.index ) {
                            //console.log(ux);
                            utxo.splice(j, 1);
                            doc.balance = doc.balance - input.value;
                            doc.utxo = utxo;
                            yield doc.save();
                            break;
                        }
                    }
                }else{
                    console.log('input error, cannot find doc of '+input.address)
                }
            }catch(e){
                console.log(e);
            }
            if ( addr_array.indexOf(input.address) == -1 ) addr_array.push(input.address);
        }

        for ( var i=0,len=tx.outputs?tx.outputs.length:0 ; i<len; i++ ) {
            var output = tx.outputs[i];
            try{
                var doc = yield Address.findOne({_id : output.address }).exec();//find_address(output.address);
                if(doc) {
                    doc.balance = doc.balance + output.value;
                    var b = false;
                    var utxo = doc.utxo;
                    for (var j in utxo) {
                        var ux = utxo[j];
                        if ( txid === ux.txid && ux.index === i ) {
                            b = true;  //utxo中已含信息
                            break;
                        }
                    }
                    if (!b) { //不含则插入
                        utxo.push({txid: txid, index: i, value: output.value});
                        doc.utxo = utxo;
                        yield doc.save();
                    }

                }else{ //new
                    //new_address(output, tx.time, i);
                    var addr = {
                        _id : output.address,
                        address: output.address,
                        balance: output.value,
                        txs: [ txid ],
                        utxo: [ { txid: txid, index: i, value: output.value }],
                        time: tx.time,
                        firsttime: tx.time
                    }
                    //save_address(addr);
                    console.log('output created address: '+addr.address);
                    var newObj = new Address(addr);
                    yield newObj.save();
                }
            }catch(e){
                console.log(e);
            }

            if ( addr_array.indexOf(output.address) == -1 ) addr_array.push(output.address);
        }

        //credit
        if ( tx.type === 5 || tx.type === 6 ) {
            var doc = yield Address.findOne({_id : tx.address }).exec();//find_address(address);
            if(doc) {
                doc.credit = doc.credit + tx.credit;
                yield doc.save();
            }else{ //new
                console.log('credit created：'+tx.address);
                var addr = {
                    _id : tx.address,
                    address: tx.address,
                    time: tx.time,
                    firsttime: tx.time
                }
                var newObj = new Address(addr);
                yield newObj.save();
            }
        }
        // 更新本次交易涉及的地址的交易字段和交易时间字段
        for (var i in addr_array) {
            var address = addr_array[i];
            try{
                var doc = yield Address.findOne({_id : address }).exec();//find_address(address);
                if(doc) {
                    var txs = doc.txs;
                    if (txs.indexOf(txid)==-1) {
                        doc.time = tx.time;
                        txs.push(txid);
                        doc.txs = txs;
                        yield doc.save();
                    }
                }else{ //new
                    console.log('更新交易和时间：未找到记录');
                }
            }catch(e){
                console.log(e);
            }

        }
}

// function sync_block(block) {
//     //var block_cost = 0;
//     //处理交易数据,返回交易总费用
//     for(var i in block.txs) {
//         var tx = block.txs[i];
//         save_transaction(tx);
//         sync_address(tx);
//     }
//
//     //处理区块数据
//     save_block(block);
// }
// function test() {
//     co(function*(){
//         var result = yield rpc.getblockAsync(0);
//         for (var i in result.block.txs) {
//             var tx = result.block.txs[i];
//             yield sync_address(tx);
//         }
//         //var results = yield [foo(), bar()];//yield 一个数组对象. //也可以按下面的例子写成 [foo, bar]
//         //debugger;
//         console.log('done');// => [ [ 994, 187, 16212 ], [ 9023, 2090, 1477 ] ]
//     });
// }
// test();
// rpc.getblockAsync(0).then(function(result){
//         //sync_block(result.block);
//         //save_block(result.block);
//         for (var i in result.block.txs) {
//             var tx = result.block.txs[i];
//             sync_address(tx);
//         }
//     })

var db_block_count_base = 0;
rpc.getblockAsync(db_block_count_base+1000).then(function(result){
    //sync_block(result.block);
    console.log(result.block);
})
// for (var i=0;i<10;i++) {
//     rpc.getblockAsync(db_block_count_base+i).then(function(result){
//         //sync_block(result.block);
//         console.log(result.block);
//     })
// }


function co_sync() {
    co(function *() {
        var db_block_count = db_block_count_base;//yield Block.count();
        var result = yield rpc.getblockcountAsync(); //async->sync
        var chain_block_count = result.blockcount;
        //db_block_count_base = chain_block_count;
        console.log(chain_block_count);
        while (db_block_count < chain_block_count ) {
            console.log('getblock:'+db_block_count);
            var result = yield rpc.getblockAsync(db_block_count);//sync_block(db_block_count);
            // console.log(result);
            //sync_block(result.block);
            var block = result.block;
            for(var i in block.txs) {
                var tx = block.txs[i];
                yield sync_address(tx);
                //save_transaction(tx);
				yield Transaction.update({_id: tx.hash},{$set: tx}, {upsert: true});
                // tx._id = tx.hash;
                // var newObj = new Transaction(tx);
                // yield newObj.save();
            }

            //处理区块数据
            //save_block(block);
			var txs = block.txs;
			block.txs = [];
			for (var i in txs) {
				block.txs.push(txs[i].hash);
			}
			yield Block.update({_id: block.hash}, {$set: block}, {upsert: true});
            db_block_count += 1;
            if ( db_block_count > (db_block_count_base+10) ) {
                break;
            }
        }
        db_block_count_base = db_block_count;
        console.log('co_sync done : '+db_block_count_base);
        setTimeout(co_sync,1000);
    });
}

//co_sync();

function sync_info(){
    Block.count().then(function(count){
        console.log('sync_info start at '+count);
        db_block_count_base = count;
        setTimeout(co_sync,10);
    })
    //setTimeout(co_sync,10);
}
//sync_info();
module.exports = sync_info;
