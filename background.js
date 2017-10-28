(function(){
    var tabId;

    chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
        chrome.browserAction.setBadgeBackgroundColor({
            color: 'red',
            tabId: sender.tab.id
        });
        chrome.browserAction.setBadgeText({text: message});
        if ( message.length == 0 ) {
            chrome.tabs.update(tabId, { highlighted: true });
        }
        if ( !tabId ) { tabId = sender.tab.id; }
        sendResponse();
    });

    chrome.browserAction.onClicked.addListener(function(tab) {
        chrome.browserAction.getBadgeText({}, function(text) {
            if ( text && /^\d+$/.test(text) ) {
                chrome.tabs.update(tabId, { highlighted: true });
                chrome.browserAction.setBadgeText({text: '...'});
                chrome.tabs.sendMessage(tabId, {text: 'icon_click'}, function(message){
                    chrome.tabs.update(tabId, { highlighted: true });
                });
            } else {
                alert( 'Nothing to do. Please click me when you see a positive counter.' );
            }
        });
    });
})();