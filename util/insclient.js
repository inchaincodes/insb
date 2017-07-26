/**
 * Created by Henry on 2017/6/17.
 */
'use strict';
var settings = require("../settings");
//var Promise = require('bluebird');
//var net = Promise.promisifyAll(require('net'));
var net = require('net');
var events = require('events');
var emitter = new events.EventEmitter();
emitter.setMaxListeners(0);

var client = net.connect({port: settings.rpc_port},
    function() { //'connect' listener
        console.log('connected to server!!!');
    });
var bLogin=false;
client.on('data', function(data) {
    //console.log('Received: ' + data.toString());
    var str = data.toString();
    //str = JSON.parse(data);
    if ( !bLogin ) {
        bLogin = true;
        emitter.emit('login', str);
    }else{
        emitter.emit('recv', str);
    }

});

client.on('close', function() {
    console.log('Connection closed');
});

function rpc_login(callback) {
    emitter.on('login',function(data){
        callback(null,data);
    })
    var info = {
        rpc_user: settings.rpc_user,
        rpc_password: settings.rpc_password
    };
    var data = JSON.stringify(info)+'\r\n';
    client.write(data);
}

function rpc_write(cmd,params,callback) {
    emitter.on('recv', function(data) {
        callback(null, data);
    });
    var info = {
        command: cmd,
        params: params
    }
    var data = JSON.stringify(info)+'\r\n';
    client.write(data);
}

function getprivatekey(id, callback) {
    var params = ['',id];

    rpc_write('getprivatekey',params,function(err,data){
        if (err) {
            callback(err,{success:false,error:err});
        }else{
            //console.log(id);
            //console.log(data.toString());
            callback(err,data);
        }
    })
}
/*
function rpc_client(cmd,params,callback) {
    var client = net.connect({port: settings.rpc_port},
        function() { //'connect' listener
            console.log('connected to server!!!');
            var info = {
                rpc_user: settings.rpc_user,
                rpc_password: settings.rpc_password
            };
            var data = JSON.stringify(info)+'\r\n';
            this.write(data);
            //ret: {"success":true,"message":"ok"}
        });

    var recv;
    var login = false;
    client.on('data', function(data) {
        if ( recv ) {
            recv += data.toString();
        }else{
            recv = data.toString();
        }
        //
        // console.log(recv);
        // console.log(recv.length);

        var res;
        try {
            res = JSON.parse(recv);
        }catch(e) {
            return;
        }
        //console.log(res);
        if ( res.success === true ) {
            if (res.message === 'ok' && !login ) {
                login = true;
                console.log(params)
                var info = {
                    command: cmd,
                    params: params
                }
                var d = JSON.stringify(info)+'\r\n';
                this.write(d);
                recv = null;
            } else {
                callback(null,res);
                //this.end();
                recv = null;
            }
        }else{
            callback(null,res);
            //this.end();
            recv = null;
        }

        //client.end();
    });
    client.on("error",function(err){
        //console.log(" client error: ",err);
        callback(err,null);
    });
    client.on('end', function() {
        console.log('disconnected from server');
    });
}
*/

function getblockcount(callback) {
    var params = [];
    rpc_write('getblockcount',params,function(err,data){
        if (err) {
            callback(err,{success:false,error:err});
        }else{
            callback(err,data);
        }
    })
}

function getblock(id, callback) {
    var params = [id];
    rpc_write('getblock',params,function(err,data){
        if (err) {
            callback(err,{success:false,error:err});
        }else{
            callback(err,data);
        }
    })
}

//rpc_login(function(data){
//    getblock(10000,function(err,data){
//     console.log(data);
// })
//})
module.exports = {
    rpc_client: rpc_write,
    getblockcount: getblockcount,
    getblock: getblock,
    getprivatekey: getprivatekey,
    write: rpc_write,
    login: rpc_login
};
