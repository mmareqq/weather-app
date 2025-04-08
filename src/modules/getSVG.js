export async function appendSVG(url, targetEl) {
   const response = await fetch(url);
   const svgText = await response.text();
   targetEl.innerHTML = svgText;
}

export async function getSVG(url) {
   const response = await fetch(url);
   const svgText = await response.text();
   return svgText;
}
