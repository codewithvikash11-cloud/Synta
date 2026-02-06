export function validateErrorInput(input: string): { valid: boolean; message?: string } {
    if (!input || input.trim().length < 10) {
        return { valid: false, message: 'Input is too short. Please paste a full error string.' };
    }

    const lower = input.toLowerCase();

    // 1. REJECT: Natural Language Questions
    // (Start with "how", "what", "can", "why" + "to", "do", "is", "help")
    const questionPattern = /^(how\s|what\s|can\s|why\s|i\sneed\shelp|is\sthere)/i;
    // But allow if it contains strong error keywords like "Uncaught Error" or "Stack trace"
    const strongErrorKeywords = ['uncaught', 'stack', 'trace', 'exception', 'unexpected', 'failed'];

    if (questionPattern.test(input) && !strongErrorKeywords.some(kw => lower.includes(kw))) {
        return { valid: false, message: 'Please post errors only. Questions should be searched in the docs.' };
    }

    // 2. ACCEPT: Broad Error Keywords (Expanded List)
    const validKeywords = [
        'error', 'exception', 'trace', 'stack', 'fail', 'undefined', 'null',
        'nan', 'cannot', 'module', 'syntax', 'unexpected', 'line', 'runtime',
        'json', 'token', 'fetch', 'promise', 'await', 'async', 'object',
        'function', 'return', 'import', 'export', 'default', 'const', 'let', 'var',
        'type', 'interface', 'class', 'void', 'any', 'string', 'number', 'boolean',
        'doctype', 'html', 'body', 'div', 'span', 'script', 'style', 'http', '404', '500', '200',
        'at ', 'in ', 'of '
    ];

    const hasKeyword = validKeywords.some(kw => lower.includes(kw));

    // 3. ACCEPT: Code/Error Characters
    // User specifically asked to allow < > and HTML
    const hasCodeChars = /[{};()\[\]=<>\/\\$#]/.test(input);

    if (hasKeyword || hasCodeChars) {
        return { valid: true };
    }

    // Fallback: If it's long enough and doesn't look like a question, maybe just accept it? 
    // But to be safe against random chat, we require at least ONE keyword or code char.
    // Given the list above is huge, "Hello world" fails (no code char/kw). 
    // "Unexpected token <" passes (unexpected, token, <).

    return { valid: false, message: 'Please paste a valid stack trace, error message, or log snippet.' };
}
