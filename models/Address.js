/**
 * Created by Henry on 2017/3/16.
 */
'use strict';
var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;

var UtxoSchema = new Schema({
    txid: String,
    index: Number,
    value: Number}
    ,{_id: false});
//mongoose.model('Utxo',UtxoSchema);

var AddressSchema = new Schema({
    _id: { //address
        type: String,
        unique: true
    },
    address: String,
    total: { type: Number, default: 0 },
    balance: { type: Number, default: 0 },
    credit: { type: Number, default: 0 },
    txCount: { type: Number, default: 0 },
    txs: [{ type: String, ref: 'Transaction'}], //set 若不在内则增添加并更新lasttime
    utxo: [UtxoSchema],  //input 匹配utxo后要删除，output 添加入utxo
    time: Number,  //最近交易时间
    firsttime: Number, //最早交易时间 new时更新
    qrcode: String
});

AddressSchema.statics = {
};

var Address = mongoose.model("Address",AddressSchema);
module.exports = Address;
