import 'highlight.js/styles/github.css'
import marked from 'marked'
import docConfig from '../docz.config'

class TranslateMarkDown {
    constructor(props) {
        this.filePath = props
        this.getMarkDownDom()
    }

    getMDFileContent() {
        let files = []
        if (typeof this.filePath === 'string') {
            files = [this.filePath]
        } else if (Array.isArray(this.filePath)) {
            files = this.filePath
        } else {
            throw new Error('解析的文件传递的数据格式不对')
        }
        const promises = files.map((file) => {
            return new Promise((resolve, reject) => {
                const placeStr = docConfig.projRootUrl.replaceAll('\\', '/')
                const fileRc = file.replace(placeStr, location.origin)
                fetch(fileRc).then(resp => {
                    if(resp.ok){
                        // resp.text() is a promise，resolve(resp.json())将包含的文件结果的promise传递出去
                        resolve(resp.text())
                    }
                })
            })
        })
        return promises
    }

    /**
     * marked基础配置
     *
     * */
    setMarkedOpt () {
        marked.setOptions({
            renderer: new marked.Renderer(),
            highlight: function(code) {
                return require('highlight.js').highlightAuto(code).value;
            },
            pedantic: false,
            gfm: true,
            tables: true,
            breaks: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            xhtml: false
        });
    }

    /**
     * 对md内容进行转译，转换成html
     *
     * */
    translateMdFile(res) {
        this.setMarkedOpt()
        res.forEach(item => {
            document.getElementById('root').innerHTML = marked(item)
        })
    }

    getMarkDownDom() {
        const promise = this.getMDFileContent()
        Promise.all(promise).then(res => {
            this.translateMdFile(res)
        })
    }
}

const p1 = new TranslateMarkDown(docConfig.projRootMdSource.doc[0])
