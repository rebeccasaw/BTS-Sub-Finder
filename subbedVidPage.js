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

  console.log("listed title = " + listedTitle);

   console.log("channel ="+ getListedVidChannel());

  if (getListedVidChannel().includes("Bangtan Subs")) {

    if (listedTitle.includes(dateArray[0]) || listedTitle.includes(dateArray[1]) || listedTitle.includes(dateArray[2])) {
      var title = document.querySelector(".ytd-video-renderer #video-title");
      title.click();
      chrome.runtime.sendMessage({ message: "foundSubbedVidSuccess" }, function (response) {
      });
    }
  }
  //check other vids after top one

  oldVidTitle = oldVidTitle.replace(/[^0-9a-z]/gi, '');
  //removes any characters that aren't english

  //sep title into words
  //any non english characters out

}


function getListedVidTitle() {
  var title = document.querySelector(".ytd-video-renderer #video-title").innerText;
  return title;
}

function getListedVidChannel() {
  var channelName = document.querySelector(".ytd-video-renderer #channel-name").innerText;
  return channelName;
}