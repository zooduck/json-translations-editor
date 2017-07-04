import {loading_screen} from "./dom_service";

export const loadingService = (function(){
    let isLoaded = true;
    return function() {
        return {
            show: (delay = 0) => {
                setTimeout( () => {
                    loading_screen.classList.add("active");
                }, delay);
            },
            hide: (delay = 0) => {
                setTimeout( () => {
                    loading_screen.classList.remove("active");
                    loadingService().setLoaded();
                }, delay);
            },
            isLoading: () => {
               return isLoaded;
            },
            setLoaded: () => {
                return isLoaded = true;
            },
            setLoading: () => {
                return isLoaded = false;
            }
        }
    }
})();