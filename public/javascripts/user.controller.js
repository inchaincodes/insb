var userApp = angular.module('userApp',[]);

userApp.controller('blocksCtrl', function($scope, $http, $interval) {
    $scope.blockList = {}
    var q = getquery();
    var url = "/api/v2/block";
    if (q) url = "/api/v2/block?"+q;
    getblocks(url, $scope, $http);

    // function dosync() {
    //     $http.get("/api/v1/bestblockheight").then(function (response) {
    //         $scope.bestblockheight = response.data.bestblockheight;
    //     });
    // }

    // $http.get("/api/v1/version").then(function (response) {
    //     $scope.version = response.data.version;
    // });
    // $http.get("/api/v1/bestblockheight").then(function (response) {
    //     $scope.height = $scope.bestblockheight = response.data.bestblockheight;
    //     getblock($scope.height);
    // });

    // $scope.query = function(id) {
    //     getblock(id);
    // }

    $scope.gettx = function(id) {
    }

    // $interval(dosync, 10000);
})

userApp.controller('transactionsCtrl', function($scope, $http) {
    $scope.transactionList = {}
    var q = getquery();
    var url = "/api/v2/transaction";
    if (q) url = "/api/v2/transaction?"+q;
    gettransactions(url, $scope, $http);
})

userApp.controller('addressesCtrl', function($scope, $http) {
    $scope.addressList = {}
    var q = getquery();
    var url = "/api/v2/address";
    if (q) url = "/api/v2/address?"+q;
    getaddresses(url, $scope, $http);
})