import { getHtmlElementById } from "@lib/utils/dom-helper";

export const uiConstants = {
  minScaling: 0.1,
  maxScaling: 2,
};

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
  getGraphEditPlane() {
    return getHtmlElementById(domIds.graphEditPlane);
  },
};
