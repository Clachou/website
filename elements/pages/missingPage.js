export const tagName = "page-missing"
export default class MissingPage extends HTMLElement {

    /** @type {ShadowRoot} */
    #s = null

    constructor() {
        super()
    }

    connectedCallback() {
        this.#s = this.attachShadow({ mode: "closed" })
        this.#createContent()
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
    <main text>
        <p title="😭">#missingMessage</p>
    </main>
`
const STYLE = `
    :host {
        width: 100%; height: 100%;
    }    

    main {
        width: 100%; height: 100%;
        display: grid;
        place-items: center;
    }

    span {
        font-size: 20px;
        font-family: sans-serif;
    }
` 