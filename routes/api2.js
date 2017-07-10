'use strict';

var express = require('express');
var router = express.Router();
var DbOpt = require('../models/Dbopt');

var Address = require('../models/Address');
var Transaction = require('../models/Transaction');
var Block = require('../models/Block');

function getTargetObj(defaultUrl) {
  var targetObj;
  if(defaultUrl === 'address' ){
    targetObj = Address;
  }else if(defaultUrl === 'transaction' ){
    targetObj = Transaction;
  }else if(defaultUrl === 'block' ){
    targetObj = Block;
  }
  return targetObj;
}

router.get('/:defaultUrl',function(req,res) {
  var defaultUrl = req.params.defaultUrl;
  var targetObj = getTargetObj(defaultUrl);
  if( targetObj === Block ){
    //DbOpt.findAll(targetObj,req,res,"request "+defaultUrl+" List");
    var requireField = 'height time txCount cost consensusAddress version';// = 'title date';
    var params={};

    var docList = DbOpt.getPaginationResult(targetObj, req, res, params, requireField);
    res.json(docList);
  }else if( targetObj === Transaction ) {
    var requireField = 'type height time fee version';
    //var params={ type: { $ne:1} };
    var params={ type: { $in:[2,5,6]} };
    var docList = DbOpt.getPaginationResult(targetObj, req, res, params, requireField);
    res.json(docList);
  }else if( targetObj === Address ) {
    var requireField = 'balance credit txCount time firsttime total';
    var params={};
    var docList = DbOpt.getPaginationResult(targetObj, req, res, params, requireField);
    res.json(docList);
  }else{
    res.end({success:false,error:settings.system_illegal_param});
  }
});

router.get('/:defaultUrl/:uid',function(req,res){
  var obj = getTargetObj(req.params.defaultUrl);
  var targetId = req.params.uid;

  if(obj === Block ){
    var params = {_id : targetId};
    if ( targetId.length<64 ) {
      var height = parseInt(id);
      if (isNaN(height)) {
        return res.next('height error');
      }
      params = { height: height }
    }
    Block.findOne(params)
        .populate('txs')
        .exec(function (err,result) {
      if(err){
        res.next(err);
      }else{
        return res.json(result);
      }
    })
  }else if (obj) {
    obj.findOne({_id : targetId}, function (err,result) {
      if(err){
        res.next(err);
      }else{
        return res.json(result);
      }
    })
  }else{
      res.end({success:false,error:settings.system_illegal_param})
  };
});

module.exports = router;
