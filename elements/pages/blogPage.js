export const tagName = "page-blog"
export default class Blog extends HTMLElement {

    /** @type {ShadowRoot} */
    #s = null

    constructor() {
        super()
    }

    connectedCallback() {
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
    <main>
        <article>
            <h1>Ce site web est absolument futile</h1>
            <p>Futile : « Qui attache de l'importance à des choses qui n'en ont pas ». (Larousse) Ma mère m'a toujours dit : « Pis, euh… c’est quoi le but de ce que tu m’expliques depuis 10 minutes? » C’est avec fierté que je ne possède pas de réponse à cette question! Bref, ce site web qui, dans un sens, peut être considéré comme un portfolio <small>ou peut-être comme un moyen de mettre en pratique mes connaissances et d’en découvrir de nouvelles</small>, a, en réalité, des intentions beaucoup plus sombres. <strong>Être encore plus inutile que ton doomscroll quotidien! (Rire diabolique)</strong> Et, tant qu’à faire tous ces efforts, pourquoi pas en… <del>profiter pour avoir des réflexions intéressantes sur la vie et notre culture, etc.</del> Mais, inquiète-toi pas avec ça haha, ce site web est certainement juste un autre truc rigolo sur l’internet avec lequel tu auras l’opportunité de perdre autant de temps que tu veux! Donc, laisse-moi te diriger à travers des allées de patentes qui servent à rien et te brainwash à devenir violent ou violente grâce à mes jeux vidéo et émerveille-toi devant la splendeur de Clachou! <small>(En fait, Clachou c’est pas vraiment le site web, c’est plus mon pseudo, mais tu peux t’émerveiller devant ma splendeur aussi si tu veux mon chou.)</small></p>
            <h2>À quoi s’attendre?</h2>
            <p>La majorité des produits présents sur le site web rentrent dans deux catégories : les jeux et les bricoles. Vous savez déjà c’est quoi un jeu vidéo. Le médium artistique le plus <strong>complet et glorieux</strong> ajoutant à la cinématographie l'interaction de l’interlocuteur permettant ainsi une immersion inégalable le forçant à réfléchir avec profondeur aux conséquences de ses actes… ou bien… <small>“le p’tit bonhomme qui ramasse l’étoile”...</small> si t’es ma mère. Bref, une bricole est similaire dans le sens que c’est une expérience digitale, par contre quand je l’ai fait j’ai décidé que ce n’était pas un jeu pour quelconque raison, souvent à cause d’un manque de gameplay. <strong>Ceci étant dit!</strong> Ne te méprends guère. Je ne fais pas ces projets dans le but que tu les apprécies! Certes! Je les fais parce que j’ai envie de les faire, <small>et qui sait réellement pourquoi mon esprit a envie de les faire. J’ai des frissons juste à y penser!</small> Alors, prépare-toi à être charmé par certains projets, confus par d’autres et même peut-être activement déçu ou troublé par quelques-uns.</p>
            <p>La troisième catégorie principale englobe les outils. Donc, tout ce qui sort de la démarche artistique pour prioriser un but pratique. Ça inclut les projets que je fais pour répondre à un de mes besoins, ceux que je pense qui manque à l'humanité et ceux que j’ai simplement envie de faire <small>parce que je suis une nerd</small> euh parce que j’ai des passe-temps… <strong>intéressants et exemplaires!</strong></p>
            <p>En résumé, j’ai envie de me surpasser et de développer ma créativité à travers des projets sortant des normes. Ainsi, sur ce site web, tu peux t’attendre à des projets reflétant le processus dans lequel je me surpasse et développe ma créativité à travers des projets sortant des normes. <small>Ça me semble assez logique.</small> J’espère de tout mon coeur que je saurai rendre mon contenu assez intéressant pour que, de temps à autre, tu ais envie d’en apprendre plus sur un sujet abordé dans un jeu ou que, peut-être, tu ais envie d'approfondir une réflexion qu’une bricole a fait naître en toi. Si cela se produit, le blog sera présent pour allonger le contenu et partager le derrière des coulisses.</p>
            <h2>Qui est Clachou?</h2>
            <p>Après un diplôme en programmation, j’ai appris que je n’aime pas programmer pour les autres. <small>Les autres sont boring! <del>Pourquoi c’est juste moi qui a des bonnes idées? Arg!</del></small> Par contre, j’ai appris que j’adore écouter et supporter les autres. J’ai maintenant un background en programmation et en sciences sociales. J’aimerais également avoir des études en art, mais bon, on peut pas toutes les avoir.</p>
            <p>Même quand j’étais toute petite, j’inventais des jeux pour mes amis. Plusieurs d’entre eux n’ayant tristement jamais été testés. <small>Ma tête remplie de mouvements et d'histoires ne savait pas comment mettre ces idées sur papier et les appliquer.</small> Mais c’est correct, ça s’apprend! À l’adolescence, Donjon & Dragon, comme pour plusieurs, s’est ajouté à mes moyens d’appliquer ma créativité. Ensuite, depuis mes connaissances en programmation, dans le smoothie de rêves et de vidéos de chats qu’est le motton de neurones formant mon cerveau, se sont ajoutées plusieurs ambitions de développement de projets plus pratiques comme faire mon propre langage de programmation. <strong>Chut!</strong> <del>C’est toi l’nerd grrr.</del> Bref, j’ai maintenant vraiment hâte de pouvoir appliquer mes nouvelles connaissances sur l’humain et ses relations dans mes projets artistiques.</p>
            <p>Pour l’instant, je n’en dévoilerai pas davantage sur moi. Pour le souci de vous ajouter du contexte, je suis québécoise et je suis dans ma vingtaine. Voilà!</p>
            <q>Au plaisir de partager cette aventure avec toi!</q>
        </article>
    </main>
`
const STYLE = `
    :host {
        width: 100%; height: 100%;
    }

    main {
        width: 100%; height: 100%;
        overflow-y: auto;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    main::-webkit-scrollbar {
        display: none;
    }
    
    article {
        width: 50%;
        padding-top: 25px;
        padding-bottom: 50px;
        margin: auto;
        text-align: justify;
        font-family: sans-serif;
    }

    h1 {
        margin: 50px;
        text-align: center;
        font-size: 48px;
        font-weight: normal;
    }
    
    h2 {
        margin-top: 50px;
        font-size: 28px;
        font-weight: normal;
    }

    p, q {
        font-size: 18px;
    }

    q {
        display: block;
        text-align: center;
        text-decoration: none;
        margin-top: 50px;
    }

    strong {
        font-size: 22px;
        font-weight: normal;
    }

    small, del {
        font-size : 14px;
    }

` 