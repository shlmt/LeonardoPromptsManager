chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "activate_content_script") {
    console.log("Content script activated from popup");
    runMyCode();
  }
});

const runMyCode = () => {
  document.querySelectorAll("div.css-0 > div.css-0").forEach((block) => {
    try {
      const promptEl = block.querySelector("p[class*='text-sm']");
      const prompt = promptEl?.textContent?.trim()
      
      const textElements = Array.from(block.querySelectorAll("p"));
      const metadata = textElements
        .map((p) => p.textContent.trim())
        .filter((txt) => txt && txt !== prompt);

      if (!prompt) {
        throw "error";
      }

      const blockData = {
        prompt: prompt,
        model: metadata[0].trim(),
        style: metadata[1].trim(),
      };

      const images = block.querySelectorAll(
        `img[src][alt="${blockData.prompt}"]`
      );
      images.forEach((img) => {
        const parent =
          img.parentElement.parentElement.parentElement.parentElement;
        parent.onclick = (e) => {
          e.stopPropagation();
          const dataToAlert = {
            ...blockData,
            imageUrl: img.src,
          };
          const isOk = confirm("Save This Prompt?\n " + dataToAlert.prompt);
          if (isOk) {
            chrome.storage.sync.get(["savedObjects"], (result) => {
              let savedObjects = result.savedObjects || [];
              savedObjects = savedObjects.filter(
                (obj) => obj.imageUrl != img.src
              );
              savedObjects.push(dataToAlert);
              chrome.storage.sync.set({ savedObjects: savedObjects }, () => {});
            });
          }
        };
      });
    } catch (err) {}
  });
};
