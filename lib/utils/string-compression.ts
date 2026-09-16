import { deflateSync, inflateSync, strFromU8, strToU8 } from "fflate";

function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}
function base64UrlToBytes(text: string): Uint8Array {
  let padded = text.replaceAll("-", "+").replaceAll("_", "/");
  const rem = padded.length % 4;
  if (rem) padded += "=".repeat(4 - rem);
  const bin = atob(padded);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export function compressTextToBase64(text: string): string {
  const bytes = deflateSync(strToU8(text), { level: 9 });
  return bytesToBase64Url(bytes);
}

export function decompressTextFromBase64(base64Text: string): string {
  const bytes = base64UrlToBytes(base64Text);
  return strFromU8(inflateSync(bytes));
}
