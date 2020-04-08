export enum TextTerm {
    Level= "level"
}

export enum Language {
    GREEK,
    ENGLISH
}

const GREEK_TEXT: Map<string, string> = new Map([
    [TextTerm.Level,"Πίστα"]
])
const ENGLISH_TEXT: Map<string, string> = new Map([
    [TextTerm.Level, "Level"]
])

export class GameText {
    language: Language
    textMap: Map<string, string>
    constructor(language: Language) {
        this.language = language
        switch(this.language) {
            case Language.ENGLISH:
                this.textMap = ENGLISH_TEXT
                break;
            case Language.GREEK:
                this.textMap = GREEK_TEXT
                break
            default:
                this.textMap = ENGLISH_TEXT
        }
    }

    text(term: TextTerm): string {
        return this.textMap.get(term)
    }

}

export default {GameText, Language, TextTerm}