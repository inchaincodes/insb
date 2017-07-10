'use strict';

var express = require('express');
var router = express.Router();
var rpc = require('../util/insclient').rpc_client;

var bestblockheight = 0;
var sunixtime = 0;
function getbestblockheight(res) {
  var unixtime = Math.round(new Date().getTime() / 1000);
  if (unixtime - sunixtime >= 10) { //getfrom rpc server
    rpc('getbestblockheight',[],function(err,data){
      if (err) {
        res.end({success:false,error:err});
      }else{
        bestblockheight = data.bestblockheight;
        //console.log(bestblockheight);
        sunixtime = unixtime;
        res.json(data);
      }
    })
  }else{
    res.json({success:true,bestblockheight:bestblockheight});
  }
}

router.get('/version', function(req, res, next) {
  rpc('getversion',[],function(err,data){
    if (err) {
      res.end({success:false,error:err});
    }else{
      res.json(data);
    }
  })
});

router.get('/bestblockheight', function(req, res, next) {
  // rpc('getbestblockheight',[],function(err,data){
  //   if (err) {
  //     res.end({success:false,error:err});
  //   }else{
  //     res.json(data);
  //   }
  // })
  getbestblockheight(res);
});

router.get('/status', function(req, res, next) {
  rpc('getconsensusstatus',[],function(err,data){
    if (err) {
      res.end({success:false,error:err});
    }else{
      res.json(data);
    }
  })
});

router.get('/reg', function(req, res, next) {
  rpc('regconsensus',[],function(err,data){
    if (err) {
      res.end({success:false,error:err});
    }else{
      res.json(data);
    }
  })
});

router.get('/rem', function(req, res, next) {
  rpc('remconsensus',[],function(err,data){
    if (err) {
      res.end({success:false,error:err});
    }else{
      res.json(data);
    }
  })
});

router.get('/bestblockhash', function(req, res, next) {
  rpc('getbestblockhash',[],function(err,data){
    if (err) {
      res.end({success:false,error:err});
    }else{
      res.json(data);
    }
  })
});

router.get('/blockcount', function(req, res, next) {
  rpc('getblockcount',[],function(err,data){
    if (err) {
      res.end({success:false,error:err});
    }else{
      res.json(data);
    }
  })
});

router.get('/accounts', function(req, res, next) {
  rpc('getaccounts',[],function(err,data){
    if (err) {
      res.end({success:false,error:err});
    }else{
      res.json(data);
    }
  })
});

router.get('/transaction', function(req, res, next) {
  rpc('gettransaction',[],function(err,data){
    if (err) {
      res.end({success:false,error:err});
    }else{
      res.json(data);
    }
  })
});

router.get('/accountinfo', function(req, res, next) {
  var params = [];
  if ( req.query.address ) params.push(req.query.address);

  rpc('getaccountinfo',params,function(err,data){
    if (err) {
      res.end({success:false,error:err});
    }else{
      res.json(data);
    }
  })
});

router.get('/block/:id', function(req, res, next) {
  rpc('getblock',[req.params.id],function(err,data){
    if (err) {
      res.end({success:false,error:err});
    }else{
      res.json(data);
    }
  })
});

router.get('/blockhash/:id', function(req, res, next) {
  rpc('getblockhash',[req.params.id],function(err,data){
    if (err) {
      res.end({success:false,error:err});
    }else{
      res.json(data);
    }
  })
});

router.get('/tx/:id', function(req, res, next) {
  rpc('gettx',[req.params.id],function(err,data){
    if (err) {
      res.end({success:false,error:err});
    }else{
      res.json(data);
    }
  })
});

router.get('/send/:id', function(req, res, next) {
  var num = req.query.num;
  if (!num) {
    return res.end({success:false,error:'param err'})
  }
  rpc('getblock',[req.params.id,num],function(err,data){
    if (err) {
      res.end({success:false,error:err});
    }else{
      res.json(data);
    }
  })
});

module.exports = router;
