export function createEl(el, classes) {
   const element = document.createElement(`${el}`);
   if (!element) throw new Error('Something wrong with el creation');
   if (!classes) return element;
   element.setAttribute('class', classes);
   return element;
}

export function appendEl(parent, child, classList, text) {
   if (!parent || !child) throw new Error('Parent or child missing');
   child = createEl(child, classList);
   if (text) child.textContent = text;
   parent.appendChild(child);
   return child;
}
