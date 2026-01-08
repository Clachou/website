export const tagName = "page-main"
export default class MainPage extends HTMLElement {

    /** @type {ShadowRoot} */
    #s = null

    constructor() {
        super()
    }

    connectedCallback() {
        this.#s = this.attachShadow({ mode: "closed" })
        this.#createContent()
        this.#s.querySelectorAll("div").forEach(btn => {
            btn.addEventListener("click", () => {
                NAVIGATION.changePage(btn.getAttribute("to"))
            })
        })
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
        <div to="missing"><span>#fiddles</span></div>
        <div to="missing"><span>#tools</span></div>
        <div to="missing"><span>#tgames</span></div>
        <div to="missing"><span>#games</span></div>
        <div to="missing"><span>#mods</span></div>
        <div to="missing"><span>#blog</span></div>
        <div to="missing"><span>#about</span></div>
        <div to="missing"><span>#updates</span></div>
        <div to="missing"><span>#settings</span></div>
    </main>
`
const STYLE = `
    :host {
        width: 100%; height: 100%;
    }    

    main {
        width: 100%; height: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-evenly;
        align-items: center;
    }

    div {
        width: 200px; height: 200px;
        margin: 0 75px;
        background-color: #18d;
        color: white;
        border-radius: 50%;
        display: grid;
        place-items: center;
        transition: filter .5s;
    }
        
    div:hover {
        filter: brightness(0.85);
    }

    span {
        font-size: 28px;
        font-family: sans-serif;
    }
` 