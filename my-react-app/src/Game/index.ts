import { Source, ElementKey } from "./type";
import { Element } from "./element";

const metaSources: Record<ElementKey, Source> = {
  T: [
    [1, 1, 1],
    [0, 1],
  ],
  L: [[1], [1], [1, 1]],
  I: [[1], [1], [1], [1]],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
};

const elementKeys = Object.keys(metaSources);

let currentElement = new Element(metaSources["T"]);
console.log(currentElement);

function updateKey(key: ElementKey) {
  currentElement = new Element(metaSources[key]);
}

export { updateKey, elementKeys, currentElement };
