chrome.runtime.onMessage.addListener((message) => {
    if (message.isRecording) {
        startRecording();

    } else {
        stopRecording();

    }
});

function createContainerDiv() {
    const containerDiv = document.createElement("div");
    containerDiv.id = "extension-container";
    document.body.appendChild(containerDiv);

    containerDiv.style.cssText = `
        position: fixed;
        bottom: 0;
        right: 0;
        z-index: 1000;
    `
}

function removeContainerDiv() {
    const containerDiv = document.getElementById("extension-container");
    if (containerDiv) {
        document.body.removeChild(containerDiv);
    }
}


function startRecording() {
    createContainerDiv();
    document.addEventListener('click', handleSingleClick);
    document.addEventListener('dblclick', handleDoubleClick);
}

function stopRecording() {
    removeContainerDiv();
    document.removeEventListener('click', handleSingleClick);
    document.removeEventListener('dblclick', handleDoubleClick);
}

function handleSingleClick(event) {
    const clickedElement = event.target;
    const domDetails = getDOMDetails(clickedElement);
    removeDetailsContainer();
    displayDetails(domDetails)
}

function handleDoubleClick(event) {
    const doubleClickedElement = event.target;
    const message = `${doubleClickedElement.tagName} Double clicked`;
    removeDetailsContainer();
    displayToast(message);
}

function getDOMDetails(element) {
    return {
        "Logical Name": element.nodeName,
        "XPath": getXPath(element),
        "domId": element.hasAttribute('id') ? element.id : "",
        "domName": element.hasAttribute('name') ? element.name : "",
        "classList": element.classList,
        "tag": element.tagName,
        "css": getCSS(element).join(" "),
        "linkText": element.hasAttribute('href') ? element.textContent.trim() : null,
        "partialLinkText": element.hasAttribute('href') ? element.textContent.trim().toLowerCase() : null
    };
}

function getXPath(element) {
    if (!element) {
        return '';
    }

    if (element.id) {
        return `@id="${element.id}"`;
    }

    if (element === document.body) {
        return element.tagName.toLowerCase();
    }

    let siblingCount = 0;
    let siblings = element.parentNode ? element.parentNode.childNodes : [];

    for (let i = 0; i < siblings.length; i++) {
        let sibling = siblings[i];

        if (sibling === element) {
            return `${getXPath(element.parentNode)}/${element.tagName.toLowerCase()}[${siblingCount + 1}]`;
        }

        if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
            siblingCount++;
        }
    }

    return '';
}

function getCSS(clickedElement) {
    const computedStyles = window.getComputedStyle(clickedElement);
    let stylesArray = [];

    for (let i = 0; i < computedStyles.length; i++) {
        const propertyName = computedStyles[i];
        const propertyValue = computedStyles.getPropertyValue(propertyName);

        // Skip properties with empty values
        if (propertyValue.trim() === "") {
            continue;
        }
        stylesArray.push(propertyName + ": " + propertyValue);
    }

    return stylesArray;
}

function displayToast(message) {
    let toastContainer = document.getElementById('toast')
    if (toastContainer) {
        toastContainer.remove();
    }

    toastContainer = document.createElement("div");
    toastContainer.style.cssText = `
       
        border-radius: 12px;
        padding: 10px;
        margin: 20px;
        max-width: 200px;
        background-color: rgb(55, 55, 55);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
        color: white;
    `
    toastContainer.id = "toast";
    toastContainer.innerHTML = message;
    extensionContainer = document.getElementById('extension-container');
    if (extensionContainer) {
        extensionContainer.appendChild(toastContainer);
    }
    setTimeout(() => {
        if (toastContainer) {
            toastContainer.remove();
        }
    }, 1000)

}

function displayDetails(details) {
    const detailsContainer = document.createElement('div');
    detailsContainer.id = 'dom-details-container';
    detailsContainer.style.cssText = `
      border-radius: 8px;
      margin: 4px;
      background-color: rgb(55, 55, 55);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
      padding: 10px;
      display: flex;
      gap: 4px;
      width: 500px;
      max-height: 400px;
    `;

    const labelsContainer = document.createElement('div');
    labelsContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 40%;
    `;

    const valuesContainer = document.createElement('div');
    valuesContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 4px;
      width: 60%;
    `;

    for (const [label, value] of Object.entries(details)) {
        const labelElement = document.createElement('div');
        labelElement.textContent = label;
        labelElement.style.cssText = `
          display: flex;
          align-items: center;
          font-weight: bold;
          padding: 4px;
          background-color: rgb(28, 27, 27);
          color: white;
          border: 1px solid black;
          height: 40px;
        `;
        labelsContainer.appendChild(labelElement);

        const valueElement = document.createElement('div');
        valueElement.textContent = value || 'N/A';
        valueElement.style.cssText = `
          display: flex;
          align-items: center;
          padding: 4px;
          background-color: rgb(28, 27, 27);
          color: white;
          border: 1px solid black;
          height: 40px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        `;
        valuesContainer.appendChild(valueElement);
    }

    detailsContainer.appendChild(labelsContainer);
    detailsContainer.appendChild(valuesContainer);

    extensionContainer = document.getElementById('extension-container');
    if (extensionContainer) {
        extensionContainer.appendChild(detailsContainer);
    }
}

function removeDetailsContainer() {
    const domDetailsContainer = document.getElementById('dom-details-container');
    if (domDetailsContainer) {
        domDetailsContainer.remove();
    }
}






