function wrapReadAsDataUrl(source: File | Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target!.result as string;
      resolve(dataUrl);
    };
    reader.readAsDataURL(source);
  });
}

export async function loadLocalImageFile(): Promise<string | undefined> {
  return new Promise((resolve) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.addEventListener("change", async () => {
      const file = fileInput.files?.[0];
      if (file) {
        const dataUrl = await wrapReadAsDataUrl(file);
        resolve(dataUrl);
      }
    });
    fileInput.click();
  });
}
