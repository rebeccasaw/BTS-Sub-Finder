chrome.runtime.onInstalled.addListener(function () {


  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

    if (changeInfo.status === 'complete') {
    //  alert("change tabId = "+tabId);
      chrome.tabs.sendMessage(tabId, {
        message: 'TabUpdated'
      });

    }
  });

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === 'FindSubbedVid') {

      chrome.tabs.create({ url: request.url, active: false }, function (tab) {
        //make new tab
      // alert("hello tab = "+tab);
        // chrome.tabs.sendMessage(tab.id, { //send new message to that tab
        //   message: 'chooseSubbedVid'
        // });
       // chrome.tabs.sendMessage(tab.id, {message: "hello"});


      });
    }else if(request.message ==="ready"){
    //  chrome.tabs.sendMessage(sender.tab.id, {message: "hello"});
    }
  });
});
//message to open new tab


 // changeInfo object: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/onUpdated#changeInfo
    // status is more reliable (in my case)
    // use "alert(JSON.stringify(changeInfo))" to check what's available and works in your case

        // alert("newtab");
      // alert(tabId + tab.url);
      //tab.url
      //so if watch do watch message
      //if bangtan do bangtan
      //seperate reciever here to close tab?
      //think that should work

      //chrome.tabs.create({url:"https://google.com",active: false});
      //will work like this, currently causing loop


      // chrome.tabs.executeScript({
      //   file: 'new.js'
      // });
      //to send new js file to new open tab page

      //send msg with tab id
      //can return tab id to focus or close it


// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//     alert('updated from background ');
//     console.log("tabId = "+tabId+" changeInfo = "+changeInfo+" tab = "+tab);
// });

// chrome.runtime.onInstalled.addListener(function() {
//     // ...

//     // chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//     //   // changeInfo object: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/onUpdated#changeInfo
//     //   // status is more reliable (in my case)
//     //   // use "alert(JSON.stringify(changeInfo))" to check what's available and works in your case
//     // //   if (changeInfo.status === 'complete') {
//     // //     chrome.runtime.sendMessage("test");

//     //         // chrome.tabs.executeScript({
//     //         //   file: 'onYouTube.js'
//     //         // });
//     //     // chrome.tabs.sendMessage(tabId, {
//     //     //   message: 'TabUpdated'
//     //     // });
//     //    // alert("new tab");
//     // //    chrome.tabs.executeScript(tabId,{file:"onYouTube.js"},function(){
//     // //     console.log("run when needed");
//     // });
//     //        });
// //   });

//
// if (window.location.toString().includes("watch")) {
//   waitForElementToDisplay("#channel-name", 5000);
//   getSubtitlesData();
// };