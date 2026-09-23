export const domIds = {
  deskArea: "domDeskArea",
  graphEditPlane: "domGraphEditPlane",
};

export function getGraphEditPlaneElement() {
  return document.getElementById(domIds.graphEditPlane) as HTMLElement;
}

export function getDeskAreaElement() {
  return document.getElementById(domIds.deskArea) as HTMLElement;
}
