// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//     alert('updated from background ');
//     console.log("tabId = "+tabId+" changeInfo = "+changeInfo+" tab = "+tab);
// });

chrome.runtime.onInstalled.addListener(function() {
    // ...
  
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
      // changeInfo object: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/onUpdated#changeInfo
      // status is more reliable (in my case)
      // use "alert(JSON.stringify(changeInfo))" to check what's available and works in your case
    //   if (changeInfo.status === 'complete') {
    //     chrome.runtime.sendMessage("test");
       
            // chrome.tabs.executeScript({
            //   file: 'onYouTube.js'
            // });
        // chrome.tabs.sendMessage(tabId, {
        //   message: 'TabUpdated'
        // });
       // alert("new tab");
    //    chrome.tabs.executeScript(tabId,{file:"onYouTube.js"},function(){
    //     console.log("run when needed");
    // });
      }
    })
  });