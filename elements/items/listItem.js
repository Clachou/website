export const tagName = "list-item"
export default class ListItemElement extends HTMLElement {

    /** @type {ShadowRoot} */
    #s = null

    #defaultImgUrl = "/assets/icons/"

    #name = ""
    #frExclusive = false

    get to() { return this.#name }
    get frExclusive() { return this.#frExclusive }

    constructor() {
        super()
        this.#s = this.attachShadow({ mode: "closed" })
        this.#createContent()
    }

    /**
     * @param {ListItem} values 
     */
    set(values) {
        this.#name = values.name
        this.#s.querySelector("h1").innerText = values.title
        this.#s.querySelector("p").innerText = values.preview
        this.#s.querySelector("img").setAttribute("src", values.img ? values.img : `${this.#defaultImgUrl}${NAVIGATION.contentName}.svg`)
        if (values.version == "fr") {
            if (TEXTS.language == "en") {
                this.#frExclusive = true
                let small = this.#s.querySelector("small") 
                small.innerText = TEXTS.get("frOnly")
                small.classList.add("text")
            }
        } else if (typeof values.version == "number") {
            let date = new Date(values.version)
            let month = new Intl.DateTimeFormat(TEXTS.language, { month: 'short' }).format(date);
            let small = this.#s.querySelector("small") 
            small.innerText = `${date.getDate()} ${month} ${date.getFullYear()}`
            small.classList.add("text")
        } else {
            this.#s.querySelector("small").innerText = values.version
        }
    }

    #createContent() {
        this.#s.innerHTML = CONTENT
        TEXTS.fill(this.#s.firstElementChild)
        let style = document.createElement("style")
        style.textContent = STYLE
        this.#s.append(style)
    }

}

const CONTENT = `
    <main>
        <section>
            <div>
                <h1></h1>
                <p></p>
            </div>
            </section>
        <aside>
            <img/>
            <small></small>
        </aside>
    </main>
`
const STYLE = `
    :host {
        width: 100%; height: 300px;
        box-sizing: border-box;
        padding: 25px;
        transition: background-color .25s, box-shadow .25s;
    }
        
    :host(:hover) {
        background-color: #f5fbff;
        box-shadow: inset 0px 0px 8px 1px rgb(0 0 0 / 20%);
    }

    main {
        width: 100%; height: 100%;
        display: flex;
        flex-direction: row;
        font-family: sans-serif;
    }

    :host(:nth-child(even)) main {
        flex-direction: row-reverse;
    }

    section {
        flex-grow: 1;
        margin-left: 0px;
        margin-right: 25px;
    }

    :host(:nth-child(even)) section {
        margin-left: 25px;
        margin-right: 0px;
    }

    h1 {
        text-align: center;
        font-size: 32px;
        font-weight: normal;
    }

    p {
        padding: 0 25px;
        font-size: 20px;
        text-align: justify;
    }

    aside {
        display: flex;
        flex-direction: column;
        border-radius: 20px;
    }

    img {
        height: 250px;
        margin-bottom: 2px;
        border-radius: 20px;
    }

    small {
        padding: 0 15px;
        text-align: left;
        font-size : 14px;
        font-family: monospace;
        opacity: 50%;
    }
        
    small.text {
        font-family: inherit;
        opacity: 75%;
    }

    :host(:nth-child(odd)) small {
        text-align: right;
    }

` 