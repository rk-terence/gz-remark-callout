This is a remark plugin that adds [Obsidian](https://obsidian.md)-like [callout syntax](https://help.obsidian.md/Editing+and+formatting/Callouts).

Note that this is *not* a transformer plugin. Instead,
under the hood it adds syntax extensions to 
[`micromark`](https://github.com/micromark/micromark), 
which is the markdown parser used in 
[`remark`](https://github.com/remarkjs/remark/tree/main).

Issues and pull requests are welcomed!

# Features

- Support nested callouts.
- Support markdown formatted elements (such as block math, heading, etc.) inside callout title

# Usage

## Installation
You can install this package via npm or pnpm.
```bash
# install using npm
npm install remark-callout

# install using pnpm
pnpm install remark-callout
```

## Usage example

```ts
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

import remarkCallout from 'remark-callout';

const file = unified()
  .use(remarkParse)
  .use(remarkCallout)
  .use(remarkRehype)
  .use(rehypeStringify)
  .processSync(md);
console.log("remark:");
console.log(String(file));
```

For example, if we have a markdown string
```markdown
> [!note] This is my title with code: `a = b`
> content.
> 
> Another paragraph.
```
the generated HTML would be like
```html
<blockquote class="callout">
  <div class="callout-title note">
    <span class="callout-icon" style="color: #448aff">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-pencil"><line x1="18" y1="2" x2="22" y2="6"></line><path d="M7.5 20.5 19 9l-4-4L3.5 16.5 2 22z"></path></svg>
    </span>
    <p>This is my title with code: 
      <code>a = b</code>
    </p>
  </div>
  <div class="callout-content">
    <p>content.</p>
    <p>Another paragraph.</p>
  </div>
</blockquote>
```

### Usage in Astro

As this is a remark plugin, you can easily add this into your Astro project.
Just add this plugin into `astro.config.mjs` file, inside the `remarkPlugins` property.

# Why this one?

There are some existing remark plugins for Obsidian-like callouts, including
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

But inside Obsidian, callouts' titles are parsed as formatted elements,
and as a result it supports including *heading*, *code segments*, *math*, etc.
in the callout title:
```markdown
> [!note] ##### The *Euler* formula: $e^{i \pi} + 1 = 0$
> As we know, the Euler formula is ...
```
The above markdown segment will be rendered as
![obsidian-callout-example](./img/obsidian-callout-example.png)
which makes callouts more powerful and useful.

The plugins `@portaljs/remark-callouts` and `remark-obsidian-callouts` are actually 
[transformers](https://github.com/unifiedjs/unified#function-transformertree-file-next). 
In comparison, this plugin provides *syntax*, *html*, and *mdast util* extensions to let remark support callouts.

This plugin, in contrast, supports formatted elements inside a callout title.

# To do list

- [ ] Maybe ollapsible callouts?

# License

MIT license.
