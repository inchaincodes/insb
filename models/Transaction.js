/**
 * Created by Henry on 2017/3/16.
 */
'use strict';
var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;

var TransactionSchema = new Schema({
    _id: { //hash 64B
        type: String,
        unique: true
    },
    hash: String,
    version: { type: Number, default: 1 },
    type: Number,
    time: Number,
    locakTime: Number,
    height: Number,
    confirmation: Number,
    fee: Number,
    txType: String,
    address: String,
    scriptSig: String,
    credit: Number,
    reason: String,
    infos : [],  //type==11
    inputs: [
        {
            fromTx: String,
            fromIndex: Number,
            address: String,
            value: Number
        }
    ],
    outputs: [
        {
            value: Number,
            lockTime: Number,
            address: String,
            scriptSig: String
        }
    ]
});

TransactionSchema.statics = {
};

var Transaction = mongoose.model("Transaction",TransactionSchema);
module.exports = Transaction;
