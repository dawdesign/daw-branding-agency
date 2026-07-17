/**
 * TypographyFormatter - Utility for professional typography and line-breaking rules.
 * Prevents widows, keeps numbers/units/dates together, and enforces locale-specific rules.
 */
class TypographyFormatter {
  constructor(options = {}) {
    this.locale = options.locale || 'fr'; // Default to French as requested by landing page language (fr-FR)
    this.selector = options.selector || 'p, h1, h2, h3, h4, h5, h6, li, figcaption, blockquote';
  }

  /**
   * Initialize formatting on the specified container or document body.
   * @param {HTMLElement} [container=document.body]
   */
  init(container = document.body) {
    if (!container) return;

    // 1. Format text nodes with general and locale-specific rules
    this.formatTextNodes(container);

    // 2. Prevent widows in block containers
    this.preventWidows(container);
  }

  /**
   * Formats all text nodes under the container using typography rules.
   * @param {HTMLElement} container
   */
  formatTextNodes(container) {
    const walker = document.createTreeWalker(
      container,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const parent = node.parentNode;
          if (parent) {
            const tag = parent.tagName.toLowerCase();
            if (tag === 'script' || tag === 'style' || tag === 'textarea' || tag === 'code' || tag === 'pre') {
              return NodeFilter.FILTER_REJECT;
            }
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const nodes = [];
    while (walker.nextNode()) {
      nodes.push(walker.currentNode);
    }

    nodes.forEach(node => {
      const originalText = node.nodeValue;
      const formattedText = this.formatText(originalText);
      if (originalText !== formattedText) {
        node.nodeValue = formattedText;
      }
    });
  }

  /**
   * Applies typography replacements to a string.
   * @param {string} text
   * @returns {string}
   */
  formatText(text) {
    if (!text) return text;

    let result = text;

    // Months list for English and French
    const months = 'January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec|janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre|janv|févr|sept|oct|nov|déc';

    // 1. Slash-separated terms (e.g., UI/UX, and/or)
    result = result.replace(/\b(\w+)\/(\w+)\b/g, '$1\u2060/\u2060$2');

    // 2. Honorifics and Titles followed by names
    result = result.replace(/\b(Mr|Mrs|Ms|Dr|Prof|Mme|Mlle|St)\b[ \t]+([A-Z\u00C0-\u00DC\w])/g, '$1\u00A0$2');
    result = result.replace(/\b(Mr|Mrs|Ms|Dr|Prof|M|St)\.[ \t]+([A-Z\u00C0-\u00DC\w])/g, '$1.\u00A0$2');

    // 3. Numbers and Units
    // Suffix units
    result = result.replace(/\b(\d+(?:[.,]\d+)?)[ \t]+(kg|g|mg|m|cm|km|px|em|rem|vh|vw|s|ms|min|h|t|%|€|\$|£|¥|USD|EUR|GBP|CAD|CHF)(?!\w)/gi, '$1\u00A0$2');
    // Currency symbols prefix
    result = result.replace(/([$€£¥])[ \t]+(\d+(?:[.,]\d+)?)/g, '$1\u00A0$2');
    // Time suffixes (am/pm)
    result = result.replace(/\b(\d+)[ \t]+([aApP]\.?[mM]\.?)\b/g, '$1\u00A0$2');

    // 4. Dates
    // Day followed by Month
    const dayMonthRegex = new RegExp(`\\b(\\d{1,2})[ \\t]+(${months})\\b`, 'gi');
    result = result.replace(dayMonthRegex, '$1\u00A0$2');
    // Month followed by Day
    const monthDayRegex = new RegExp(`\\b(${months})[ \\t]+(\\d{1,2})\\b`, 'gi');
    result = result.replace(monthDayRegex, '$1\u00A0$2');
    // Month/Day followed by 4-digit Year
    const dateYearRegex = new RegExp(`\\b((${months})\\u00A0\\d{1,2}|\\d{1,2}\\u00A0(${months}))(,?)[ \\t]+(\\d{4})\\b`, 'gi');
    result = result.replace(dateYearRegex, '$1$4\u00A0$5');

    // 5. French locale specific formatting
    if (this.locale === 'fr') {
      // Keep French short words, conjunctions, prepositions, and pronouns bound to the following word
      const shortWords = 'je|tu|il|elle|on|nous|vous|ils|elles|le|la|les|de|du|des|un|une|et|ou|en|y|à|a|par|sur|dans|pour|avec|sans|sous|ne|se|ce|mon|ton|son|ma|ta|sa|mes|tes|ses|qui|que|mais|donc|car|aux|au';
      const shortWordsRegex = new RegExp(`(?<![a-zA-Z\\u00C0-\\u00DC])(${shortWords})(?![a-zA-Z\\u00C0-\\u00DC])[ \\t]+(?=[a-zA-Z\\u00C0-\\u00DC]+)`, 'gi');
      result = result.replace(shortWordsRegex, '$1\u00A0');

      // Double punctuation marks (: ; ! ?) preceded by space
      result = result.replace(/[ \t]+([:;!?])/g, '\u00A0$1');
      // French quote marks (guillemets)
      result = result.replace(/«[ \t]+/g, '«\u00A0');
      result = result.replace(/[ \t]+»/g, '\u00A0»');
    }

    return result;
  }

  /**
   * Applies widow prevention on the last space of each matching block container.
   * @param {HTMLElement} container
   */
  preventWidows(container) {
    const blocks = container.querySelectorAll(this.selector);
    
    blocks.forEach(block => {
      // Find all text nodes inside this block
      const walker = document.createTreeWalker(
        block,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            const parent = node.parentNode;
            if (parent) {
              const tag = parent.tagName.toLowerCase();
              if (tag === 'script' || tag === 'style' || tag === 'textarea' || tag === 'code' || tag === 'pre') {
                return NodeFilter.FILTER_REJECT;
              }
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      const nodes = [];
      while (walker.nextNode()) {
        nodes.push(walker.currentNode);
      }

      if (nodes.length === 0) return;

      // Concatenate text values and map characters to nodes
      let concatText = '';
      const charMap = [];

      for (let n = 0; n < nodes.length; n++) {
        const text = nodes[n].nodeValue;
        for (let offset = 0; offset < text.length; offset++) {
          charMap.push({ nodeIndex: n, offset: offset });
        }
        concatText += text;
      }

      // Find the last normal space between words
      let lastSpaceIdx = -1;
      const firstNonSpace = concatText.search(/\S/);
      const lastNonSpace = concatText.trimEnd().length - 1;

      for (let i = lastNonSpace; i > firstNonSpace; i--) {
        if (/[ \t\r\n]/.test(concatText[i])) {
          lastSpaceIdx = i;
          break;
        }
      }

      // If found, replace with a non-breaking space
      if (lastSpaceIdx !== -1) {
        const entry = charMap[lastSpaceIdx];
        const node = nodes[entry.nodeIndex];
        const offset = entry.offset;
        const val = node.nodeValue;
        node.nodeValue = val.substring(0, offset) + '\u00A0' + val.substring(offset + 1);
      }
    });
  }
}

// Expose to window/global scope
if (typeof window !== 'undefined') {
  window.TypographyFormatter = TypographyFormatter;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TypographyFormatter;
}
