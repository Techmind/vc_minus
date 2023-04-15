chrome.runtime.sendMessage({
    message: "url_changed",
    url: window.location.href
});




chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    // If the received message has the expected format...
    if (msg.text === 'report_back') {
        debugger;
        console.log('content.js', document);
        // Call the specified callback, passing
        // the web-page's DOM content as argument
        sendResponse(document.all[0].outerHTML);
    }
});