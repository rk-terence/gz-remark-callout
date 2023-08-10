import type {
  CompileContext,
  Extension,
  Handle,
  Token
} from 'mdast-util-from-markdown';
import type {
  Options,
} from 'mdast-util-to-markdown';

import { calloutTypes } from './calloutTypes.js';

export function calloutFromMarkdown(): Extension {
  let calloutTypeText: string;
  return {
    enter: {
      callout(this: CompileContext, token: Token) {
        this.enter({
          type: 'callout',
          children: [],
          data: { 
            hName: 'blockquote',
            hProperties: { className: ['callout'] }
          }
        }, token);
      },
      calloutTitle(this: CompileContext, token: Token) {
        const meta = calloutTypes[calloutTypeText];
        const icon: { type: 'html', value: string } = {
          type: 'html',
          value: `<span class="callout-icon" style="color: ${meta.color}">${meta.svg}</span>`
        };
        this.enter({
          type: 'calloutTitle',
          children: [icon],
          data: {
            hName: 'div',
            hProperties: { 
              className: ['callout-title', calloutTypeText] 
            } 
          }
        }, token);
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
        calloutTypeText = undefined;
      },
      calloutContent(this: CompileContext, token: Token) {
        this.exit(token);
      }
    }
  }
}

function determineCalloutType(type: string) {
  if (type in calloutTypes) {
    if (typeof calloutTypes[type] === 'string') {
      return calloutTypes[type];
    }
    return type;
  }
  return 'note';
}