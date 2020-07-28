// chrome.runtime.onMessage.addListener(
//     function(message, callback) {
//       if (message == 'runContentScript'){
//         chrome.tabs.executeScript({
//           file: 'content.js'
//         });
//       }
//    });
// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//     alert('updated from popupscript');
//   });
//window.postMessage({ type: "FROM_PAGE", text: "Hello from the webpage!" }, "*");
console.log("hello from popup");
var newVidImg = document.querySelector("#newVidImg");
newVidImg.addEventListener('click', function () {
    //alert ("yo");
    window.open("https://www.youtube.com/watch?v=OMjMmULhl_M");
});


 //   alert("hi");

