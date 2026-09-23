export const domIds = {
  // deskArea: "domDeskArea",
  boardPlane: "domBoardPlane",
  graphEditPlane: "domGraphEditPlane",
};

export const domGetters = {
  // getDomDeskArea(){
  //   return document.getElementById(domIds.deskArea) as HTMLElement;
  // },
  getDomBoardPlane() {
    return document.getElementById(domIds.boardPlane) as HTMLElement;
  },
  getGraphEditPlane() {
    return document.getElementById(domIds.graphEditPlane) as HTMLElement;
  },
};
