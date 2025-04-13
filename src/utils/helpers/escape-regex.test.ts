import escapeRegex from './escape-regex';

describe('escapeRegex', () => {
    it('should return the same string if no special characters are present', () => {
        const input = 'hello world';
        const result = escapeRegex(input);
        expect(result).toBe('hello world');
    });

    it('should escape all regex special characters', () => {
        const input = '.*+?^${}()|[]\\';
        const result = escapeRegex(input);
        expect(result).toBe('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
    });

    it('should handle mixed content correctly', () => {
        const input = 'abc.*(test)+xyz';
        const result = escapeRegex(input);
        expect(result).toBe('abc\\.\\*\\(test\\)\\+xyz');
    });
});
