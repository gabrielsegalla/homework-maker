const readLine = require('readline-sync')
const state = require('./state.js')

function robot() {
    const content = {
        maximumSentences: 80
    }
    content.authorName = askAndReturnAuthorName()
    content.searchTerm = askAndReturnSearchTerm()
    content.prefix = askAndReturnPrefix()
    state.save(content)

    function askAndReturnAuthorName() {
        return readLine.question('What is Author name: ')
    }
    
    function askAndReturnSearchTerm() {
        return readLine.question('Type a Wikipedia search term: ')
    }

    function askAndReturnPrefix() {
        const prefixes = ['Who is','What is', 'The history of']
        const selectedPrefixIndex = readLine.keyInSelect(prefixes,'Choose one option: ')
        const selectedPrefixText = prefixes[selectedPrefixIndex]
        return selectedPrefixText
    }
}

module.exports = robot