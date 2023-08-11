import type { Plugin } from 'unified';
import type { Options } from 'hast-util-to-html';
import { micromark, preprocess, parse, postprocess, compile } from 'micromark';
import { math, mathHtml } from 'micromark-extension-math';
import { mathFromMarkdown, mathToMarkdown } from 'mdast-util-math';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { toMarkdown } from 'mdast-util-to-markdown';
import { toHast } from 'mdast-util-to-hast'
import { toHtml } from 'hast-util-to-html'
import { remark } from 'remark';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import remarkObsidianCallout from 'remark-obsidian-callout';

import { callout } from './lib/micromark-syntax.js';
import { calloutHtml } from './lib/micromark-html.js';
import { 
  calloutFromMarkdown
} from './lib/mdast-util.js';
import remarkCallout from './index.js';

// Use self-defined rehypeStringify to avoid TS compile error, see:
// https://github.com/rehypejs/rehype/issues/147
const rehypeStringify: Plugin = function (config) {
  const processorSettings = this.data('settings');
  const settings = Object.assign({}, processorSettings, config)

  Object.assign(this, {Compiler: compiler})

  /**
   * @type {import('unified').CompilerFunction<Node, string>}
   */
  function compiler(tree: any) {
    return toHtml(tree, settings)
  }
}

const md = `
# A title

First we try ordinary callouts

> [!note] This is my title.
> content.

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

// test toMarkdown
// const md_ = toMarkdown(mdast, {
//     extensions: [calloutToMarkdown, mathToMarkdown],
// });
// console.log("toMarkdown:");
// console.log(md_);

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

// test remark-obsidian-callout
// const file_ = unified()
//   .use(remarkParse)
//   .use(remarkMath)
//   .use(remarkObsidianCallout)
//   .use(remarkRehype, { allowDangerousHtml: true })
//   .use(rehypeStringify, { allowDangerousHtml: true })
//   .processSync(md);
// console.log("remark-obsidian-callout:");
// console.log(String(file_));