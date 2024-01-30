let isRecording = false;

chrome.runtime.onMessageExternal.addListener((request) => {
    if (request.source === "website") {
        isRecording = request.isRecording;
    }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    const activeTabId = activeInfo.tabId;
    chrome.tabs.get(activeTabId, async (tab) => {
        if (startsWithHttps(tab.url)) {
            await chrome.scripting.executeScript({
                target: { tabId: activeTabId },
                files: ["content.js"],
            });
            chrome.tabs.sendMessage(activeTabId, { isRecording: isRecording });
        }
    })

});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (startsWithHttps(tab.url)) {
        await chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["content.js"],
        });
        chrome.tabs.sendMessage(tabId, { isRecording: isRecording });
    }
});

chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'doubleClickData') {
        console.log(message.data);
    } else if (message.type === 'clickData') {
        console.log(message.data);
    }
});


function startsWithHttps(url) {
    url = url.toLowerCase();
    return url.startsWith("https://");
}










