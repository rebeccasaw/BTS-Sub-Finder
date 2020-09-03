console.log("from subbedvid page");

chrome.runtime.sendMessage({ message: "ready" }, function (response) {
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "subbedVidData") {
    findCorrectVid(request.dateArray, request.vidTitle);
  }
});


function findCorrectVid(dateArray, oldVidTitle) {

  var listedTitle = getListedVidTitle();
  console.log("listedTitle = " + listedTitle);


  if (listedTitle.includes(dateArray[0]) || listedTitle.includes(dateArray[1]) || listedTitle.includes(dateArray[2])) {
    var title = document.querySelector(".ytd-video-renderer #video-title");
    title.click();
    console.log("subbed vid success");
    chrome.runtime.sendMessage({ message: "foundSubbedVidSuccess" }, function (response) {
    });
  }


  oldVidTitle = oldVidTitle.replace(/[^0-9a-z]/gi, '');
  //removes any characters that aren't english

  //sep title into words
  //any non english characters out

}


function getListedVidTitle() {
  var title = document.querySelector(".ytd-video-renderer #video-title").innerText;
  return title;
}