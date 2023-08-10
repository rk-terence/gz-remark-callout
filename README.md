**This plugin is being developed.**

# To do list

- [ ] to markdown extension of callout.
- [ ] write a css file to import.

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
  .use(remarkRehype, {allowDangerousHtml: true})
  .use(rehypeStringify, { allowDangerousHtml: true })
  .processSync(md);
console.log("remark:");
console.log(String(file));
```

# Why this one?

There is one existing remark plugin for Obsidian-like callouts,
[`@portaljs/callouts`](https://www.npmjs.com/package/@portaljs/remark-callouts),
the behavior of this plugin is not satisfactory for me, though.
In fact, `@portaljs/callouts`'s callouts only support plain text callout title,
such as
```markdown
> [!note] This is a plain text title.
> blablabla...
```
But inside Obsidian, callouts' titles are parsed as a "flow" element,
and as a result it supports including *heading*, *code segments*, *math*, etc.
in the callout title:
```markdown
> [!note] ## The *Euler* formula: $ e^{i \pi} + 1 = 0 $
> As we know, the Euler formula is ...
```
The above markdown segment will be rendered as
<img width="696" alt="image" src="https://github.com/rk-terence/gz-remark-callout/assets/28799257/7dbfd1e4-392a-4259-8e72-5fd25e2ef537">
which is more powerful and useful.

The `@portaljs/callouts` plugin is actually a transformer. In comparison, this plugin
provides *syntax*, *html*, and *mdast util* extensions to let remark support callouts.

# License

MIT license.
