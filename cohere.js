const cohere = require('cohere-ai');
cohere.init('0rv0oKdwrI50yZ78FwIJr83HkmtyQzmh1LB5sMCI');
(async () => {
    const response = await cohere.generate({
        model: 'xlarge',
        prompt: 'What are sharks?',
        max_tokens: 50,
        temperature: 0.9,
        k: 0,
        p: 0.75,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop_sequences: [],
        return_likelihoods: 'NONE'
    });
    console.log(`Prediction: ${response.body.generations[0].text}`);
})();