var btsChannels = ["BANGTANTV", "Big Hit Labels"];

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'TabUpdated') {
    reset();
  }
});

function reset() {
  console.log("on youtube ran");
  getSubtitlesData();
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
      if (xml) {
        var languageNodes = xml.childNodes[0].childNodes;
        for (var i = 0; i < languageNodes.length; i++) {
          var code = languageNodes[i].getAttribute("lang_code");
          if (code === "en" || code === "en-gb" || code === "en-us") {
            hasEngSubs = true;
          }
        }
      }
      waitForElementToDisplay("#channel-name", 5000, hasEngSubs);
    }
  }
}

function waitForElementToDisplay(selector, time, hasEngSubs) {
  if (document.querySelector(selector) != null) {
    decideAction(hasEngSubs);
    return;
  }
  else {
    setTimeout(function () {
      waitForElementToDisplay(selector, time);
    }, time);
  }
}

function decideAction(hasEngSubs) {
  var isBTSChannel = checkChannelName();
  var isBTSTitle = checkTitle();

  console.log("decide action hasEngSubs = " + hasEngSubs + " isBTSChannel = " + isBTSChannel);

  if (isBTSChannel && hasEngSubs) {
    turnSubsOn();
  } else if (isBTSChannel) {
    openSubbedVid();
  }

}

function checkChannelName() {
  var channelName = document.querySelector("#channel-name").innerText;
  return btsChannels.includes(channelName);
}

function checkTitle() {
  var videoTitle = document.querySelector(".title").innerText;
  videoTitle = videoTitle.toLowerCase();
  return (videoTitle.includes("bts") || videoTitle.includes("bangtan"));
}



function turnSubsOn() {
  console.log("turnSubsOn");
  var subtitlesButton = document.querySelector(".ytp-subtitles-button");
  var subtitlesOff = subtitlesButton.getAttribute("aria-pressed");
  if (subtitlesOff) {
    $(".ytp-subtitles-button").click();
  }
}

function openSubbedVid() {
  var date = document.querySelector("#date").innerText;
  var dateCode = getDateCode(date);

  var title = document.querySelector(".title").innerText;
  window.open("https://www.youtube.com/c/BangtanSubs/search?query=" + title);
  pauseVideo();

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

  //get title of original vid
  //get date
  //date is yr month day
  //search vid title here
  //https://www.youtube.com/c/BangtanSubs/search?query=jungkook
  //$("#video-title").innerText;
  //if new vid title date code is correct
  //open that vid



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

