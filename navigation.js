const NAVIGATION = new (class {

    #pageLoad = new CustomEvent("pageload")

    #page
    #pageUrl = "/elements/pages/"
    #itemUrl = "/elements/items/"
    #necessaryItems = ["listItem"]

    #loaded = { boop: "page-boop" }
    #urlHiddenPages = ["list"]

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
        let url = ""
        if (!this.#urlHiddenPages.includes(name))
            url += `/${name}`
        if (contentName)
            url += `/${contentName}`
        history.pushState(state, "", url)
    }

    #displayContent = async (state) => {
        await this.#loadPage(state.name)
        window.dispatchEvent(this.#pageLoad)
        if (this.#page && !this.#page.removesSelf)
            this.#page.remove() 
        this.#page = document.createElement(this.#loaded[state.name])
        this.#page.classList.add("page")
        document.body.insertAdjacentElement("afterbegin", this.#page)
    }

    #loadPage = async (name) => {
        if (Object.keys(this.#loaded).includes(name)) return
        try {
            const module = await import(`./${this.#pageUrl}${name}Page.js`)
            customElements.define(module.tagName, module.default)
            this.#loaded[name] = module.tagName
            if (module.items) {
                if (module.essentialItems) {
                    await this.#loadNecessaryItems(module.items.slice(0, parseInt(module.essentialItems)), module.itemUrl)
                    this.#loadNecessaryItems(module.items.slice(parseInt(module.essentialItems)), module.itemUrl)
                } else {
                    await this.#loadNecessaryItems(module.items, module.itemUrl)
                }
            }
        } catch (err) {
            console.error(err)
        }
    }

    /**
     * @param {Array<String>} items 
     */
    #loadNecessaryItems = async (items, url = "") => {
        if (!items)
            items = this.#necessaryItems
        if (!url)
            url = this.#itemUrl
        for (let i = 0; i < items.length; i++) {
            try {
                const module = await import(`./${url}${items[i]}.js`)
                customElements.define(module.tagName, module.default)
            } catch (err) {
                console.error(err)
            }
        }
    }

})()

