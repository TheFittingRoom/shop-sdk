import { Locale } from "./Locale";
export class TheFittingRoomInit {
    public locale?: string = "en";
    public secret: string;
    public apiVersion: string;

    public injectStyles() {
        const link1 = document.createElement('link');
        link1.rel = 'preconnect';
        link1.href = 'https://fonts.googleapis.com';

        const link2 = document.createElement('link');
        link2.rel = 'preconnect';
        link2.href = 'https://fonts.gstatic.com';
        link2.crossOrigin = 'crossOrigin';

        const link3 = document.createElement('link');
        link3.rel = 'stylesheet';
        link3.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap';
    
        const link4 = document.createElement('link');
        link4.rel = 'stylesheet';
        link4.href = 'https://fonts.googleapis.com/css2?family=Poppins&display=swap';

        const link5 = document.createElement('link');
        link5.rel = 'stylesheet';
        link5.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap';

        // const link6 = document.createElement('link');
        // link6.rel = 'stylesheet';
        // link6.href = '';

        document.getElementsByTagName('head')[0].appendChild(link1);
        document.getElementsByTagName('head')[0].appendChild(link2);
        document.getElementsByTagName('head')[0].appendChild(link3);
        document.getElementsByTagName('head')[0].appendChild(link4);
        document.getElementsByTagName('head')[0].appendChild(link5);
        // document.getElementsByTagName('head')[0].appendChild(link6);
    }

    public constructor(currentScript) {
        const {searchParams} = new URL(currentScript.getAttribute("src"));
        const secret = searchParams.get("secret") || "";
        const language = searchParams.get("lang") || "en";
        const version = searchParams.get("version") || "";

        this.injectStyles();
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