var btsChannels = ["BANGTANTV", "Big Hit Labels", "UNIVERSAL MUSIC JAPAN"];

var isBTSVid = false;
var hasEngSubs = false;

var BTSChecked = false;
var subtitlesChecked = false;

var currentUrl;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'TabUpdated') {
    if (window.location.toString().includes("watch")) {
      reset();
    };
  }
});

function reset() {
  isBTSVid = false;
  hasEngSubs = false;
  BTSChecked = false;
  subtitlesChecked = false;
  console.log("reset called");

  if (window.location.toString() != currentUrl) {
    console.log("on youtube ran");
    currentUrl = window.location.toString();
    // waitForElementToDisplay("#channel-name", 5000);
    getSubtitlesData();
  }
}
function getSubtitlesData() {
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
      var languageNodes = xml.childNodes[0].childNodes;
      for (var i = 0; i < languageNodes.length; i++) {
        var code = languageNodes[i].getAttribute("lang_code");
        if (code === "en" || code === "en-gb" || code === "en-us") {
          // console.log("this vid has eng subtitles");
          hasEngSubs = true;

        }
      }
      subtitlesChecked = true;
     // bothProcessesFinished();
     waitForElementToDisplay("#channel-name", 5000);
    }
  }
}


// if (window.location.toString().includes("watch")) {
//   waitForElementToDisplay("#channel-name", 5000);
//   getSubtitlesData();
// };

function waitForElementToDisplay(selector, time) {
  if (document.querySelector(selector) != null) {
    checkChannelName();
    return;
  }
  else {
    setTimeout(function () {
      waitForElementToDisplay(selector, time);
    }, time);
  }
}

function checkChannelName() {
  var channelName = document.querySelector("#channel-name").innerText;
  //console.log("channel name = " + channelName);
  if (btsChannels.includes(channelName)) {
    isBTSVid = true;
  }
  checkTitle(isBTSVid);
}

function checkTitle(isBTSVid) {
  if (!isBTSVid) {
    var videoTitle = document.querySelector(".title").innerText;
    videoTitle = videoTitle.toLowerCase();
    if (videoTitle.includes("bts") || videoTitle.includes("bangtan")) {
      isBTSVid = true;
    }
  }
  console.log("isBTSVid = " + isBTSVid);
  BTSChecked = true;
  console.log("isBTSVid = " + isBTSVid);
  bothProcessesFinished(isBTSVid);
}





function bothProcessesFinished(isThisBTSVid) {
  console.log("isBTSVid = " + isBTSVid);
  console.log(" unchecked isBTSVid = " + isBTSVid + " hasEngSubs = " + hasEngSubs);
  
  if (BTSChecked && subtitlesChecked) { //got both data
    console.log("isBTSVid = " + isBTSVid + " hasEngSubs = " + hasEngSubs);
    if (isThisBTSVid) {
      if (hasEngSubs) {
        turnSubsOn();
      } else {
        searchForAltVid();
      }
    }
  }
}

function turnSubsOn() {
  console.log("turnSubsOn");
  var subtitlesButton = document.querySelector(".ytp-subtitles-button");
  var subtitlesOff = subtitlesButton.getAttribute("aria-pressed");
  if (subtitlesOff) {
    $(".ytp-subtitles-button").click();
    //add pop up to say we've turned subtitles on
  }
}

var translated = [["https://www.youtube.com/watch?v=Y-EmkILnUZs", "https://www.youtube.com/watch?v=EMJPye8pi6k"], ["https://www.youtube.com/watch?v=Q0Z41us9Qws", "https://www.youtube.com/watch?v=MaJOmvFEwm4"]];


function searchForAltVid() {
  var currentURL = window.location.toString();
  //modify to include http
  for (var i = 0; i < translated.length; i++) {
    if (translated[i][0] === currentURL) {
      window.open(translated[i][1]);
      var playButton = document.getElementsByClassName('ytp-play-button')[0];
      var playing = playButton.getAttribute("aria-label") === "Pause (k)";
      if (playing) {
        playButton.click();
      }
      // window.location.replace(translated[i][1]);
      //add in user preferences to open in new tab or same tab
      break;
    }
  }


}


  // chrome.tabs.create({'url': chrome.extension.getURL('popup.html')}, function(tab) {
  //   // Tab opened.
  // });
  // chrome.notifications.create(
  //   'name-for-notification',{   
  //   type: 'basic', 
  //   title: "This is a notification", 
  //   message: "hello there!" 
  //   },


  // function() {} 

  // );
  //database? idk
  //maybe array for now
  //google storage


//give options - pop up/open in new tab/open in same tab
//save preferences in chrome storage?

// window.addEventListener("message", function(event) {
//     // We only accept messages from ourselves
//     if (event.source != window)
//       return;

//     if (event.data.type && (event.data.type == "FROM_PAGE")) {
//       console.log("Content script received: " + event.data.text);
//       port.postMessage(event.data.text);
//     }
//   }, false);

//changing icon colour to signify if subtitles are available for that vid
//if not and clicked - can you help us find a subtitled version of this video?

//console.log("isBTSVid = "+isBTSVid);
//var menuitems = document.querySelectorAll(".ytp-menuitem-content");
//console.log("menu items = "+menuitems.length);

//ytp-menuitem-label-count
