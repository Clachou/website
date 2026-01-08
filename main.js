



const LOADING_SCREEN = new (class {

    #animation = false
    #lang = false
    #page = false

    #screen = document.getElementById("loadingScreen")

    get #loadEnd() { return this.#animation && this.#lang && this.#page }

    constructor() {
        if (this.#screen.classList.contains("hide")) return
        window.addEventListener("DOMContentLoaded", () => {
            TEXTS.fill(this.#screen)
            this.#screen.classList.add("show")
            setTimeout(() => {
                this.#animation = true
                this.#onLoadEnd()
            }, 4000)
        })

        window.addEventListener("langload", () => {
            this.#lang = true
            this.#onLoadEnd()
        })

        window.addEventListener("pageload", () => {
            this.#page = true
            this.#onLoadEnd()
        })
    }

    #onLoadEnd() {
        if (this.#screen.classList.contains("hide")) return
        if (this.#loadEnd) 
            this.#screen.classList.add("hide")
    }

})()