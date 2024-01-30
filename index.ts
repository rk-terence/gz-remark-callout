import type { Processor } from 'unified';

import { callout } from './lib/micromark-syntax.js';
import { 
  calloutFromMarkdown,
  calloutToMarkdown
} from './lib/mdast-util.js';
import { mergeWithDefault } from './lib/config.js';
import type { Config } from "./lib/config.js";
export type { Config } from "./lib/config.js";

export default function remarkCallout (this: Processor, config: Config = {}) {
  const data = this.data();

  const configFull = mergeWithDefault(config);

  add('micromarkExtensions', callout());
  add('fromMarkdownExtensions', calloutFromMarkdown(configFull));
  add('toMarkdownExtensions', calloutToMarkdown());

  function add(field: string, value: unknown) {
    const list: any = (
      data[field] ? data[field] : (data[field] = [])
    )

    list.push(value)
  }
}

