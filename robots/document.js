const state = require('./state.js')
const PDFDocument = require('pdfkit');
const fs = require('fs');

async function robot() {
    const content = state.load()
    const doc = new PDFDocument({size: 'A4', margin:20});
    
    await createDocument(content, doc)
    await createFrontpage(content, doc)
    await createDocumentPage(content,doc)

    async function createDocument(content, doc){
        doc.pipe(fs.createWriteStream('output.pdf'));
    }

    async function createFrontpage(content, doc){
        doc.fontSize(25).text(content.prefix + " " + content.searchTerm, 117, 100);
        doc.image('content/0-original.png',70, 200, {width: 450})
        doc.fontSize(14).text(content.authorName,255, 650)
        doc.lineJoin('bevel')
            .rect(10, 10, 575, 820)
            .stroke();
        console.log("> Criou a capa com sucesso")
    }

    async function createDocumentPage(content, doc){
        doc.addPage({
            margin: 70
        })
        .fontSize(16).text(content.searchTerm,255).moveDown()
        resume = ""
        for(const sentence of content.sentences){
            resume += sentence.text
            console.log("> Criando Resumo")
        }
        doc.fontSize(12)
        .text(resume, {
            align: 'justify'
        })
        .end();
    }
}

module.exports = robot