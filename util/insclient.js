/**
 * Created by Henry on 2017/6/17.
 */
'use strict';
var settings = require("../settings");
//var Promise = require('bluebird');
//var net = Promise.promisifyAll(require('net'));
var net = require('net');

var client;
function rpc_client(cmd,params,callback) {
    if (!client) {
        client = net.connect({port: settings.rpc_port},
            function() { //'connect' listener
                console.log('connected to ' + settings.rpc_port);
                var info = {
                    rpc_user: settings.rpc_user,
                    rpc_password: settings.rpc_password
                };
                var data = JSON.stringify(info)+'\r\n';
                this.write(data);
            });
        client.on('data', function(data) {
            var res;
            try {
                res = JSON.parse(data);
            }catch(e) {
                return;
            }

            if ( res.success === true ) {
                if (res.message === 'ok') {
                    var info = {
                        command: cmd,
                        params: params
                    }
                    var d = JSON.stringify(info)+'\r\n';
                    client = this;
                    this.write(d);
                } else {
                    callback(null,res);
                }
            }else{
                callback(null,res);
            }

            //client.end();
        });
        client.on("error",function(err){
            console.log(" client error: ",err);
            callback(err,null);
        });
        client.on('end', function() {
            console.log('disconnected from server');
            client = null;
        });
    }else {
        var info = {
            command: cmd,
            params: params
        }
        var d = JSON.stringify(info)+'\r\n';
        client.write(d);
    }

}

function getblockcount(callback) {
    var params = [];
    rpc_client('getblockcount',params,function(err,data){
        if (err) {
            callback(err,{success:false,error:err});
        }else{
            callback(err,data);
        }
    })
}

function getblock(id, callback) {
    var params = [id];
    rpc_client('getblock',params,function(err,data){
        if (err) {
            callback(err,{success:false,error:err});
        }else{
            callback(err,data);
        }
    })
}

// rpc_client('getversion',[],function(err,data){
//     console.log(data);
//     // rpc_client('getblockcount',[],function(err,data){
//     //     console.log(data);
//     //     rpc_client('getblock',['270260'],function(err,data){
//     //         console.log(data);
//     //     })
//     // })
//     //blockId++;
//     //setTimeout(getblock,1000);
// })
// getblock(10000,function(err,data){
//     console.log(data);
// })

module.exports = {
    rpc_client: rpc_client,
    getblockcount: getblockcount,
    getblock: getblock
};
