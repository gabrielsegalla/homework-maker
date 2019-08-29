const robots = {
    input: require('./robots/user-input.js'),
    text: require('./robots/text.js'),
    state: require('./robots/state.js'),
    image: require('./robots/images.js')
}

async function start(){
    robots.input()
    await robots.text()
    await robots.image()
    const content = robots.state.load()
    console.dir(content, {depth: null})
}

start()