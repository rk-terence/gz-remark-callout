import { micromark, preprocess, parse, postprocess, compile } from 'micromark';
import { math, mathHtml } from 'micromark-extension-math';
import { mathFromMarkdown } from 'mdast-util-math';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { toHast } from 'mdast-util-to-hast'
import { toHtml } from 'hast-util-to-html'
import { remark } from 'remark';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

import { callout } from './lib/micromark-syntax.js';
import { calloutHtml } from './lib/micromark-html.js';
import { calloutFromMarkdown } from './lib/mdast-util.js';
import remarkCallout from './index.js';

const md = `
> [!note] This is my title with code: \`a = b\`
> content.
> 
> Another paragraph.

> [!warning] # A warning!
> Here is Why:
> $$
> a^2 + b^2 = c^2
> $$

OK! Next we will try nested callouts.
> [!tldr] TL? DR.
> > [!note] A nested one.
> > This one has contents.

No more callouts.
`;

// Test micromark
const options = {
  extensions: [math(), callout()], 
  htmlExtensions: [mathHtml(), calloutHtml()],
  allowDangerousHtml: true,
}

const preprocessed = preprocess()(md, undefined, true);
console.log("Preprocessed:");
console.log(preprocessed);

const parsed = parse(options).document().write(preprocessed);
console.log("Parsed:");
console.log(parsed);

const postprocessed = postprocess(parsed);
console.log("Postprocessed:");
console.log(postprocessed);

const compiled = compile(options)(postprocessed);
console.log("Compiled:");
console.log(compiled);


// test fromMarkdown
const mdast = fromMarkdown(md, {
  extensions: [callout(), math()],
  mdastExtensions: [calloutFromMarkdown(), mathFromMarkdown()],
});
console.log("mdast:");
console.log(mdast);

const hast = toHast(mdast);
console.log("hast:");
console.log(hast);

console.log("html:")
const html = toHtml(hast);
console.log(html);

// test remark
const file = unified()
  .use(remarkParse)
  .use(remarkMath)
  .use(remarkCallout)
  .use(remarkRehype)
  .use(rehypeStringify)
  .processSync(md);
console.log("remark:");
console.log(String(file));
