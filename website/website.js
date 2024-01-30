const extensionId = "hliocggaggdcbkiebdgaebmahcnpakjb"

const recordButton = document.getElementById("record-button");
let isRecording = false;

recordButton.addEventListener("click", () => {
    isRecording = !isRecording;
    recordButton.textContent = isRecording ? "Stop Recording" : "Start Recording";
    recordButton.classList.toggle("danger", isRecording);
    recordButton.classList.toggle("primary", !isRecording);

    chrome.runtime.sendMessage(extensionId, {
        action: isRecording ? "startRecording" : "stopRecording",
        source: "website",
        isRecording: isRecording
    });
});
