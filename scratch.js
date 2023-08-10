import { micromark, preprocess, parse, postprocess, compile } from 'micromark';
import { math, mathHtml } from 'micromark-extension-math';

const md = `
# Hello! $$ a^2 $$ <strong>abc</strong>

  > A blockquote
  > with two lines.

> blockquote
Lazy line.

<strong>
abc
</strong>

$$
a^2
$$

$$ a^2 $$
`;
const options = {
  extensions: [math()], 
  htmlExtensions: [mathHtml()],
  allowDangerousHtml: true,
}

const preprocessed = preprocess()(md, undefined, true);
console.log("Preprocessed:");
console.log(preprocessed);

const parsed = parse(options).document().write(preprocessed);
console.log("Parsed:");
console.log(parsed);

const postprocessed = postprocess(parsed);
console.log("Postprocessed:");
console.log(postprocessed);

const compiled = compile(options)(postprocessed);
console.log("Compiled:");
console.log(compiled);