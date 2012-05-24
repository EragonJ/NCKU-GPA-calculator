/*
 * Doesnt work , try later
chrome.pageAction.onClicked.addListener(function(tab) {
    chrome.tabs.sendRequest(tab.id, {}, function(){});
});
*/

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if (tab.url.match(/^https:\/\/qrys.sso2.ncku.edu.tw\/ncku\/qrys05.asp/)) {
        chrome.pageAction.show(tabId);
    }
    else {
        chrome.pageAction.hide(tabId);
    }
})
