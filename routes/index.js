var express = require('express');
var router = express.Router();
var path = require('path');
var qr = require('qr-image');
var DbOpt = require('../models/Dbopt');
var Address = require('../models/Address');
var Transaction = require('../models/Transaction');
var Block = require('../models/Block');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '印链浏览器',layout: 'defaultTemp' });
});

router.get('/search', function(req, res, next) {
  var q = req.query.q;

  if (q.length===34) {
    res.redirect('/address/'+q);
  }else{
    res.redirect('/block/'+q);
  }
});

router.get('/block', function(req, res, next) {
  res.render('blocklist', { title: '印链区块', layout: 'defaultTemp' });
});

router.get('/block/:id', function(req, res, next) {
  var id = req.params.id;
  var params = {_id : id};
  if ( id.length<64 ) {
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
          return res.render('block', { title: '印链区块', block: result,layout: 'defaultTemp' });
        }
      })

});

router.get('/address', function(req, res, next) {
  res.render('addresslist', { title: '印链地址',layout: 'defaultTemp' });
});

router.get('/address/:id', function(req, res, next) {
  var id = req.params.id;
  Address.findOne({_id : id},function (err,result) {
    if(err){
      res.next(err);
    }else{
      return res.render('address', { title: '印链地址', address: result, layout: 'defaultTemp' });
    }
  })
});

router.get('/transaction', function(req, res, next) {
  res.render('transactionlist', { title: '印链交易',layout: 'defaultTemp' });
});

router.get('/transaction/:id', function(req, res, next) {
  var id = req.params.id;
  Transaction.findOne({_id : id},function (err,result) {
    if(err){
      res.next(err);
    }else{
      return res.render('transaction', { title: '印链交易', tx: result, layout: 'defaultTemp' });
    }
  })
});
// router.get('/transaction/:id', function(req, res, next) {
//   res.render('transaction', { title: '印链交易', txid: req.params.id, layout: 'defaultTemp' });
// });

router.get('/create_qrcode/:id', function (req, res, next) {
  var text = req.params.id;
  try {
    var img = qr.image(text,{size :10});
    res.writeHead(200, {'Content-Type': 'image/png'});
    img.pipe(res);
  } catch (e) {
    res.writeHead(414, {'Content-Type': 'text/html'});
    res.end('<h1>414 Request-URI Too Large</h1>');
  }
})

module.exports = router;
