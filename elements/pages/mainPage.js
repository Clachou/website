const SIMS = ["zigzag"]
const LOADED = []
let shuffle = false
shuffleSims()

export const tagName = "page-main"
export const items = SIMS.slice()
export const essentialItems = 1
export const itemUrl = "/assets/content/mainPageSims/"
export default class MainPage extends HTMLElement {

    /** @type {ShadowRoot} */
    #s = null
    /** @type {Element} */
    #main = null
    #span = new Button()
    /** @type {Element} */
    #sim = null

    #simIndex = 0
    #frameRequest
    #prevTimeStamp = 0

    #progress = 0
    get removesSelf() { return true }

    constructor() {
        super()
        this.#s = this.attachShadow({ mode: "closed" })
        this.#createContent()
        if (shuffle)
            shuffleSims()
        else
            shuffle = true
    }

    connectedCallback() {
        this.#gameLoop(window.performance.now())
        this.#main.addEventListener("click", this.#onClick)
    }
    
    disconnectedCallback() {
        window.cancelAnimationFrame(this.#frameRequest)
        this.#main.removeEventListener("click", this.#onClick)
    }

    #onClick = (e) => {
        if (e.target !== this.#main) return
        this.#span.leave(this.#sim.iconRect)
    }

    /**
     * @param {DOMRect} rect 
     */
    #onIconClick = (icon, rect) => {
        this.#sim.classList.add("blur", "disabled")
        this.#span.show(icon, rect)
    }

    #createContent() {
        this.#s.innerHTML = CONTENT
        this.#main = this.#s.querySelector("main")
        this.#span = new Button(this.#s.querySelector("span"))
        this.#sim = document.createElement(`sim-${SIMS[0]}`)
        this.#sim.classList.add("sim")
        this.#main.append(this.#sim)
        this.#sim.addIcons(["about", "trifles", "tools", "tgames", "games", "blog", "settings", "updates", "help"], "./assets/icons/name.svg", this.#onIconClick)
        //TEXTS.fill(this.#s.firstElementChild)
        let style = document.createElement("style")
        style.textContent = STYLE
        this.#s.append(style)
    }
    
    #gameLoop = (timeStamp) => {
        this.#frameRequest = window.requestAnimationFrame(this.#gameLoop)
        let deltaT = timeStamp - this.#prevTimeStamp
        this.#prevTimeStamp = timeStamp
        if (deltaT == timeStamp)
            return
        deltaT = Math.round(deltaT * 10) / 10
        this.#sim.update(deltaT)

        let targetRect; let targetChanged = false
        if (this.#span.state == Button.STATES.back) {
            targetRect = this.#sim.iconRect
            targetChanged = this.#sim.iconRectChanged
            this.#sim.classList.toggle("blur", targetChanged)
        }
        this.#span.update(deltaT, targetRect, targetChanged)
        if (targetRect && this.#span.state != Button.STATES.back) {
            this.#sim.classList.remove("disabled")
            this.#sim.replaceIcon()
        }

        if (this.#span.state == Button.STATES.done) {
            if (this.#progress == 0) {
                if (["about", "settings", "updates", "help"].includes(this.#span.icon))
                    NAVIGATION.changePage("missing")
                else
                    NAVIGATION.changePage("list", this.#span.icon)
            }
            this.#progress += deltaT
            let inpo = Math.min(1, this.#progress / Button.EXIT_DUR)
            this.style.opacity = 1 - inpo
            if (inpo >= 1)
                this.remove()
        }
    }

}

function shuffleSims() {
    for (let i = 0; i < SIMS.length; i++)
        SIMS.push(SIMS.splice(Math.floor(Math.random() * SIMS.length - i), 1)[0])
}

class Button {

    /** @type {Element} */
    #ele
    #icon = ""

    #x = 0; #y = 0; #size = 0; #shadow = 0;

    #state = Button.STATES.inactive
    #start  = { x: 0, y: 0, size: 0, shadow: 0 }
    #target = { x: 0, y: 0, size: 0, shadow: 0 }
    #progress = 0

    get #title() { return this.#ele.querySelector("h1") }

    get icon() { return this.#icon }
    get state() { return this.#state }

    constructor(element) {
        if (!element) return
        this.#ele = element
        this.#ele.addEventListener("click", this.#onClick)
    }

    /**
     * @param {DOMRect} rect 
     */
    update(deltaT, rect, changed) {
        switch (this.#state) {   
            case Button.STATES.appear:
                this.#progress += deltaT
                this.#interpolate(this.#smooth(Math.min(1, this.#progress / Button.APPEAR_DUR)))
                this.#draw()
                if (this.#progress >= Button.APPEAR_DUR) {
                    this.#progress = 0
                    this.#state = Button.STATES.active
                    this.#ele.classList.add("showContent")
                }
                break
            case Button.STATES.back:
                this.#target.x = rect.left + rect.width / 2
                this.#target.y = rect.top + rect.width / 2
                if (changed) {
                    this.#progress = 0
                    this.#start.size = this.#size
                    this.#start.shadow = this.#shadow
                } else {
                    this.#reverseInterpolate(this.#smooth(this.#progress / Button.LEAVE_DUR))
                    this.#progress += deltaT
                    this.#interpolate(this.#smooth(Math.min(1, this.#progress / Button.LEAVE_DUR)))
                    this.#draw()
                    if (this.#progress >= Button.LEAVE_DUR) {
                        this.#progress = 0
                        this.#state = Button.STATES.inactive
                        this.#ele.classList.remove("show")
                        
                    }
                }
                break
            case Button.STATES.exit:
                this.#progress += deltaT
                this.#interpolate(this.#smoothBounce(Math.min(1, this.#progress / Button.FILL_DUR)))
                this.#draw()
                if (this.#progress >= Button.FILL_DUR) {
                    this.#progress = 0
                    this.#state = Button.STATES.done
                }
                break
        }
    }

    /**
     * @param {DOMRect} rect 
     */
    show(icon, rect) {
        if (this.#state != Button.STATES.inactive) return

        this.center()
        this.#size = this.#start.size = rect.width
        this.#x = this.#start.x = rect.left + rect.width / 2
        this.#y = this.#start.y = rect.top + rect.width / 2
        this.#shadow = this.#start.shadow = 0
        this.#draw()
        
        this.#icon = icon
        this.#title.innerText = TEXTS.get(icon)

        this.#state = Button.STATES.appear
        this.#ele.classList.add("show")
    }
    
    leave(rect) {
        if (this.#state == Button.STATES.active) {
            this.#ele.classList.remove("showContent")
            this.#progress = 0
        } else if (this.#state == Button.STATES.appear) {
            this.#progress = Button.LEAVE_DUR * (1 - this.#progress / Button.APPEAR_DUR)
        }
        
        Object.assign(this.#start, this.#target)
        this.#target.size = rect.width
        this.#target.x = rect.left + rect.width / 2
        this.#target.y = rect.top + rect.width / 2
        this.#target.shadow = 0

        this.#state = Button.STATES.back
    }

    #onClick = () => {
        if (this.#state != Button.STATES.active) return
        Object.assign(this.#start, this.#target)
        this.#target.size = Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2))
        this.#target.shadow = 2
        this.#ele.classList.remove("showContent")
        this.#state = Button.STATES.exit
    }

    #interpolate(inpo) {
        this.#size = this.#i("size", inpo)
        this.#x = this.#i("x", inpo); this.#y = this.#i("y", inpo);
        this.#shadow = this.#i("shadow", inpo)
    } #i(attr, i) { return this.#start[attr] + (this.#target[attr] - this.#start[attr]) * i }

    #reverseInterpolate(inpo) {
        this.#start.x = this.#ri("x", this.#x, inpo)
        this.#start.y = this.#ri("y", this.#y, inpo)
    } #ri(attr, val, i) { return i == 0 ? val : -((this.#target[attr] - val) / (1 - i) - this.#target[attr]) }

    #draw() {
        this.#ele.style.width = this.#ele.style.height = `${this.#size}px`
        this.#ele.style.left = `${this.#x}px`
        this.#ele.style.top = `${this.#y}px`
        let s = this.#shadow
        this.#ele.style.boxShadow = `${s * Button.SHADOW.x}px ${s * Button.SHADOW.y}px ${s * Button.SHADOW.blur}px ${s * Button.SHADOW.size}px rgb(0 0 0 / ${50 - s * Button.SHADOW.opacity}%)`
    }

    center() {
        this.#target.size = Math.min(window.innerHeight, window.innerWidth) * .75
        this.#target.x = window.innerWidth / 2
        this.#target.y = window.innerHeight / 2
        this.#target.shadow = 1
    }

    // From : https://easings.net/#easeInOutSine
    #smooth(x) {
        return -(Math.cos(Math.PI * x) - 1) / 2;
    }
    // From : https://easings.net/#easeInOutSine

    // From : https://easings.net/#easeInBack
    #smoothBounce(x) {
        const c1 = 1.70158; const c3 = c1 + 1;
        return c3 * x * x * x - c1 * x * x;
    }
    // From : https://easings.net/#easeInBack

}
Button.STATES = { inactive: "inactive", appear: "appear", active: "active", back: "back", exit: "exit", done: "done" }
Button.APPEAR_DUR = 1500; Button.LEAVE_DUR = Button.APPEAR_DUR; Button.FILL_DUR = 1000; Button.EXIT_DUR = 1000;
Button.SHADOW = { x: 2, y: 2, blur: 16, size: 16, opacity: 25 }

const CONTENT = `
    <main><span><h1></h1></span></main>
`
const STYLE = `
    main {
        width: 100vw; height: 100vh;
        position: relative;
    }

    .sim {
        transition: filter ${Button.APPEAR_DUR / 1000}s ease-out;
    }

    .disabled {
        pointer-events: none;
    }

    .blur {
        filter: blur(5px);
    }

    /*sim-zigzag {
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%) scale(.5);
        background-color: lightgreen;
    }*/

    span {
        display: none;
        position: absolute;
        transform: translate(-50%, -50%);
        border-radius: 100%;
        background-color: #18d;
        z-index: 5;
    }
    
    span.show {
        display: grid;
        place-items: center;
        color: white;
    }

    span img {
        filter: invert(1);
        pointer-events: none;
    }

    h1 {
        display: none;
    }

    .showContent h1 {
        display: initial;
        transition: opacity .25s;
    }

    .showContent:hover h1 {
        opacity: .75;
    }

` 