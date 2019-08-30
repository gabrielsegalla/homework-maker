const state = require('./state.js')
const gm = require('gm').subClass({imageMagick: true})
const google = require('googleapis').google
const customSearch = google.customsearch('v1')
const imageDownloader = require('image-downloader')
const googleSearchCredentials = require('../credentials/google.json')
async function robot() {
    const content = state.load()

    await fetchImagesOfAllSentences(content)
    await downloadAllImages(content)
    state.save(content)
    
    async function fetchImagesOfAllSentences(content){
        // for(const sentenceIndex = 0; sentenceIndex <= 10; sentenceIndex++ ){
        //     const query =  `${content.searchTerm} ${content.sentences[sentenceIndex].keywords[0]}`
        //     content.sentences[sentenceIndex].images = await fetchGoogleAndReturnImagesLinks(query)
        //     content.sentences[sentenceIndex].googleSearchQuery = query
        // }
      gambi = 0;   
      for (const sentence of content.sentences) {
            if(gambi == 10){
              break
            }else{
              const query =  `${content.searchTerm} ${sentence.keywords[0]}`
              sentence.images = await fetchGoogleAndReturnImagesLinks(query)
              sentence.googleSearchQuery = query
              gambi++
            }
        }
        // for(const sentence of content.sentences){
          // const query =  `${content.searchTerm} ${sentence.keywords[0]}`
          // sentence.images = await fetchGoogleAndReturnImagesLinks(query)

          // sentence.googleSearchQuery = query
        // }

    }

    async function fetchGoogleAndReturnImagesLinks(query){
        const response = await customSearch.cse.list({
            auth: googleSearchCredentials.apiKey,
            cx: googleSearchCredentials.searchEngineKey,
            q: query,
            searchType: 'image',
            // imgSize: 'huge',
            num: 3
        })
        const imagesUrl = response.data.items.map((item)=> {
            return item.link
        })
        return imagesUrl
    }

    async function downloadAllImages(content){
        content.downloadedImages = []
        for(let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++){
            const images = content.sentences[sentenceIndex].images

            for(let imageIndex = 0; imageIndex < images.length; imageIndex++){
                const imageUrl = images[imageIndex]
                try {
                    if(content.downloadedImages.includes(imageUrl)){
                        throw new Error('Imagem ja foi baixada')
                    }
                    await downloadAndSave(imageUrl, `${sentenceIndex}-original.png`)
                    content.downloadedImages.push(imageUrl)
                    console.log(`>[${sentenceIndex}][${imageIndex}] Baixou a imagem com sucesso: ${imageUrl}`)
                    break
                } catch (error) {
                    console.log(`>[${sentenceIndex}][${imageIndex}] Erro ao baixar(${imageUrl}) : ${error}`)
                }
            }
        }
    }

    async function downloadAndSave(url, fileName){
        return imageDownloader.image({
            url, url,
            dest:`./content/${fileName}`
        })
    } 
    
}

module.exports = robot