/**
 * Escapes special regex characters in the given string.
 */
function escapeRegex(word: string): string {
    return word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default escapeRegex;
