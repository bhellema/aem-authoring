/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero block (works if passed .hero-wrapper or the .hero block itself)
  let heroBlock = element;
  if (!heroBlock.classList.contains('hero')) {
    const candidate = element.querySelector(':scope > .hero.block');
    if (candidate) heroBlock = candidate;
  }

  // Find the innermost content div
  let contentDiv = heroBlock;
  while (contentDiv && contentDiv.children.length === 1 && contentDiv.firstElementChild.tagName === 'DIV') {
    contentDiv = contentDiv.firstElementChild;
  }

  // Find all direct <p> children (some may contain images, some text)
  const ps = contentDiv.querySelectorAll(':scope > p');
  let imagePara = null;
  let titlePara = null;

  if (ps.length > 0) imagePara = ps[0];
  if (ps.length > 1) titlePara = ps[1];

  // If the title is present, convert it to a heading (H1) for semantic meaning
  let headingElem = null;
  if (titlePara) {
    headingElem = document.createElement('h1');
    headingElem.innerHTML = titlePara.innerHTML;
  }

  // Compose the single cell content as [image element, heading element] per order in source
  const cellContent = [];
  if (imagePara) cellContent.push(imagePara);
  if (headingElem) cellContent.push(headingElem);

  // Table structure: header, then one cell containing the whole hero content
  const cells = [
    ['Hero'],
    [cellContent],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
