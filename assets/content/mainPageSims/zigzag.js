const NODE_SIZE = 120
const SPACING = 2 * NODE_SIZE / 3
const PATTERN = NODE_SIZE + SPACING
const MOVE = (NODE_SIZE + SPACING) * 2
const DURATION = 4000
const PAUSE = 250

let rows = 0, cols = 0
let offset = {x: 0, y: 0}
/* Under Boundry class
const inBound = new Boundry()
const outBound = new Boundry()
*/

export const tagName = "sim-zigzag"
export default class ZigzagSim extends HTMLElement {

    /** @type {ShadowRoot} */
    #s = null
    /** @type {Element} */
    #main = null

    #ready = false

    /** @type {Array<Node>} */
    #nodes = []
    #pause = false
    #invert = Math.floor(Math.random() * 2) == 0
    #progress = 0
    #inpo = 0

    /** @type {Node} */
    #activeNode = null
    #activeNodeChanged = false
    #iconUrl = ""
    #onIconCallback = () => {}

    get iconRect() { return this.#activeNode.element.getBoundingClientRect() }
    get iconRectChanged() { return this.#activeNodeChanged }

    constructor() {
        super()
        this.#s = this.attachShadow({ mode: "closed" })
        this.#createContent()
        this.#main = this.#s.querySelector("main")
        this.#adjustSize()
        this.#init()
        this.#ready = true
    }

    connectedCallback() {
        this.#progress = 0
        this.#inpo = 0
    }

    addIcons(icons = [], url, callback) {
        this.#onIconCallback = callback
        this.#iconUrl = url
        icons.forEach(icon => {
            this.#inserIcon(icon, this.#nodes, true)
        })
    }

    /**
     * @param {Array<Node>} pool 
     */
    #inserIcon(icon, pool, init = false) {
        let failCmpt = 0
        /** @type {Node} */
        let node;
        do {
            node = pool[Math.floor(Math.random() * pool.length)]
            failCmpt++
            if (failCmpt > 100) return false
        } while ((init && !inBound.has(node)) || node.hasIcon)
        node.addIcon(icon, this.#iconUrl, this.#onIcon)
        return node
    }

    #onIcon = (e) => {
        let icon = e.target.getAttribute("icon")
        e.target.classList.add("active")
        this.#activeNode = this.#nodes.find(n => n.icon == icon)
        this.#onIconCallback(icon, e.target.getBoundingClientRect())
    }

    update(deltaT) {
        if (!this.#ready) return
        this.#progress += deltaT
        if (this.#pause) {
            if (this.#progress > PAUSE) {
                this.#progress %= PAUSE
                this.#pause = false
            }
        }
        if (!this.#pause) {
            this.#activeNodeChanged = false
            let newNodes = []
            let inpo = this.#smooth(Math.min(1, this.#progress / DURATION))
            let move = (inpo - this.#inpo) * MOVE
            this.#inpo = inpo
            for (let i = this.#nodes.length - 1; i >= 0; i--) {
                const node = this.#nodes[i]
                if (node.move(move, this.#invert)) {
                    let n = new Node(node.x + (node.invert ? PATTERN : -PATTERN), node.y + (node.invert == this.#invert ? -PATTERN : PATTERN) )
                    n.invert = node.invert
                    this.#nodes.push(n)
                    newNodes.push(n)
                    this.#main.insertAdjacentElement("beforeend", n.element)
                } else if (node.isOut) {
                    node.remove()
                    if (node.hasIcon) {
                        let enteringNodes = this.#nodes.filter(n => !n.hasBeenInbound && (inBound.hasY(n) || i % 10 == 0))
                        let n
                        if (!(n = this.#inserIcon(node.icon, enteringNodes)))
                            n = this.#inserIcon(node.icon, this.#nodes)
                        if (node === this.#activeNode)  {
                            console.log(this.#main.contains(n.element))
                            console.log(n.element.getBoundingClientRect())
                            this.#activeNode = n
                            n.element.classList.add("active")
                            this.#activeNodeChanged = true
                        }
                    }
                    this.#nodes.splice(i, 1)
                }
            }
            if (this.#progress >= DURATION) {
                this.#progress %= DURATION
                this.#pause = true
                this.#invert = !this.#invert
                this.#inpo = 0
            }
        }
    }

    replaceIcon() {
        this.#activeNode.element.classList.remove("active")
        this.#activeNode = null
    }

    #createContent() {
        this.#s.innerHTML = CONTENT
        let style = document.createElement("style")
        style.textContent = STYLE
        this.#s.append(style)
    }

    #init() {
        let rnd = Math.floor(Math.random() * 2)
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                let node = new Node(offset.x + PATTERN * j, offset.y + PATTERN * i)
                this.#nodes.push(node)
                node.invert = (i + j + rnd) % 2
                this.#main.insertAdjacentElement("beforeend", node.element)
            }
        }
    }

    #adjustSize() {
        rows = Math.ceil(window.innerHeight / PATTERN)
        offset.y = (window.innerHeight - PATTERN * rows) / 2
        cols = Math.ceil(window.innerWidth / PATTERN)
        offset.x = (window.innerWidth - PATTERN * cols) / 2
        rows += 1; cols += 1;

        inBound.set(0, 0, window.innerWidth, window.innerHeight)
        outBound.set(-PATTERN, -PATTERN, window.innerWidth + PATTERN * 2, window.innerHeight + PATTERN * 2)
    }

    // From : https://easings.net/#easeInOutSine
    #smooth(x) {
        return -(Math.cos(Math.PI * x) - 1) / 2;
    }
    // From : https://easings.net/#easeInOutSine

}

class Node {

    #icon = ""
    #hasBeenInbound = false

    #x = 0; #y = 0;
    #axis = 0
    #invert = false
    /** @type {Element} */
    #ele = null

    get x() { return this.#x }
    get y() { return this.#y }
    get isWithin() { return this.#axis == 2 }
    get isOut() { return !this.isWithin && !outBound.has(this) }

    get invert() { return this.#invert }
    set invert(val) { this.#invert = !!val }

    get element() { return this.#ele }

    get hasIcon() { return !!this.#icon }
    get icon() { return this.#icon }
    get hasBeenInbound() { return this.#hasBeenInbound }

    constructor(x, y) {
        this.#x = x; this.#y = y;
        this.#ele = document.createElement("span")
        this.#place()
        this.#axis = inBound.hasAxis(this)
        this.#hasBeenInbound = this.#axis == 2
    }

    addIcon(icon, url, callback) {
        if (this.#icon) return
        let img = document.createElement("img")
        img.setAttribute("src", url.replace("name", icon))
        this.#ele.insertAdjacentElement("beforeend", img)
        this.#ele.setAttribute("icon", icon)
        this.#ele.addEventListener("click", callback)
        this.#icon = icon
    }

    move(delta, invertY = false) {
        if (this.#invert)
            delta *= -1
        this.#x += delta; this.#y += invertY ? -delta : delta
        this.#place()
        return this.#borderCollisions()
    }

    #borderCollisions() {
        if (this.isWithin) {
            this.#axis = inBound.hasAxis(this)
        } else {
            let axis = inBound.hasAxis(this)
            if (axis > this.#axis) {
                this.#axis = axis
                this.#hasBeenInbound = this.#hasBeenInbound || this.#axis == 2
                return true
            }
            this.#axis = axis
        }
        return false
    }

    #place() {
        this.#ele.style.top = `${this.#y}px`
        this.#ele.style.left = `${this.#x}px`
    }

    remove() {
        this.#ele.remove()
    }

}

class Boundry {

    #l = 0; #t = 0;
    #r = 0; #b = 0;

    constructor(x = 0, y = 0, w = 0, h = 0) {
        this.set(x, y, w, h)
    }

    set(x, y, w, h) {
        this.#l = x; this.#t = y;
        this.#r = x + w; this.#b = y + h;
    }

    /**
     * @param {Node} node 
     */
    has(node) {
        return  node.x >= this.#l &&
                node.y >= this.#t &&
                node.x <= this.#r &&
                node.y <= this.#b;
    }

    /**
     * @param {Node} node 
     */
    hasAxis(node) {
        let x = node.x >= this.#l && node.x <= this.#r
        let y = node.y >= this.#t && node.y <= this.#b
        return (x ? 1 : 0) + (y ? 1 : 0)
    }

    hasX(node) {
        return node.x >= this.#l && node.x <= this.#r
    }

    hasY(node) {
        return node.y >= this.#t && node.y <= this.#b
    }

}

const inBound = new Boundry()
const outBound = new Boundry()

const CONTENT = `
    <main><div></div></main>
`
const STYLE = `
    main {
        width: 100vw; height: 100vh;
        position: relative;
    }
    
    div {
        width: 100%; height: 100%;
        position: absolute;
        top: -${(NODE_SIZE + SPACING)}px; left: -${(NODE_SIZE + SPACING)}px;
        border: ${(NODE_SIZE + SPACING)}px solid lightskyblue
    }

    span {
        position: absolute;
        transform: translate(-50%, -50%);
        width: ${NODE_SIZE}px; height: ${NODE_SIZE}px;
        border-radius: 100%;
        display: grid;
        place-items: center;
        background-color: #18d;
    }

    span img {
        width: ${NODE_SIZE * .5}px;
        filter: invert(1);
        pointer-events: none;
        user-select: none;
    }

    span.active {
        opacity: 0;
    }
` 