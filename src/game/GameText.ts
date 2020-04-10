export enum TextTerm {
    Level= "level",
    LevelSelection= "levelSelection"
}

export enum Language {
    GREEK,
    ENGLISH
}

const GREEK_TEXT: Map<string, string> = new Map([
    [TextTerm.Level,"Πίστα"],
    [TextTerm.LevelSelection, "(Πίστες)"]
])
const ENGLISH_TEXT: Map<string, string> = new Map([
    [TextTerm.Level, "Level"],
    [TextTerm.LevelSelection, "(Levels)"]
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