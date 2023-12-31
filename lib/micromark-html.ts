/**
 * HTML extension for micromark.
 * 
 * DEPRECATED: as this package is mainly served as a remark plugin,
 * this file is currently not maintained.
 */
import type {
  HtmlExtension,
  Token,
  CompileContext
} from 'micromark-util-types';

export function calloutHtml(): HtmlExtension {
  return {
    enter: {
      'callout': function (this: CompileContext, token: Token) {
        this.tag('<blockquote class="callout">');
      },
      'calloutTitle': function (this: CompileContext, token: Token) {
        this.tag(
          `<div class="callout-title ${this.getData('calloutTypeText')}">`
        );
      }
    },
    exit: {
      'callout': function (this: CompileContext, token: Token) {
        this.tag('</div>')
        this.tag('</blockquote>');
      },
      'calloutTitle': function (this: CompileContext, token: Token) {
        this.tag('</div>');
        this.tag('<div class="callout-content">');
      },
      'calloutTypeText': function (this: CompileContext, token: Token) {
        const type = this.sliceSerialize(token).toLowerCase();
        this.setData('calloutTypeText', type);
      },
    }
  }
}
