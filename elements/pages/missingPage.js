export const tagName = "page-missing"
export default class MissingPage extends HTMLElement {

    /** @type {ShadowRoot} */
    #s = null

    constructor() {
        super()
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
        <figure>
            <a href="https://marieladouceur.square.site/" target="_target">
                <img src="./assets/missing.png"/>
            </a>
            <figcaption>#missingMessage<br>#missingCredits<a href="https://www.instagram.com/marieladouceur030/" target="_target">@marieladouceur030</a>    <small><a href="https://marieladouceur.square.site/" target="_target">#missingSite</a></small></figcaption>
        </figure>
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
    
    figure {
        max-width: 60vw; max-height: 60vh;
        width: 60%; height: 60%;
    }

    img {
        max-width: 100%; max-height: 100%;
    }

    figcaption {
        font-size: 20px;
        font-family: sans-serif;
    }
` 