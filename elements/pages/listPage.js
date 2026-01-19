export const tagName = "page-list"
export default class ListPage extends HTMLElement {

    /** @type {ShadowRoot} */
    #s = null
    #type = ""

    #listUrl = "/assets/content/lists/"
    #cmpt = 0

    constructor() {
        super()
    }

    connectedCallback() {
        this.#s = this.attachShadow({ mode: "closed" })
        this.#createContent()
        this.#type = NAVIGATION.contentName
        this.#s.querySelector("h1").innerText = TEXTS.get(this.#type)
        this.#loadContent()
    }

    #createContent() {
        this.#s.innerHTML = CONTENT
        TEXTS.fill(this.#s.firstElementChild)
        let style = document.createElement("style")
        style.textContent = STYLE
        this.#s.append(style)
    }

    #parseContent(items = []) {
        items.forEach(values => {
            let item = document.createElement("list-item")
            item.set(values)
            item.classList.add("hidden")
            item.addEventListener("click", () => {
                if (item.frExclusive) {
                    if (confirm(TEXTS.get("frOnly_open")))
                        NAVIGATION.changePage(this.#type, item.to, true)
                    else
                        alert(TEXTS.get("frOnly_cancel"))
                    return
                }
                NAVIGATION.changePage(this.#type, item.to)
            })
            this.#s.querySelector("section").insertAdjacentElement("beforeend", item)
        })
    }

    #loadContent = async () => {
        let url = `${window.location.origin}${this.#listUrl}${TEXTS.language}/${NAVIGATION.contentName}_${this.#cmpt}.json`
        try {
            const response = await fetch(url)
            if (!response.ok)
                throw new Error(TEXTS.get("err_ListLoad") + ` Status : ${response.status} => ${response.statusText}`)
            this.#parseContent(await response.json())
        } catch (err) {
            console.error(err.message)
        }  
    }

}

const CONTENT = `
    <main>
        <h1></h1>
        <section></section>
    </main>
`
const STYLE = `
    :host {
        width: 100%; height: 100%;
    }

    list-item {
        animation-name: itemEntry;
        animation-duration: .75s;
        animation-timing-function: ease-in;
        animation-iteration-count: 1;
    }

    main {
        width: 100%; height: 100%;
        overflow: hidden;
    }

    h1 {
        margin: 50px;
        text-align: center;
        font-size: 64px;
        font-weight: normal;
    }
    
    section {
        display: flex;
        flex-direction: column;
        overflow: auto;
    }

    @keyframes itemEntry {
        from { opacity: 0; }
        to   { opacity: 1; }
    }

` 