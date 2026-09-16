export function downloadFile(uri: string, fileName: string) {
  const link = document.createElement("a");
  link.href = uri;
  link.download = fileName;
  link.click();
}

export function loadLocalFileText(): Promise<{
  fileName: string;
  content: string;
} | null> {
  const input = document.createElement("input");
  input.type = "file";

  return new Promise((resolve, reject) => {
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const content = await file.text();
          resolve({ fileName: file.name, content });
        } catch (error) {
          reject(error);
        }
      }
    };
    input.oncancel = () => {
      resolve(null);
    };
    input.click();
  });
}
