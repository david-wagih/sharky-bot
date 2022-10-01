const cohereChat = async (text) => {
    
    const response = await cohere.generate({
        model: 'xlarge',
        prompt: text,
        max_tokens: 50,
        temperature: 0.9,
        k: 0,
        p: 0.75,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop_sequences: [],
        return_likelihoods: 'NONE'
    })
    return response.body.generations[0].text;
}

module.exports = cohereChat;