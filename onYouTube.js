var oldVidTitle = "";
console.log("on you tube top once called");
// reset();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'TabUpdated') {
    reset();
    console.log("tab updated");
  }else if(request.message ==="foundSubbedVidResult"){
    onSubbedVidResult(request.result);
  }
});

function reset() {
  console.log("on youtube ran");
  var newURL = window.location.toString();
  if (newURL.includes("watch")) {
    getSubtitlesData();
  }

}

function getSubtitlesData() {
  var hasEngSubs = false;
  var url = window.location.toString();
  var watchId;
  var urlParts = url.split("youtube.com/watch?v=");
  if (urlParts.length > 0) {
    watchId = urlParts[1];
    var request = new XMLHttpRequest();
    request.open("GET", "https://video.google.com/timedtext?type=list&v=" + watchId);
    request.send();

    request.onload = function () {
      var xml = request.responseXML;
      if (xml != null) {
        var languageNodes = xml.childNodes[0].childNodes;
        for (var i = 0; i < languageNodes.length; i++) {
          var code = languageNodes[i].getAttribute("lang_code");
          if (code === "en" || code === "en-GB" || code === "en-US") {
            hasEngSubs = true;
          }
        }
      }
      waitForElementToDisplay("#channel-name", 1000, hasEngSubs);
    }
  }
}

function waitForElementToDisplay(selector, time, hasEngSubs) {
  if (document.querySelector(selector) != null) {
    //title exists - or channelName? 
    //should probably check both
    var newVidTitle = null;
    newVidTitle = document.querySelector(".ytd-video-primary-info-renderer .title").innerText;
    console.log("oldVidTitle = " + oldVidTitle + " new vid title " + newVidTitle);
    if (newVidTitle != oldVidTitle && newVidTitle != "Home") {
      decideAction(hasEngSubs);
      oldVidTitle = newVidTitle;
      return;
    }
    else {
      setTimeout(function () {
        waitForElementToDisplay(selector, time, hasEngSubs);
      }, time);
    }

  }
  else {
    setTimeout(function () {
      waitForElementToDisplay(selector, time, hasEngSubs);
    }, time);
  }
}

function decideAction(hasEngSubs) {
  var isBTSChannel = checkChannelName();
  var isBTSTitle = checkTitle();

  console.log("decide action hasEngSubs = " + hasEngSubs + " isBTSChannel = " + isBTSChannel);

  if (isBTSChannel && hasEngSubs) {
    waitForSubtitleButtonReady();
  } else if (isBTSChannel) {
    openSubbedVid();
  }

}

function checkChannelName() {
  var btsChannels = ["BANGTANTV", "Big Hit Labels"];
  var channelName = document.querySelector("#channel-name").innerText;

  for (var i = 0; i < btsChannels.length; i++) {
    if (channelName.includes(btsChannels[i])) {
      return true;
    }
  }
  return false;
}

function checkTitle() {
  var videoTitle = document.querySelector(".ytd-video-primary-info-renderer .title").innerText;
  videoTitle = videoTitle.toLowerCase();
  return (videoTitle.includes("bts") || videoTitle.includes("bangtan"));
}


function waitForSubtitleButtonReady() {
  var subtitlesButton = document.querySelector(".ytp-subtitles-button");
  var subtitlesOn = subtitlesButton.getAttribute("aria-pressed");
  if (subtitlesOn != null) {
    turnSubsOn(subtitlesOn);
  }
  else {
    setTimeout(function () {
      console.log("null so waiting");
     waitForSubtitleButtonReady();
    }, 1000);

  }
}

function turnSubsOn(subtitlesOn) {
  console.log("subtitlesOn = " + subtitlesOn);
  if (subtitlesOn === "false") {
    $(".ytp-subtitles-button").click();
    console.log("clicked");
  }

}



function openSubbedVid() {
  var date = document.querySelector("#date").innerText;
  var dateCode = getDateCode(date);

  var title = document.querySelector(".ytd-video-primary-info-renderer .title").innerText;
  //pauseVideo();
var subbedUrl = "https://www.youtube.com/c/BangtanSubs/search?query=" + title;
  chrome.runtime.sendMessage({message: "FindSubbedVid",url: subbedUrl, dateArray: dateCode,vidTitle:title}, function(response) {
  });

  var newVidTitleObj = document.querySelector("#video-title");
  var newVidTitle = newVidTitleObj.innerText;


}


function getDateCode(dateString) {
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var dateCodeArray = [];
  dateString = dateString.slice(1);
  var parts = dateString.split(" ");
  var yearCode = parts[2].charAt(2) + parts[2].charAt(3);
  var monthCode = months.indexOf(parts[1]) + 1;
  monthCode = makeTwoDigitNumber(monthCode.toString());
  var dayCode = makeTwoDigitNumber(parts[0]);
  var dateCode = yearCode + monthCode + dayCode;
  //need to add one to date code etc?
  dateCodeArray.push(dateCode);
  var dayInt = parseInt(parts[0]);
  dayInt++;
  dayCode = makeTwoDigitNumber(dayInt.toString());
  dateCode = yearCode + monthCode + dayCode;
  dateCodeArray.push(dateCode);
  dayInt = dayInt - 2;
  dayCode = makeTwoDigitNumber(dayInt.toString());
  dateCode = yearCode + monthCode + dayCode;
  dateCodeArray.push(dateCode);
  //rebecca this code is terrible make it better
  console.log(dateCodeArray);
  return dateCodeArray;
}

// function makeDateCodeArray(dateCode) {
//   var dateCodeArray = [];
//   var dayIntsArray = [];
//   dateCodeArray.push(dateCode);
//   var dayInt = parseInt(dateCode.charAt(0) + dateCode.charAt(1));
//   dayIntsArray.push(dayInt + 1);
//   dayIntsArray.push(dayInt - 1);

//   for (var i = 0; i < dayIntsArray.length; i++) {
//     var dayCode = makeTwoDigitNumber(dayIntsArray[i].toString());
//     dateCode = yearCode + monthCode + dayCode;
//     dateCodeArray.push(dateCode);
//   }
//   return dateCodeArray;
// }

function makeTwoDigitNumber(number) {
  var length = number.length;
  if (length === 1) number = "0" + number;
  return number;
}

function pauseVideo() {
  var playButton = document.getElementsByClassName('ytp-play-button')[0];
  var playing = playButton.getAttribute("aria-label") === "Pause (k)";
  if (playing) {
    playButton.click();
  }
}


function onSubbedVidResult(result){

pauseVideo();
//alert("result = "+result);
}
