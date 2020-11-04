var oldVidTitle = ["", ""];
var timeout;
var oldWindowUrl = "";

reset(window.location.href);


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'TabUpdated') {

    if (request.url !== oldWindowUrl) {
      reset(request.url);
    }

  } else if (request.message === "foundSubbedVidResult") {
    onSubbedVidResult(request.result);
  }
});

function reset(currentUrl) {
  oldWindowUrl = currentUrl;
  clearTimeout(timeout);
  var newURL = window.location.toString();
  if (newURL.includes("watch")) {
    getSubtitlesData();
  } else {
    // oldVidTitle[0] = "";
    // oldVidTitle[1] = "";
  }
}

//promise here



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
      waitForYTInfo(hasEngSubs);
    }
  }
}

function waitForYTInfo(hasEngSubs) {
  var vidTitElement = document.querySelector("#info-contents .title");
  var chanNameElement = document.querySelector("#meta-contents #channel-name");
  if (vidTitElement && chanNameElement) {
    var vidTitle = document.querySelector("#info-contents .title").innerText.trim();
    var channelName = document.querySelector("#meta-contents #channel-name").innerText.trim();
    if (vidTitle == null || vidTitle == "" || channelName == "" || channelName == null) {
      setNewTimeout(hasEngSubs);
    } else if (vidTitle === oldVidTitle[0] && oldVidTitle[1] !== window.location.href) {
      setNewTimeout(hasEngSubs);
    } else {
      decideAction(hasEngSubs);
      oldVidTitle[0] = vidTitle;
      oldVidTitle[1] = window.location.href;
    }
  } else {
    setNewTimeout(hasEngSubs);
  }
}
function setNewTimeout(hasEngSubs) {
  clearTimeout(timeout);
  timeout = setTimeout(function () {
    waitForYTInfo(hasEngSubs);
  }, 1000);
}

//at some point change to promises to speed up

function decideAction(hasEngSubs) {
  var isBTSChannel = checkChannelName();
  var isBTSTitle = checkTitle();

 


  console.log("\n\nVIDEO")
  console.log("url = "+window.location.toString());
  console.log("Video Title = "+document.querySelector("#info-contents .title").innerText.trim());
  console.log("channel name = "+document.querySelector("#meta-contents #channel-name").innerText.trim())
  console.log("decide action hasEngSubs = " + hasEngSubs + " isBTSChannel = " + isBTSChannel);


  if (isBTSChannel && hasEngSubs) {
    waitForSubtitleButtonReady();
  } else if (isBTSChannel) {
    openSubbedVid();
  }

}

function checkChannelName() {
  var btsChannels = ["BANGTANTV", "Big Hit Labels"];
  var channelName = document.querySelector("#meta-contents #channel-name").innerText;
  for (var i = 0; i < btsChannels.length; i++) {
    if (channelName.includes(btsChannels[i])) {
      return true;
    }
  }
  return false;
}

function checkTitle() {
  var videoTitle = document.querySelector("#info-contents .title").innerText;
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
      waitForSubtitleButtonReady();
    }, 1000);

  }
}

function turnSubsOn(subtitlesOn) {
  if (subtitlesOn === "false") {
    $(".ytp-subtitles-button").click();
  }
}

function openSubbedVid() {
  var date = document.querySelector("#date").innerText;
  var dateCode = getDateCode(date);

  var title = document.querySelector(".ytd-video-primary-info-renderer .title").innerText;
  var subbedUrl = "https://www.youtube.com/c/BangtanSubs/search?query=" + title;
  chrome.runtime.sendMessage({ message: "FindSubbedVid", url: subbedUrl, dateArray: dateCode, vidTitle: title }, function (response) {
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

  //for each day int
  //add that 
  //to month etc

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
  //console.log(dateCodeArray);
  //  return dateCodeArray;

  var videoTitle = document.querySelector("#info-contents .title").innerText;
  var allNum = true;
  var inTitleDate = "";
  for (var i = 0; i < 6; i++) {
    if (videoTitle.charAt(i).isNaN) allNum = false;
    inTitleDate += videoTitle.charAt(i);
  }

  if (allNum) return [inTitleDate,inTitleDate,inTitleDate];
  else return dateCodeArray;
  //get first 6 chars
  //if all numbers use that as date code




}


function makeDateCode(dayInt) {
  var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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


function onSubbedVidResult(result) {
  pauseVideo();
}
