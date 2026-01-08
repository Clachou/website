const TEXTS = new (class {

    #langLoad = new CustomEvent("langload")
    #langLoadErr = new CustomEvent("langloaderr")

    #langUrl = "/assets/lang/"
    #textToken = /#[\w\d]+/
    
    #langs = "en fr"
    #language = "en"
    #texts = null

    get language() { return this.#language }
    get validLanguages() { return this.#langs.split(" ") }

    get(key) { return this.#texts[key] }

    constructor() {
        let local = window.localStorage.getItem("lang")
        let nav = navigator.language.split("-")[0]
        if (local) {
            this.#language = local
        } else if (this.validLanguages.includes(nav)) {
            this.#language = nav
        }
        this.#texts = this.#loadingPageText[this.#language]
        this.#loadLang()
    }

    /**
     * @param {Element} container 
     */
    fill(container) {
        if (container.hasAttribute("text")) {
            this.#scanNode(container)
        } else {
            container.querySelectorAll("[text]").forEach((ele) => {
                this.#scanNode(ele)
            })
        }
    }

    /**
     * @param {Node} node 
     * @param {Array<Node>} nodes
     */
   #scanNode(node) {
       if (node.nodeType == 3) { // Text node
            let nodeVal = node.nodeValue
            if (nodeVal.trim().length <= 0) return
            let match;
            while ((match = this.#textToken.exec(nodeVal)) !== null) {
                let text = this.get(match[0].slice(1)) || ""
                if (!text)
                    console.warn(`Language ${this.#language} does not have text for id ${match[0]}`)
                nodeVal = nodeVal.replace(this.#textToken, text)
                this.#textToken.lastIndex = 0
            }
            node.nodeValue = nodeVal
        } else if (node.nodeType == 1) { // Element (recursive)
            node.childNodes.forEach(n => { this.#scanNode(n) })
        }
    }

    #loadLang = async () => {
        let url = `${window.location.origin}${this.#langUrl}${this.#language}.json`
        try {
            const response = await fetch(url)
            if (!response.ok) 
                throw new Error(this.get("langErr") + ` Status : ${response.status} => ${response.statusText}`)
            
            this.#texts = await response.json()
            window.dispatchEvent(this.#langLoad)
        } catch (err) {
            console.error(err.message)
            window.dispatchEvent(this.#langLoadErr)
        }  
    }

    #loadingPageText = {
        fr: {
            loading_subtitle: "Jeux & Bricoles",
            langErr: "Impossible de télécharger le fichier de textes.",
        }, en: {
            button: "Games & Trifles",
            langErr: "Could not load text file.",
        }
    }

})()