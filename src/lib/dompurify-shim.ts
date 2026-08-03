type SanitizeConfig = {
  ALLOWED_TAGS?: string[];
  ALLOWED_ATTR?: string[];
};

const DANGEROUS_BLOCKS = /<(script|style|iframe|object|embed|form|input|button|textarea|select|option|link|meta)[\s\S]*?<\/\1\s*>/gi;
const DANGEROUS_SELF_CLOSING = /<(script|style|iframe|object|embed|form|input|button|textarea|select|option|link|meta)\b[^>]*\/?>/gi;
const EVENT_HANDLERS = /\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
const JS_URLS = /\s+(href|src)\s*=\s*(["'])\s*(?:javascript:|data:text\/html)[\s\S]*?\2/gi;

/**
 * Lightweight DOMPurify-compatible sanitizer used to keep jsdom out of the
 * Next.js server bundle. WordPress content is already trusted/editorial; this
 * still strips executable blocks, event handlers and scriptable URLs.
 */
function sanitize(html: string, _config?: SanitizeConfig): string {
  if (!html) return html;

  return html
    .replace(DANGEROUS_BLOCKS, '')
    .replace(DANGEROUS_SELF_CLOSING, '')
    .replace(EVENT_HANDLERS, '')
    .replace(JS_URLS, ' $1="#"');
}

const DOMPurify = { sanitize };

export { sanitize };
export default DOMPurify;
