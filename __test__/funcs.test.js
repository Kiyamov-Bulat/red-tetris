import randomChoice from "../src/utils/randomChoice";
import {expect} from '@jest/globals';
import toBeWithinRange from "./helpers/toBeWithinRange";

expect.extend({
    toBeWithinRange,
});

describe('funcs', () => {
    it('randomChoice', () => {
        const arr = [1, 2, 3, 4];

        expect(randomChoice(arr)).toBeWithinRange(1, 4);
    });
});