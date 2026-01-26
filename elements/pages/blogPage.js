export const tagName = "page-blog"
export default class BlogPage extends HTMLElement {

    /** @type {ShadowRoot} */
    #s = null

    #blogUrl = "/assets/content/blog/"

    constructor() {
        super()
        this.#s = this.attachShadow({ mode: "closed" })
        this.#createContent()
    }

    connectedCallback() {
        this.#loadContent()
    }

    #createContent() {
        this.#s.innerHTML = CONTENT
        TEXTS.fill(this.#s.firstElementChild)
        let style = document.createElement("style")
        style.textContent = STYLE
        this.#s.append(style)
    }

    #parseContent(text = "") {
        let content = ""
        let regex = /\\(.)/g
        let arr = []
        let prev = 0
        
        let para = ""
        let block = false

        while ((arr = regex.exec(text)) !== null) {
            content += text.slice(prev, arr.index)
            switch (arr[1]) {
                case "1":
                case "2":
                case "p":
                case "c":
                    if (para)
                        content += `</${PARAS[para]}>`
                content += `<${PARAS[arr[1]]}>`
                para = arr[1]
                break
                case "^":
                case ".":
                case "-":
                    content += `<${block ? "/" : ""}${BLOCKS[arr[1]]}>`
                    block = !block
                break
            }
            prev = regex.lastIndex
        }
        content += text.slice(prev)
        if (para)
            content += `</${PARAS[para]}>`
        this.#s.querySelector("article").insertAdjacentHTML("afterbegin", content)
    }

    #loadContent = async () => {
        let lang = history.state.frContent ? "fr" : TEXTS.language
        let url = `${window.location.origin}${this.#blogUrl}${lang}/${NAVIGATION.contentName}.txt`
        try {
            const response = await fetch(url)
            if (!response.ok) 
                throw new Error(TEXTS.get("err_BlogLoad") + ` Status : ${response.status} => ${response.statusText}`)
            this.#parseContent(await response.text())
        } catch (err) {
            console.error(err.message)
        }  
    }

}

const PARAS = {
    "1": "h1",
    "2": "h2",
    "p": "p",
    "c": "em"
}

const BLOCKS = {
    "^": "strong",
    ".": "small",
    "-": "del"
}

const CONTENT = `
    <main>
        <article>

        </article>
    </main>
`
const STYLE = `
    :host {
        width: 100%; height: 100%;
    }

    main {
        width: 100%; height: 100%;
        overflow-y: auto;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    main::-webkit-scrollbar {
        display: none;
    }
    
    article {
        width: 50%;
        padding-top: 25px;
        padding-bottom: 50px;
        margin: auto;
        text-align: justify;
        font-family: sans-serif;
    }

    h1 {
        margin: 50px;
        text-align: center;
        font-size: 48px;
        font-weight: normal;
    }
    
    h2 {
        margin-top: 50px;
        font-size: 28px;
        font-weight: normal;
    }

    p, em {
        font-size: 18px;
    }

    em {
        display: block;
        text-align: center;
        font-style: normal;
        margin-top: 50px;
    }

    strong, em {
        font-size: 22px;
        font-weight: normal;
    }

    small, del {
        font-size : 14px;
    }

` 