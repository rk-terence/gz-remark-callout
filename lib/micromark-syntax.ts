/*
 * Syntax extension for micromark.
 */
import { codes, constants } from 'micromark-util-symbol';
import { factorySpace } from 'micromark-factory-space';
import { asciiAlpha, markdownLineEnding, markdownSpace } from 'micromark-util-character';

import type {
    Construct,
    Effects,
    State,
    TokenizeContext,
    Code,
    Extension
} from 'micromark-util-types';

const calloutConstruct: Construct = {
    name: 'callout',
    tokenize: tokenizeCalloutStart,
    continuation: { tokenize: tokenizeCalloutContinuation },
    exit: exitCallout,
    // precedes blockquote
    add: 'before'
}

export function callout(): Extension {
    return {
        document: { [codes.greaterThan]: calloutConstruct }
    }
}

function tokenizeCalloutStart (
    this: TokenizeContext, 
    effects: Effects, 
    ok: State, 
    nok: State
): State {
    const self = this;
    return start;

    function start (code: Code) {
        if (code === 62) {
            const state = self.containerState!;
            // Do not use blockquote's "open", use customized "calloutOpen".
            // Otherwise, blockquotes will be affected.
            effects.enter('callout', { _container: true });
            state.calloutOpen = true;

            effects.enter('calloutPrefix');
            effects.enter('calloutGreaterThanMark');
            effects.consume(code);
            effects.exit('calloutGreaterThanMark');
            return after;
        }

        return nok(code);
    }

    function after(code: Code) {
        if (markdownSpace(code)) {
            effects.enter('calloutPrefixWhitespace');
            effects.consume(code);
            effects.exit('calloutPrefixWhitespace');
            return typeMarkerLeft;
        }
        return typeMarkerLeft(code);
    }

    function typeMarkerLeft(code: Code) {
        if (code === codes.leftSquareBracket) {
            effects.enter('calloutType');
            effects.enter('calloutTypeMarkerLeft');
            effects.consume(code);
            effects.exit('calloutTypeMarkerLeft');
            return exclaminationMark;
        }

        return nok(code);
    }

    function exclaminationMark(code: Code){
        if (code === codes.exclamationMark) {
            effects.enter('calloutExclamationMark');
            effects.consume(code);
            effects.exit('calloutExclamationMark');

            effects.enter('calloutTypeText');
            return type;
        }

        return nok(code);
    }

    function type(code: Code) {
        if (code === codes.rightSquareBracket) {
            effects.exit('calloutTypeText');
            effects.enter('calloutTypeMarkerRight');
            effects.consume(code);
            effects.exit('calloutTypeMarkerRight');
            effects.exit('calloutType');

            return afterTypePotentialWhitespace;
        }

        if (asciiAlpha(code)) {
            effects.consume(code);
            return type;
        }

        return nok(code);
    }

    function afterTypePotentialWhitespace(code: Code){
        if (markdownSpace(code)) {
            effects.enter('calloutPrefixWhitespace');
            effects.consume(code);
            effects.exit('calloutPrefixWhitespace');
            effects.exit('calloutPrefix');

            effects.enter('calloutTitle');
            effects.enter('calloutTitleChunk', {
                _tokenizer: self.parser.flow(self.now()),
                contentType: constants.contentTypeFlow
            });
            return insideTitle;
        }

        effects.enter('calloutTitle');
        effects.enter('calloutTitleChunk', {
            _tokenizer: self.parser.flow(self.now()),
            contentType: constants.contentTypeFlow
        });
        return insideTitle(code);
    }

    function insideTitle(code: Code) {
        if (markdownLineEnding(code) || code === codes.eof) {
            const token = effects.exit('calloutTitleChunk');

            const stream = self.sliceStream(token);
            // eof, because we have finished the title.
            stream.push(null);
            token._tokenizer!.write(stream);

            effects.exit('calloutTitle');
            return ok(code);
        }

        effects.consume(code);
        return insideTitle;
    }
}

function tokenizeCalloutContinuation(
    this: TokenizeContext,
    effects: Effects,
    ok: State,
    nok: State
): State {
    const self = this;
    return contStart;

    function contStart(code: Code) {
        const state = self.containerState;
        if (!state!.calloutContentStarted) {
            effects.enter('calloutContent');
        }
        if (markdownSpace(code)) {
            return factorySpace(
                effects,
                contBefore,
                'linePrefix',
                self.parser!.constructs!.disable!.null!.includes('codeIndented')
                    ? undefined
                    : 4
            )(code)
        }
        return contBefore(code)
    }

    function contBefore(code: Code) {
        if (code === 62) {
            effects.enter('calloutPrefix');
            effects.enter('calloutGreaterThanMark');
            effects.consume(code);
            effects.exit('calloutGreaterThanMark');
            return contAfter;
        }

        return nok(code);
    }

    function contAfter(code: Code) {
        const state = self.containerState!;
        state.calloutContentStarted = true;
        if (markdownSpace(code)) {
            effects.enter('calloutPrefixWhitespace');
            effects.consume(code);
            effects.exit('calloutPrefixWhitespace');
            effects.exit('calloutPrefix');
            return ok;
        }

        effects.exit('calloutPrefix');
        return ok(code);
    }
}

function exitCallout (this: TokenizeContext, effects: Effects): undefined {
    const state = this.containerState!;
    if (state.calloutContentStarted) {
        effects.exit('calloutContent');
    }
    effects.exit('callout');
}
