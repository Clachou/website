const NAVIGATION = new (class {

    #pageLoad = new CustomEvent("pageload")

    #pageUrl = "/elements/pages/"
    #loaded = { boop: "page-boop" }

    constructor() {
        window.addEventListener("DOMContentLoaded", () => {
            if (!history.state)
                history.replaceState({ name: "main" }, "", document.location.href)
            this.#displayContent(history.state)
        })
                   
        window.addEventListener("popstate", (e) => {
            if (e.state)
                this.#displayContent(e.state)
        })
    }
        
    changePage(name) {
        let state = { name }
        this.#displayContent(state)
        history.pushState(state, "", `/${name}`)
    }

    #displayContent = async (state) => {
        let prev = history.state.name
        await this.#loadPage(state.name)
        window.dispatchEvent(this.#pageLoad)
        if (Object.keys(this.#loaded).includes(prev))
            document.querySelector(this.#loaded[prev])?.remove()
        let page = document.createElement(this.#loaded[state.name])
        document.body.insertAdjacentElement("afterbegin", page)
    }

    #loadPage = async (name) => {
        if (Object.keys(this.#loaded).includes(name)) return
        try {
            const module = await import(`./${this.#pageUrl}${name}Page.js`)
            customElements.define(module.tagName, module.default)
            this.#loaded[name] = module.tagName
        } catch (err) {
            console.error(err)
        }
    }

})()
