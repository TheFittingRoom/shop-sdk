import { Locale } from "./Locale";
import "../styles"

export class TheFittingRoomInit {
    public locale?: string = "en";
    public key: string;
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
        link3.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500&family=Roboto&display=swap';

        document.getElementsByTagName('head')[0].appendChild(link1);
        document.getElementsByTagName('head')[0].appendChild(link2);
        document.getElementsByTagName('head')[0].appendChild(link3);
    }

    public constructor(currentScript) {
        const {searchParams} = new URL(currentScript.getAttribute("src"));
        // const key = searchParams.get("key") || "";
        const language = searchParams.get("language") || "en";
        const version = searchParams.get("version") || "";

        this.injectStyles();
        this.locale = language;
        // this.key = key;
        this.apiVersion = version;

        Locale.setLocale(language);

        window.theFittingRoom = {
            language, 
            version,
        }

        /*
        if(!key) {
            const errorMessage = "A key is required as an identifier for the brand"

            window.theFittingRoom = {
                error: errorMessage,
                language, 
                key, 
                version,
            }
        }
        */
    }
}