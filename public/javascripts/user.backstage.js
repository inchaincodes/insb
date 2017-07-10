function getquery() {
    var href=window.location.href
    var a = href.split('?');
    var q;
    if (a.length>1) q = a[1];
    return q;
}

function getblock($scope, $http, id) {
    $http.get("/api/v2/block/"+id).then(function (response) {
        $scope.block = response.data;
    })
}

function getblocks(url, $scope, $http) {
    $http.get(url).then(function (response) {
        $scope.blockList = response.data;
        var html = getpaganation($scope.blockList.pageInfo,'/block');
        $('#block').html(html);
    })
}

function gettransaction($scope, $http, id) {
    $http.get("/api/v2/transaction/"+id).then(function (response) {
        $scope.transaction = response.data;
    })
}

function gettransactions(url, $scope, $http) {
    $http.get(url).then(function (response) {
        $scope.transactionList = response.data;
        var html = getpaganation($scope.transactionList.pageInfo, '/transaction');
        $('#transaction').html(html);
    })
}
function getaddress($scope, $http, id) {
    $http.get("/api/v2/address/"+id).then(function (response) {
        $scope.address = response.data;
    })
}

function getaddresses(url, $scope, $http) {
    $http.get(url).then(function (response) {
        $scope.addressList = response.data;
        var html = getpaganation($scope.addressList.pageInfo, '/address');
        $('#address').html(html);
    })
}

function getpaganation(pageInfo,localUrl) {
    var totalItems = pageInfo.totalItems;
    var limit = pageInfo.limit;
    var totalPage = Math.ceil(totalItems / limit);

    var page_start = pageInfo.currentPage - 2 > 0 ? pageInfo.currentPage - 2 : 1;
    var page_end = page_start + 4 >= totalPage ? totalPage : page_start + 4;

    var html = '';
    if(pageInfo.currentPage != 1){
        html = '<li><a href="' + localUrl + '?limit=' + limit  + '">«</a></li>';
    }

    if (page_start > 1) {
        html += '<li><a>...</a></li>'
    }

    for(var i=page_start;i<=page_end;i++){
        if(i == pageInfo.currentPage){
            html += '<li class="active"><a>' + i + '</a></li>';
        }else{
            html += '<li><a href="' + localUrl + '?limit=' + limit  + '&page=' + i + '">' + i + '</a></li>';
        }
    }

    if (page_end < totalPage ) {
        html += '<li><a>...</a></li>';
    }

    if(pageInfo.currentPage != totalPage){
        html += '<li><a href="' + localUrl + '?limit=' + limit  + '&page=' + totalPage + '">»</a></li>';
    }
    return html;
}