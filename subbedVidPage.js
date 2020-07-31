//code to be injected into bangtan subs page that's been opened

//alert ("from subbedVideo page");
console.log("from subbedvid page");

chrome.runtime.sendMessage({message: "ready" }, function(response) {
   // alert("I got a response");
    console.log("response"+response.message);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  //  alert("MESSAGE "+request.message);
    if (request.message == 'chooseSubbedVid') {
      //  alert ("SUCCESS");
        console.log("recieved message on this tab");
    }
  });

  //write a response, it background doesn't get response send it again?