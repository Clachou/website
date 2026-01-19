const NAVIGATION = new (class {

    #pageLoad = new CustomEvent("pageload")

    #pageUrl = "/elements/pages/"
    #itemUrl = "/elements/items/"
    #necessaryItems = ["listItem"]

    #loaded = { boop: "page-boop" }

    get contentName() { return history.state["content"] }

    constructor() {
        window.addEventListener("DOMContentLoaded", async () => {
            if (!history.state)
                history.replaceState({ name: "main" }, "", document.location.href)
            await this.#loadNecessaryItems()
            this.#displayContent(history.state)
        })
                   
        window.addEventListener("popstate", (e) => {
            if (e.state)
                this.#displayContent(e.state)
        })
    }
        
    changePage(name, contentName = "", forceFrench = false) {
        let state = { name, content: contentName }
        if (forceFrench)
            state["frContent"] = true
        this.#displayContent(state)
        let url = `/${name}`
        if (contentName)
            url += `/${contentName}`
        history.pushState(state, "", url)
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

    #loadNecessaryItems = async () => {
        for (let i = 0; i < this.#necessaryItems.length; i++) {
            try {
                const module = await import(`./${this.#itemUrl}${this.#necessaryItems[i]}.js`)
                customElements.define(module.tagName, module.default)
            } catch (err) {
                console.error(err)
            }
        }
    }

})()

