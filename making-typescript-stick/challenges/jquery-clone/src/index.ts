import fetch from "node-fetch";

class SelectorResult {
  #elements;
  constructor(element: NodeListOf<Element>) {
    this.#elements = element;
  }

  html(content: string) {
    // literate over everytihng we found
    this.#elements.forEach((el) => {
      // set contents equal to string we were given
      el.innerHTML = content;
    });
  }

  on<K extends keyof HTMLElementEventMap>(
    eventName: K,
    clBack: (event: HTMLElementEventMap[K]) => void
  ) {
    this.#elements.forEach((el) => {
      const htmlElem = el as HTMLElement;
      htmlElem.addEventListener(eventName, clBack);
    });
  }
  show() {
    this.#elements.forEach((el) => {
      const htmlElem = el as HTMLElement;
      htmlElem.style.visibility = "visible";
    });
  }
  hide() {
    this.#elements.forEach((el) => {
      const htmlElem = el as HTMLElement;
      htmlElem.style.visibility = "hidden";
    });
  }
}

function $(selector: string) {
  return new SelectorResult(document.querySelectorAll(selector));
}

namespace $ {
  export function ajax({
    url,
    success,
  }: {
    url: string;
    success: (data: any) => void;
  }): any {
    return fetch(url)
      .then((resp) => resp.json())
      .then(success);
  }
}

export default $;
