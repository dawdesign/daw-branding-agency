const assert = require('assert');
const TypographyFormatter = require('./typography');

// Initialize Formatter for English and French
const formatterEn = new TypographyFormatter({ locale: 'en' });
const formatterFr = new TypographyFormatter({ locale: 'fr' });

// Test cases for formatText
const tests = [
  {
    name: 'Slash-separated terms',
    formatter: formatterEn,
    input: 'This is a UI/UX and/or frontend project.',
    expected: 'This is a UI\u2060/\u2060UX and\u2060/\u2060or frontend project.'
  },
  {
    name: 'Honorifics and Titles (English)',
    formatter: formatterEn,
    input: 'Dr. Smith and Mr. Jones went to Prof. Green.',
    expected: 'Dr.\u00A0Smith and Mr.\u00A0Jones went to Prof.\u00A0Green.'
  },
  {
    name: 'Honorifics and Titles (French)',
    formatter: formatterFr,
    input: 'Mme Dupuy et M. Dupuy sont chez Mlle Martin.',
    expected: 'Mme\u00A0Dupuy et\u00A0M.\u00A0Dupuy sont chez Mlle\u00A0Martin.'
  },
  {
    name: 'Numbers and Units',
    formatter: formatterEn,
    input: 'The box weighs 10 kg and costs $ 100 or 50 EUR. Margins are 20 px.',
    expected: 'The box weighs 10\u00A0kg and costs $\u00A0100 or 50\u00A0EUR. Margins are 20\u00A0px.'
  },
  {
    name: 'French currencies and percentages',
    formatter: formatterFr,
    input: 'Le prix est de 100 € avec une remise de 25 %.',
    expected: 'Le\u00A0prix est de 100\u00A0€ avec\u00A0une\u00A0remise de 25\u00A0%.'
  },
  {
    name: 'Dates (English)',
    formatter: formatterEn,
    input: 'On July 17, 2026, or 17 July 2026, we will launch.',
    expected: 'On July\u00A017,\u00A02026, or 17\u00A0July\u00A02026, we will launch.'
  },
  {
    name: 'Dates (French)',
    formatter: formatterFr,
    input: 'Le 17 juillet 2026 aura lieu l\'inauguration.',
    expected: 'Le 17\u00A0juillet\u00A02026 aura lieu l\'inauguration.'
  },
  {
    name: 'French double punctuation',
    formatter: formatterFr,
    input: 'Bonjour ! Allez-vous bien ? Voici : une liste ; et des détails.',
    expected: 'Bonjour\u00A0! Allez-vous\u00A0bien\u00A0? Voici\u00A0: une\u00A0liste\u00A0; et\u00A0des\u00A0détails.'
  },
  {
    name: 'French guillemets',
    formatter: formatterFr,
    input: 'Il a dit « oui » à la proposition.',
    expected: 'Il\u00A0a\u00A0dit «\u00A0oui\u00A0» à\u00A0la\u00A0proposition.'
  },
  {
    name: 'French short words and pronouns',
    formatter: formatterFr,
    input: 'Nous accompagnons les marques dans le développement de leur identité.',
    expected: 'Nous\u00A0accompagnons les\u00A0marques dans\u00A0le\u00A0développement de\u00A0leur identité.'
  }
];

let failed = 0;
tests.forEach(t => {
  let actual;
  try {
    actual = t.formatter.formatText(t.input);
    assert.strictEqual(actual, t.expected);
    console.log(`✓ Pass: ${t.name}`);
  } catch (err) {
    console.error(`\n✗ Fail: ${t.name}`);
    console.error(`  Expected: ${JSON.stringify(t.expected)}`);
    console.error(`  Actual:   ${JSON.stringify(actual)}`);
    failed++;
  }
});

// Mock DOM test for preventWidows
console.log('\nRunning DOM / Widow prevention tests...');
try {
  const mockNode = (val, parentTag = 'p') => ({
    nodeValue: val,
    parentNode: { tagName: parentTag }
  });

  const mockElement = (tag, textNodesText) => {
    const nodes = textNodesText.map(t => mockNode(t, tag));
    return {
      tagName: tag,
      querySelectorAll: () => [],
      nodes: nodes,
      createTreeWalkerMock: () => {
        let index = -1;
        return {
          nextNode: () => {
            index++;
            return index < nodes.length;
          },
          get currentNode() {
            return nodes[index];
          }
        };
      }
    };
  };

  // Test preventWidows behavior using mock
  const block = mockElement('p', ['This is a paragraph ending with ', 'bold']);
  const formatter = new TypographyFormatter();
  
  global.NodeFilter = {
    SHOW_TEXT: 1,
    FILTER_ACCEPT: 1,
    FILTER_REJECT: 2
  };
  
  global.document = {
    createTreeWalker: (el) => el.createTreeWalkerMock()
  };

  formatter.preventWidows({
    querySelectorAll: () => [block]
  });

  assert.strictEqual(block.nodes[0].nodeValue, 'This is a paragraph ending with\u00A0');
  assert.strictEqual(block.nodes[1].nodeValue, 'bold');
  console.log('✓ Pass: Widow prevention keeps inline block end nodes together');

  // Clean up global mocks
  delete global.document;
  delete global.NodeFilter;

} catch (err) {
  console.error('✗ Fail: Widow prevention DOM test', err);
  failed++;
}

if (failed > 0) {
  process.exit(1);
} else {
  console.log('\nAll tests passed successfully!');
}
