const { NlpManager } = require('node-nlp');

const convertTo = require('./convert-to.json')
const inputs = require('./input.json')
const fs = require('fs');

const manager = new NlpManager({ languages: ['en'], forceNER: true });

for (const [key, value] of Object.entries(convertTo)) {
    for (const item of value) {
        manager.addDocument('en', item, key);
    }
}

(async() => {
    console.time('train');

    await manager.train();

    console.timeEnd('train');

    manager.save();

    let output = []

    console.time('process');
    for (const input of inputs) {
        console.log(`Processing ${input._id} - ${input.count}`);

        const { _id, count } = input;

        const response = await manager.process('en', _id);

        const fs = require('fs');
        const levenshtein = require('fast-levenshtein');
        
        function calculateSimilarity(str1, str2) {
          const distance = levenshtein.get(str1.toLowerCase(), str2.toLowerCase());
          const maxLength = Math.max(str1.length, str2.length);
          return ((maxLength - distance) / maxLength) * 100;
        }
        

        output.push({
            _id,
            accuracy: `${calculateSimilarity(_id, response.intent)}%`,
            response: response.intent,
        });
    }

    console.timeEnd('process');

    fs.writeFileSync('output.json', JSON.stringify(output, null, 2));
})();
