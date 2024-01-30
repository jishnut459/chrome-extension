chrome.runtime.onMessage.addListener((message) => {
    if (message.isRecording) {
        startRecording()
    } else {
        stopRecording();
    }
});

function startRecording() {
    document.addEventListener('click', handleSingleClick);
    document.addEventListener('dblclick', handleDoubleClick);
}

function stopRecording() {
    removeDetailsContainer()
    document.removeEventListener('click', handleSingleClick);
    document.removeEventListener('dblclick', handleDoubleClick);
}

function handleSingleClick(event) {
    const clickedElement = event.target;
    const domDetails = getDOMDetails(clickedElement);
    removeDetailsContainer();
    createDetailsContainer()
    const domDetailsContainer = document.getElementById('dom-details-container');

    domDetailsContainer.innerHTML = `
    <h4>DOM Element Details</h4>
    <p><strong>Tag Name:</strong> ${domDetails.tagName}</p>
    <p><strong>Attributes:</strong>
      <ul>
        ${domDetails.attributes.map(attr => `<li><b>${attr.name}:</b> ${attr.value}</li>`).join('')}
      </ul>
    </p>
  `;
    //Sending this if we want to later access it in the background.js
    chrome.runtime.sendMessage({
        type: 'clickData',
        data: domDetails
    });
}

function handleDoubleClick(event) {
    const doubleClickedElement = event.target;
    const message = `${doubleClickedElement.tagName} Double clicked`;

    removeDetailsContainer();
    createDetailsContainer()
    const domDetailsContainer = document.getElementById('dom-details-container');

    domDetailsContainer.innerHTML = `${doubleClickedElement.tagName} Double clicked`;

    //Sending this if we want to later access it in the background.js
    chrome.runtime.sendMessage({ type: 'doubleClickData', data: message });
}

function getDOMDetails(element) {
    const domDetails = {
        tagName: element.tagName.toLowerCase(),
        attributes: Array.from(element.attributes).map(attr => ({
            name: attr.name,
            value: attr.value
        })),
        textContent: element.textContent.trim(),
        position: element.getBoundingClientRect(),
        styles: getComputedStyle(element),
        isVisible: element.isConnected && window.getComputedStyle(element).display !== 'none'
    };
    return domDetails;
}

function createDetailsContainer() {
    const detailsContainer = document.createElement('div');
    detailsContainer.id = 'dom-details-container';
    detailsContainer.style.cssText = `
      position: fixed;
      bottom: 0;
      right: 0;
      max-width: 400px;
      max-height: 500px;
      border: 1px solid #ccc;
      background-color: #f5f5f5;
      overflow-y: auto;
      padding: 10px;
    `;
    document.body.appendChild(detailsContainer);
}

function removeDetailsContainer() {
    const domDetailsContainer = document.getElementById('dom-details-container');
    if (domDetailsContainer) {
        domDetailsContainer.remove();
    }
}






