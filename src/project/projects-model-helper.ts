export function downloadFile(uri: string, fileName: string) {
  const link = document.createElement("a");
  link.href = uri;
  link.download = fileName;
  link.click();
}

export function loadLocalFileText(): Promise<string | null> {
  const input = document.createElement("input");
  input.type = "file";

  return new Promise((resolve, reject) => {
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        file.text().then(resolve).catch(reject);
      }
    };
    input.oncancel = () => {
      resolve(null);
    };
    input.click();
  });
}
