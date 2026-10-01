export function downloadFile(uri: string, fileName: string) {
  const link = document.createElement("a");
  link.href = uri;
  link.download = fileName;
  link.click();
}

export async function saveProjectJsonToLocalFileSystem(
  text: string,
  suggestedName: string,
): Promise<string | undefined> {
  let handle: FileSystemFileHandle;
  try {
    handle = await (window as any).showSaveFilePicker({
      suggestedName,
      startIn: "downloads",
      types: [
        {
          description: "Wiyard project",
          accept: { "application/json": [".json"] },
        },
      ],
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError")
      return undefined;
    throw error;
  }
  const writable = await handle.createWritable();
  await writable.write(text);
  await writable.close();
  return handle.name;
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
