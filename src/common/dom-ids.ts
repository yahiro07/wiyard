import { getHtmlElementById } from "@lib/utils/dom-helper";

export const domIds = {
  // deskArea: "domDeskArea",
  boardPlane: "domBoardPlane",
  graphEditPlane: "domGraphEditPlane",
};

export const domGetters = {
  // getDomDeskArea(){
  //   return getHtmlElementById(domIds.deskArea);
  // },
  getDomBoardPlane() {
    return getHtmlElementById(domIds.boardPlane);
  },
  getDomGraphEditPlane() {
    return getHtmlElementById(domIds.graphEditPlane);
  },
};
