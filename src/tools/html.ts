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
