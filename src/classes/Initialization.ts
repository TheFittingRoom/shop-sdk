import { Locale } from "./Locale";
export class TheFittingRoomInit {
    public locale?: string = "en";
    public secret: string;
    public apiVersion: string;

    public constructor(currentScript) {
        const {searchParams} = new URL(currentScript.getAttribute("src"));
        const secret = searchParams.get("secret") || "";
        const language = searchParams.get("lang") || "en";
        const version = searchParams.get("version") || "";

        this.locale = language;
        this.secret = secret;
        this.apiVersion = version;

        Locale.setLocale(language);

        if(!secret) {
            const errorMessage = "A secret is required as an identifier for the brand"
            // console.error("TheFittingRoom:",errorMessage)
            
            window.theFittingRoom = {
                error: errorMessage,
                language, 
                secret, 
                version,
            }
        }
    }    
}