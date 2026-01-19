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
                let to = btn.getAttribute("to").split("/")
                let content = to.length > 1 ? to[1] : ""
                NAVIGATION.changePage(to[0], content)
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
    <main>
        <div to="list/trifles"><img src="./assets/icons/trifles.svg"/></div>
        <div to="list/tools"><img src="./assets/icons/tools.svg"/></div>
        <div to="list/tgames"><img src="./assets/icons/tgames.svg"/></div>
        <div to="list/games"><img src="./assets/icons/games.svg"/></div>
        <div to="list/blog"><img src="./assets/icons/blog.svg"/></div>
        <div to="missing"><img src="./assets/icons/settings.svg"/></div>
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

    img {
        width: 80px;
        filter: invert(1)
    }
` 