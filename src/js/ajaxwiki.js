/**
 * ajax function to get location information from wikipedia
 */
var ajaxWiki = function(searchName, successCallback, errCallback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE) {
            if (this.status == 200) {
                // console.log(this.responseText);
                var responseJson = JSON.parse(this.responseText);
                if (responseJson[1].length === 0 || responseJson[2].length === 0 || responseJson[3].length === 0) {
                    errCallback("No wiki page found for " + searchName);
                    return;
                } else {
                    var resp = {};
                    resp.searchTerm = responseJson[0];
                    resp.title = responseJson[1][0];
                    resp.content = responseJson[2][0];
                    resp.url = responseJson[3][0];
                    successCallback(resp);
                    return;
                }
            } else {
                errCallback(this.responseText + searchName);
                return;
            }
        }
    };
    var url = wikiQryUrl + encodeURIComponent(searchName);
    xhttp.open("GET", url, true);
    xhttp.send();
};