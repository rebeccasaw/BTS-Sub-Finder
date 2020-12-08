console.log("from subbedvid page");

chrome.runtime.sendMessage({ message: "ready" }, function (response) {
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "subbedVidData") {
    //for here


    var success = false;;

    for (var i = 0; i < 3; i++) {
     // console.log("tried new list vvideo");
      if (!success) {
      success = findCorrectVid(request.dateArray, request.vidTitle, i);
      }
    }
  }
});


function findCorrectVid(dateArray, oldVidTitle, vidNum) {
  var success = false;
  var listedTitle = getListedVidTitle(vidNum);

  console.log("listed title = " + listedTitle);

  // console.log("channel ="+ getListedVidChannel());

  if (getListedVidChannel(vidNum).includes("Bangtan Subs")) {

    if (listedTitle.includes(dateArray[0]) || listedTitle.includes(dateArray[1]) || listedTitle.includes(dateArray[2])) {
      console.log("success date array = "+dateArray);
      var title = document.querySelectorAll(".ytd-video-renderer #video-title")[vidNum];
      title.click();
      success = true;
      chrome.runtime.sendMessage({ message: "foundSubbedVidSuccess" }, function (response) {
      });
    }
  }
  return success;
  //check other vids after top one

  //oldVidTitle = oldVidTitle.replace(/[^0-9a-z]/gi, '');
  //removes any characters that aren't english

  //sep title into words
  //any non english characters out

}


function getListedVidTitle(vidNum) {
  var title = document.querySelectorAll(".ytd-video-renderer #video-title")[vidNum].innerText;
  //query selector all for array
  //or $$ for jquery

  return title;
}

function getListedVidChannel(vidNum) {
  var channelName = document.querySelectorAll(".ytd-video-renderer #channel-name")[vidNum].innerText;
  return channelName;
}