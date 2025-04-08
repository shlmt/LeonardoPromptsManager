const container = document.getElementById("prompts-container");

chrome.storage.sync.get(["savedObjects"], (result) => {
  Object.values(result.savedObjects || []).forEach((prompt) => {
    const row = document.createElement("tr");

    const imageCell = document.createElement("td");
    imageCell.style.position = "relative";

    const wrapper = document.createElement("div");
    wrapper.className = "image-wrapper";

    const image = document.createElement("img");
    image.src = prompt.imageUrl;
    image.alt = "Prompt Image";
    image.style.display = "block";
    image.style.width = "250px";
    image.style.height = "auto";
    image.style.borderRadius = "5px";

    wrapper.appendChild(image);

    wrapper.addEventListener("click", (e) => {
      e.stopPropagation();
      fetch(prompt.imageUrl)
        .then(res => res.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${prompt.prompt.replace(/[\\/:*?"<>|]/g, "").slice(0, 250)}.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        });
    });
    imageCell.appendChild(wrapper);

    const promptCell = document.createElement("td");
    promptCell.classList.add("prompt");

    const promptText = document.createElement("span");
    promptText.textContent = prompt.prompt;

    const copyBtn = document.createElement("div");
    copyBtn.classList.add("round-button");
    copyBtn.innerHTML = "\u2398";
    copyBtn.title = "Copy prompt";
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(prompt.prompt);
    });

    promptCell.appendChild(promptText);
    promptCell.appendChild(copyBtn);

    const modelCell = document.createElement("td");
    modelCell.textContent = prompt.model;

    const styleCell = document.createElement("td");
    styleCell.textContent = prompt.style;

    row.appendChild(imageCell);
    row.appendChild(promptCell);
    row.appendChild(modelCell);
    row.appendChild(styleCell);

    container.appendChild(row);
  });
});
