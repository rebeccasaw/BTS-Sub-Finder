var currentDateArray = [];
var currentNewVidTitle = "";
var origTabId = "";

  chrome.runtime.onStartup.addListener(function () {
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    console.log("background tab listener event In");
    if (changeInfo.status === 'complete') {
      chrome.tabs.sendMessage(tabId, {
        message: 'TabUpdated'
      });
        alert("tab updated");
    }
  });

  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    if (request.message === 'FindSubbedVid') {
      currentDateArray = request.dateArray;
      currentNewVidTitle = request.vidTitle;
      origTabId = sender.tab.id;
      chrome.tabs.create({ url: request.url, active: false }, function (tab) {
      });
    } else if (request.message === "ready") {


      chrome.tabs.sendMessage(sender.tab.id, { message: "subbedVidData", dateArray: currentDateArray, vidTitle: currentNewVidTitle });
      currentDateArray = [];
      currentNewVidTitle = "";

   
    } else if (request.message === "foundSubbedVidSuccess") {
   
      chrome.tabs.sendMessage(origTabId, { message: "foundSubbedVidResult", result: "success" });
      chrome.tabs.update(sender.tab.id, { highlighted: true, active: true });
    }
  });
});



