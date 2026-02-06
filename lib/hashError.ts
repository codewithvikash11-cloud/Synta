import crypto from 'crypto';

export function normalizeError(error: string): string {
    // Simple normalization: remove timestamps, file paths that look dynamic, whitespace
    // This is a basic implementation.
    let normalized = error.trim();

    // Remove typical timestamp patterns (basic regex)
    normalized = normalized.replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/g, '');

    // Collapse whitespace
    normalized = normalized.replace(/\s+/g, ' ');

    return normalized;
}

export function generateErrorHash(normalizedError: string): string {
    return crypto.createHash('sha256').update(normalizedError).digest('hex');
}
