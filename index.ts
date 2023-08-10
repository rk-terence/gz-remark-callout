import type { Processor } from 'unified';

import { callout } from './lib/micromark-syntax.js';
import { calloutFromMarkdown } from './lib/mdast-util.js';

export default function remarkCallout (this: Processor) {
  const data = this.data();

  add('micromarkExtensions', callout());
  add('fromMarkdownExtensions', calloutFromMarkdown());

  function add(field: string, value: unknown) {
    const list: any = (
      data[field] ? data[field] : (data[field] = [])
    )

    list.push(value)
  }
}
