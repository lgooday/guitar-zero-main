export function getById<T extends HTMLElement = HTMLElement>(
  id: string,
  root: Document = document
) {
  return root.getElementById(id) as T;
}

export function createSelectOption(
  caption: string,
  value: string = caption
): HTMLOptionElement {
  const option = document.createElement("option");
  option.text = caption;
  option.value = value;
  return option;
}

export function createEl<T extends HTMLElement>(el: string) {
  return document.createElement(el) as T;
}

export function time(duration: number) {
  // Hours, minutes and seconds
  const hrs = ~~(duration / 3600);
  const mins = ~~((duration % 3600) / 60);
  const secs = ~~duration % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  let ret = "";

  if (hrs > 0) {
    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }

  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + secs;

  return ret;
}
