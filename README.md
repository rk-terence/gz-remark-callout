**This plugin is being developed.**

# To do list

- [ ] tomarkdown extension of callout.
- [ ] write a css file to import.
- [ ] Collapsible callouts?

This is a remark plugin that adds obsidian-like callout syntax.
Note that this is *not* a transformer plugin. Instead,
under the hood it adds syntax extensions to micromark, which is the markdown parser used in remark-parse.

Issues and pull requests are welcomed.

# Usage

Example:
```ts
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

import remarkCallout from '@gz/remark-callout';

const file = unified()
  .use(remarkParse)
  .use(remarkCallout)
  .use(remarkRehype)
  .use(rehypeStringify)
  .processSync(md);
console.log("remark:");
console.log(String(file));
```

## Usage in Astro

As this is a remark plugin, you can easily add this into your Astro project.
Just add this plugin into `astro.config.mjs` file, inside the `remarkPlugins` property.

# Why this one?

There is some existing remark plugins for Obsidian-like callouts, including
[`@portaljs/remark-callouts`](https://www.npmjs.com/package/@portaljs/remark-callouts),
[`remark-callouts`](https://www.npmjs.com/package/remark-callouts), and
[`remark-obsidian-callout`](https://www.npmjs.com/package/remark-obsidian-callout).
The behavior of these plugins is not satisfactory for me, though.
In fact, `@portaljs/remark-callouts`'s callouts only support plain text callout title
(to my knowledge, `remark-callouts` is the same but deprecated version of `@portaljs/remark-callouts`),
such as
```markdown
> [!note] This is a plain text title.
> blablabla...
```
And `remark-obsidian-callout` will transform formatted text into plain text that is in the callout title.

But inside Obsidian, callouts' titles are parsed as a "flow" element,
and as a result it supports including *heading*, *code segments*, *math*, etc.
in the callout title:
```markdown
> [!note] ## The *Euler* formula: $ e^{i \pi} + 1 = 0 $
> As we know, the Euler formula is ...
```
The above markdown segment will be rendered as
<img width="696" alt="image" src="https://github.com/rk-terence/gz-remark-callout/assets/28799257/7dbfd1e4-392a-4259-8e72-5fd25e2ef537">
which makes callouts more powerful and useful.

The plugins `@portaljs/remark-callouts` and `remark-obsidian-callouts` are actually 
[transformers](https://github.com/unifiedjs/unified#function-transformertree-file-next). 
In comparison, this plugin provides *syntax*, *html*, and *mdast util* extensions to let remark support callouts.

# License

MIT license.
