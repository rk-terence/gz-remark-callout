import type {
  CompileContext,
  Extension,
  Handle,
  Token
} from 'mdast-util-from-markdown';
import type {
  Options,
  State,
  Info
} from 'mdast-util-to-markdown';
import type {
  Parents,
  Paragraph
} from 'mdast';
import { parse } from 'svg-parser';

import type { 
  Callout,
} from './types.js';
import { determineCalloutType } from './config.js';
import type { ConfigFull } from './config.js';

export function calloutFromMarkdown(config: ConfigFull): Extension {
  let calloutTypeText: string = "note";
  return {
    enter: {
      callout(this: CompileContext, token: Token) {
        this.enter({
          type: 'callout',
          children: [],
          data: { 
            hName: config.calloutContainer,
            hProperties: { className: ['callout', ...config.customClassNames] }
          }
        }, token);
      },
      calloutTitle(this: CompileContext, token: Token) {
        // The default callout type is "note".
        const meta = config.callouts[calloutTypeText];
        const svgHast = parse(meta.svg);

        // modify the callout node to add a className.
        const callout = this.stack[this.stack.length - 1];
        ((callout.data as any).hProperties.className as string[])
            .push(calloutTypeText!);

        this.enter({
          type: 'calloutTitle',
          children: [
            {
              type: 'element' as any,
              data: {
                hName: 'span',
                hProperties: { 
                  className: ['callout-icon'], 
                  style: config.embedDefaultColor ?  `color: ${meta.color}` : undefined,
                },
                hChildren: svgHast.children as any
              }
            }
          ],
          data: {
            hName: 'div',
            hProperties: { 
              className: ['callout-title', calloutTypeText!] 
            } 
          }
        }, token);

        calloutTypeText = "note";
      },
      calloutContent(this: CompileContext, token: Token) {
        this.enter({
          type: 'calloutContent',
          children: [],
          data: {
            hName: 'div',
            hProperties: { className: ['callout-content'] }
          }
        }, token);
      }
    },
    exit: {
      callout(this: CompileContext, token: Token) {
        this.exit(token);
      },
      calloutTypeText(this: CompileContext, token: Token) {
        const type = this.sliceSerialize(token).toLowerCase();
        calloutTypeText = determineCalloutType(type);
      },
      calloutTitle(this: CompileContext, token: Token) {
        this.exit(token);
      },
      calloutContent(this: CompileContext, token: Token) {
        this.exit(token);
      }
    }
  }
}

export function calloutToMarkdown(): Options {
  return {
    handlers: {
      callout(node: Callout, parent: Parents, state: State, info: Info) {
        const exit = state.enter('callout');
        const tracker = state.createTracker(info);
        tracker.move('> ');
        tracker.shift(2);
        const value = state.indentLines(
          state.containerFlow(node, tracker.current()),
          (line, _, blank) => '>' + (blank ? '': ' ') + line
        );
        exit()
        return value;
      },
      calloutTitle(node: Callout, parent: Parents, state: State, info: Info) {
        // Get the type of this callout.
        const type = (node.data as any).hProperties.className[1] as string;
        const typeString = `[!${type}]`;
        const titleString = state.containerPhrasing(
          // We know that the second children of calloutTitle
          // is a flow element node by construction of this mdast,
          // and which children are phrasing elements.
          node.children[1] as Paragraph, 
          info
        );
        const value = typeString + (titleString ? ' ' : '') + titleString;
        return value;
      },
      calloutContent(
        node: Callout, 
        parent: Parents, 
        state: State, 
        info: Info
      ) {
        const value = state.containerFlow(node, info)
        return value;
      }
    }
  }
}
