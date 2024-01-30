This is a remark plugin that adds [Obsidian](https://obsidian.md)-like
[callout syntax](https://help.obsidian.md/Editing+and+formatting/Callouts).

Note that this is *not* a transformer plugin. Instead,
under the hood it adds syntax extensions to 
[`micromark`](https://github.com/micromark/micromark), 
which is the markdown parser used in 
[`remark`](https://github.com/remarkjs/remark/tree/main).

Issues and pull requests are welcomed!

# Features

- Support nested callouts.

- Support markdown formatted elements inside your callout titles, for example, *code*, *emphasis*, *heading*, *math*, etc.

# Usage

## Installation
You can install this package via npm or pnpm.
```bash
# install using npm
npm install remark-callout

# install using pnpm
pnpm install remark-callout
```

## Usage

```ts
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

import remarkCallout from 'remark-callout';

const md = `
> [!warning] \`sudo rm -rf\` is *dangerous*!
> Although this simple command can help you easily remove a folder, this command should be used with extra care.
`;

const file = unified()
  .use(remarkParse)
  .use(remarkCallout)
  .use(remarkRehype)
  .use(rehypeStringify)
  .processSync(md);
console.log(String(file));
```

The generated HTML of the above code would be

```html
<blockquote class="callout warning">
  <div class="callout-title warning">
    <span class="callout-icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide-alert-triangle"
      >
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    </span>
    <p>
      <code>sudo rm -rf</code> is <em>dangerous</em>!
    </p>
  </div>
  <div class="callout-content">
    <p>
      Although this simple command can help you easily remove a folder, this
      command should be used with extra care.
    </p>
  </div>
</blockquote>
```

Class names are embedded in the generated HTML, 
so that CSS rules can be used to adjust the style.

### Customization Support

As can be seen from above, by default we `blockquote` element to hold the callout;
also, default icons are chosen for different callout types.
This can be changed by adding configurations.

You can pass configuration object to `remarkCallout`.
For example, to change the SVG string for the callout type `warning`,
you can change the above code to 
```ts
const config = {
    callouts: {
        warning: {
            svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alarm-clock"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3 2 6"/><path d="m22 6-3-3"/><path d="M6.38 18.7 4 21"/><path d="M17.64 18.67 20 21"/></svg>`
        }
    },
    calloutContainer: "div"
};

const file = unified()
  .use(remarkParse)
  .use(remarkCallout, config)
  .use(remarkRehype)
  .use(rehypeStringify)
  .processSync(md);
console.log(String(file));
```
Then, the generated HTML would be changed to
```html
<div class="callout warning">
  <div class="callout-title warning">
    <span class="callout-icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-alarm-clock"
      >
        <circle cx="12" cy="13" r="8"></circle>
        <path d="M12 9v4l2 2"></path>
        <path d="M5 3 2 6"></path>
        <path d="m22 6-3-3"></path>
        <path d="M6.38 18.7 4 21"></path>
        <path d="M17.64 18.67 20 21"></path>
      </svg>
    </span>
    <p>
      <code>sudo rm -rf</code> is <em>dangerous</em>!
    </p>
  </div>
  <div class="callout-content">
    <p>
      Although this simple command can help you easily remove a folder, this
      command should be used with extra care.
    </p>
  </div>
</div>
```

The configuration object is of type:
```ts
type SingleCalloutConfig = {
    svg?: string,
    // Will be embeded as inline style of the icon. Deprecated.
    // Only take effect when embedDefaultColor is set to true.
    // It is considered best to adjust the color using the provided class names
    // and CSS rules.
    color?: string
};

type Config = {
    callouts?: {
        note?: SingleCalloutConfig,
        tip?: SingleCalloutConfig,
        warning?: SingleCalloutConfig,
        abstract?: SingleCalloutConfig,
        info?: SingleCalloutConfig,
        todo?: SingleCalloutConfig,
        success?: SingleCalloutConfig,
        question?: SingleCalloutConfig,
        danger?: SingleCalloutConfig,
        bug?: SingleCalloutConfig,
        example?: SingleCalloutConfig,
        failure?: SingleCalloutConfig,
        quote?: SingleCalloutConfig
    },
    calloutContainer?: string,  // set the container element type for callouts
    embedDefaultColor?: boolean,   // defaults to false
    customClassNames?: string[],  // add more class names to the callout container
}
```

For unspecified parts, this package will use the default.
Please check *lib/config.ts* for `defaultConfig`.

### Example with CSS

```markdown
> [!note] Change $\alpha_k$ adaptively
> One way to increase the performance of our model is to let the optimizer change $\alpha_k$ adaptively.
```

The render result:
![callout-example-math](./img/callout-example-math.png)

Of course, you can adjust the CSS to make it appeal to your taste.

## Configuration

This plugin offers some default behavior, such as the callout icon and callout title.

Some customization can be achieved through configuration.

## Usage in Astro

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
In Obsidian, he above markdown segment will be rendered as
![obsidian-callout-example](./img/obsidian-callout-example.png)
which makes callouts more powerful and useful.

The plugins `@portaljs/remark-callouts` and `remark-obsidian-callouts` are actually 
[transformers](https://github.com/unifiedjs/unified#function-transformertree-file-next). 
In comparison, this plugin provides *syntax*, *html*, and *mdast util* extensions to let remark support callouts.

This plugin, in contrast, supports formatted elements inside a callout title.

# To do list

- [ ] Maybe Collapsible callouts?

# License

MIT license.
