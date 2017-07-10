/**
 * Created by Henry on 2017/3/16.
 */
'use strict';
var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;

var BlockSchema = new Schema({
    _id: { //hash 64B
        type: String,
        unique: true
    },
    hash: String,
    version: { type: Number, default: 1 },
    height: { type: Number, unique: true},
    preHash: String,
    merkleHash: String,
    time: Number,
    periodStartTime: Number,
    timePeriod: Number,
    consensusAddress: String,
    scriptSig: String,
    txCount: Number,
    txs: [{ type: String , ref: 'Transaction' }], //transaction hash 数组
    cost: Number
});

BlockSchema.statics = {

    // get : function(res, targetId){
    //     if(shortid.isValid(targetId)){
    //         Blog.findOne({_id : targetId})
    //             .populate('author','name logo comments date')
    //             .exec(function(err,result){
    //                 if(err){
    //                     res.end(err);
    //                 }else if(result) {
    //                     result.clickNum = result.clickNum + 1;
    //                     result.save();
    //                     res.json(result);
    //                 }else{
    //                     res.json({});
    //                 }
    //             })
    //     }else{
    //         res.end('非法参数！');
    //     }
    // },
    // put : function(req,res,targetId){
    //     if( shortid.isValid(targetId) ){
    //         Blog.findOne({'_id' : targetId},function(err,doc){
    //             if(err){
    //                 res.end(err);
    //             }
    //             if ( doc ) { //update
    //                 req.body.updateDate = new Date();
    //                 var update = {$set : req.body};
    //                 doc.update(update, function (err) {
    //                     if(err){
    //                         res.end(err);
    //                     }else{
    //                         res.end("success");
    //                     }
    //                 })
    //             } else {
    //                 res.end('非法参数！');
    //             }
    //         })
    //     }else{
    //         res.end('非法参数！');
    //     }
    // },
    // post : function(req,res){
    //     if (req.body.author && req.body.title && req.body.discription) {
    //         req.body._id = shortid.generate();
    //         if ( !req.body.stitle ) {
    //             req.body.stitle = req.body.discription.length>160 ? req.body.discription.substr(0,160) : req.body.discription;
    //         }
    //         var newObj = new Blog(req.body);
    //         newObj.save(function (err,doc) {
    //             if (err) {
    //                 res.end(err);
    //             } else {
    //                 User.findOne({_id: req.body.author},function(err,result){
    //                     if (result) {
    //                         result.blogNum = result.blogNum + 1;
    //                         result.save();
    //                     }
    //                 });
    //                 res.end(doc._id);
    //             }
    //         });
    //     }else{
    //         res.end('非法参数！');
    //     }
    // }

};

var Block = mongoose.model("Block",BlockSchema);
module.exports = Block;
