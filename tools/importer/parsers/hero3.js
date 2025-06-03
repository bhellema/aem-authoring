/* global WebImporter */
export default function parse(element, { document }) {
  // Find the deepest content div
  const contentDiv = element.querySelector('div > div > div');
  if (!contentDiv) return;

  // Find the image (picture or img inside first <p>)
  let imageEl = null;
  const firstP = contentDiv.querySelector('p');
  if (firstP) {
    const picture = firstP.querySelector('picture');
    if (picture) {
      imageEl = picture;
    } else {
      const img = firstP.querySelector('img');
      if (img) imageEl = img;
    }
  }

  // Find the title (the first <p> that is not the image p)
  let titleEl = null;
  const children = Array.from(contentDiv.children);
  // Assume image is in a <p>, title is in the next <p>
  let foundImageP = false;
  for (let i = 0; i < children.length; i++) {
    if (children[i].tagName === 'P' && !foundImageP) {
      foundImageP = true;
      continue;
    }
    if (children[i].tagName === 'P' && foundImageP) {
      titleEl = children[i];
      break;
    }
  }
  // Fallback: if only one <p> and no image, treat it as title
  if (!titleEl && firstP && !firstP.querySelector('picture')) {
    titleEl = firstP;
  }

  // Convert title <p> to <h1> for semantic meaning
  let headingEl = null;
  if (titleEl) {
    headingEl = document.createElement('h1');
    headingEl.innerHTML = titleEl.innerHTML;
  }

  // Build the block content array
  const contentArr = [];
  if (imageEl) contentArr.push(imageEl);
  if (headingEl) contentArr.push(headingEl);

  const cells = [
    ['Hero'],
    [contentArr]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
