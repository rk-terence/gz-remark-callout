import { describe, expect, test } from "@jest/globals";
import { fromMarkdown } from "mdast-util-from-markdown";
import { toMarkdown } from "mdast-util-to-markdown";
import { toHast } from "mdast-util-to-hast";
import { toHtml } from "hast-util-to-html";
import { remark } from "remark";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import { minify } from "html-minifier";
import type { Plugin } from "unified";

import { callout } from "../lib/micromark-syntax";
import { calloutFromMarkdown, calloutToMarkdown } from "../lib/mdast-util";
import remarkCallout from "../index";
import { Config, ConfigFull, mergeWithDefault } from "../lib/config";

// Use self-defined rehypeStringify to avoid TS compile error, see:
// https://github.com/rehypejs/rehype/issues/147
const rehypeStringify: Plugin = function (config: any) {
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

const mdBlockquote = `
# Try blockquotes

Normal blockquote should not be affected.

> This is a blockquote.

> This is a nested blockquote
> 
> > I am the nested one.
> > > I nest further!
> > > 
> > > Haha.

`;
const htmlBlockquote = `
<h1>Try blockquotes</h1>                                                                      

<p>Normal blockquote should not be affected.</p>                                              

<blockquote>                                                                                  
    <p>This is a blockquote.</p>                                                                  
</blockquote>                                                                                 

<blockquote>                                                                                  
    <p>This is a nested blockquote</p>                                                            
    <blockquote>                                                                                  
        <p>I am the nested one.</p>                                                                   
        <blockquote>                                                                                  
            <p>I nest further!</p>                                                                        
            <p>Haha.</p>                                                                                  
        </blockquote>                                
    </blockquote>                                                                                 
</blockquote>
`;

const mdCalloutOrdinary = `
# Try ordinary callouts

> [!note] This is my title.
> content.

> [!note] This is my title with code: \`a = b\`
> content.
> 
> Another paragraph.

> [!warning] # A warning! <div>Hello</div>
> Here is Why: just a warning.

`;
const htmlCalloutOrdinary = `
<h1>Try ordinary callouts</h1>                                                                

<blockquote class="callout custom-class-1 custom-class-2 note">
    <div class="callout-title note">
        <span class="callout-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-pencil"><line x1="18" y1="2" x2="22" y2="6"></line><path d="M7.5 20.5 19 9l-4-4L3.5 16.5 2 22z"></path></svg>
        </span>
        <p>This is my title.</p>
    </div>
    <div class="callout-content">
        <p>content.</p>
    </div>
</blockquote>         

<blockquote class="callout custom-class-1 custom-class-2 note">
    <div class="callout-title note">
        <span class="callout-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-pencil"><line x1="18" y1="2" x2="22" y2="6"></line><path d="M7.5 20.5 19 9l-4-4L3.5 16.5 2 22z"></path></svg>
        </span>
        <p>This is my title with code: <code>a = b</code>
        </p>
    </div>
    <div class="callout-content">
        <p>content.</p>
        <p>Another paragraph.</p>
    </div>
</blockquote>    

<blockquote class="callout custom-class-1 custom-class-2 warning">
    <div class="callout-title warning">
        <span class="callout-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-alert-triangle"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        </span>
        <h1>A warning! Hello</h1>
    </div>
    <div class="callout-content">
        <p>Here is Why: just a warning.</p>
    </div>
</blockquote>
`;

const mdCalloutNested = `
# Try nested callouts

> [!tldr] TL? DR.
> > [!note] A nested one.
> > This one has contents.

`;
const htmlCalloutNested = `
<h1>Try nested callouts</h1>                 
<blockquote class="callout custom-class-1 custom-class-2 abstract">
    <div class="callout-title abstract">
        <span class="callout-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-clipboard-list"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"></path><path d="M12 11h4"></path><path d="M12 16h4"></path><path d="M8 11h.01"></path><path d="M8 16h.01"></path></svg>
        </span>
        <p>TL? DR.</p>
    </div>
    <div class="callout-content">
        <blockquote class="callout custom-class-1 custom-class-2 note">
            <div class="callout-title note">
                <span class="callout-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-pencil"><line x1="18" y1="2" x2="22" y2="6"></line><path d="M7.5 20.5 19 9l-4-4L3.5 16.5 2 22z"></path></svg>
                </span>
                <p>A nested one.</p>
            </div>
            <div class="callout-content">
                <p>This one has contents.</p>
            </div>
        </blockquote>
    </div>
</blockquote>
`;


let config: Config = {
    callouts: {
        note: {
            color: "#000000",
        },
        danger: {
            svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alarm-clock"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3 2 6"/><path d="m22 6-3-3"/><path d="M6.38 18.7 4 21"/><path d="M17.64 18.67 20 21"/></svg>`
        }
    },
    customClassNames: ["custom-class-1", "custom-class-2"],
    embedDefaultColor: false,
};

const configFull = mergeWithDefault(config);

describe("From and to markdown utility should work as expected", () => {
    function testFromAndToMarkdown(md: string, config: ConfigFull, html: string) {
        // from markdown
        const mdast = fromMarkdown(md, {
            extensions: [callout()],
            mdastExtensions: [calloutFromMarkdown(config)],
        });

        const hast = toHast(mdast);

        const htmlFromMarkdown = toHtml(hast);

        // to markdown
        const md_ = toMarkdown(mdast, {
            extensions: [calloutToMarkdown()],
        });

        testHtmlEqual(htmlFromMarkdown, html);
    }


    test("Do not affect normal blockquote", () => {
        testFromAndToMarkdown(mdBlockquote, configFull, htmlBlockquote);
    });

    test("ordinary callout", () => {
        testFromAndToMarkdown(mdCalloutOrdinary, configFull, htmlCalloutOrdinary);
    });

    test("Nested callout", () => {
        testFromAndToMarkdown(mdCalloutNested, configFull, htmlCalloutNested);
    });

});

describe("It should work in the unified ecosystem", () => {
    function testUnified(md: string, html: string) {
        const file = unified()
            .use(remarkParse)
            .use(remarkMath)
            .use(remarkCallout, configFull)
            .use(remarkRehype)
            .use(rehypeStringify)
            .processSync(md);
        const htmlUnified = String(file);


        // remark alone
        const htmlRemark = String(
            remark().use(remarkMath).use(remarkCallout, configFull).processSync(md)
        );

        testHtmlEqual(htmlUnified, html);
    }

    test("Do not affect normal blockquote", () => {
        testUnified(mdBlockquote, htmlBlockquote);
    });

    test("ordinary callout", () => {
        testUnified(mdCalloutOrdinary, htmlCalloutOrdinary);
    });

    test("Nested callout", () => {
        testUnified(mdCalloutNested, htmlCalloutNested);
    });

});


function testHtmlEqual(html1: string, html2: string) {
    expect(minify(html1, {collapseWhitespace: true})).toStrictEqual(minify(html2, {collapseWhitespace: true}));
}

