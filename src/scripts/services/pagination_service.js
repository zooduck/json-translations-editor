// DOM...
import {pagination_ctrls, table_rows} from "./dom_service";
// Services...
import {translationsService} from "./translations_service";
import {translationsTableService} from "./translations_table_service";
import {localStorageService} from "./local_storage_service";

export const paginationService = (function() {
    let pagination = {}
    let currentPage = 1;
    let lastViewedPage = 1; // the last viewed page that was not in a set of filtered results
    let itemsPerPage = 25;
    let filterActive = false;
    
    const isFilterActive = () => {        
        return filterActive;
    };
    const updateCurrentPage = (page) => {
        currentPage = page;
    };
    const getCurrentPage = () => {
        return currentPage;
    };
    const setLastViewedPage = (page) => {
        lastViewedPage = page;
    };    
    const getLastViewedPage = () => {
        return lastViewedPage;
    };
    const showCtrls = (page) => {

        pagination_ctrls.classList.add("active");

        let previousPageCtrl = pagination_ctrls.querySelector("i");
        let nextPageCtrl = pagination_ctrls.querySelectorAll("i")[1];

        let previousPageCtrlClassListType = page > 1 ? "remove" : "add";
        let nextPageCtrlClassListType = page < getPages().collections.length ? "remove" : "add";

        previousPageCtrl.classList[previousPageCtrlClassListType]("disabled");
        nextPageCtrl.classList[nextPageCtrlClassListType]("disabled");     
        
    };
    const setPaginationInfo = (txt) => {
        pagination_ctrls.querySelector(".pagination-info").innerHTML = txt;
    };
    const loadPage = (page = getCurrentPage(), animate = true, filterCancelled = false) => {       

        if (isFilterActive() === false && filterCancelled) {          
            page = getLastViewedPage();
        }

        let pageToLoad = pagination.collections? pagination.collections[page - 1] : null;
        let paginationInfoText = `page ${page} of ${pagination.collections.length}`;

        if (pageToLoad) {
            
            setPaginationInfo(paginationInfoText);
            showCtrls(page);                  
            
            for (let row of Array.from(table_rows.children)) {
                row.parentNode.removeChild(row);
            }

            let classListMethod = animate ? "add" : "remove";
            for (let row of pageToLoad) {
                let tdEls = row.querySelectorAll(".td");
                for (let tdEl of tdEls) {
                    tdEl.classList[classListMethod]("pop-in");
                }
            }

            for (let row of pageToLoad) {
                table_rows.appendChild(row);
            }
           
            if (isFilterActive() === false && event && event.type === "click") {                
                // this is for restoring position after filter is removed and from importing saved progress
                setLastViewedPage(page);
                localStorageService().setLocalStorageItem("JTE_PAGE", page);
                translationsService().UpdateTranslations({type: ["page"]});                
            }

            updateCurrentPage(page);
            
            translationsTableService().resize();

        } else if (isFilterActive() === true) { // filter is used and there are no results...

            for (let row of Array.from(table_rows.children)) {
                row.parentNode.removeChild(row);
            }
                     
            setPaginationInfo(paginationInfoText);
            showCtrls(page);                   
        }
    };
    const getPages = () => {
        return pagination;
    };
    return function () {
        return {
            setPages: (data, options = {page: 1, animate: true, filterCancelled: false}) => {

                pagination.collections = [];

                options.page = parseInt(options.page);

                let rows = Array.from(data);               
                let collectionsAmount = rows.length / itemsPerPage;              

                for (let i = 0; i < collectionsAmount; i++) {
                    pagination.collections.push(rows.splice(0, itemsPerPage));
                }               
               
                loadPage(options.page, options.animate, options.filterCancelled); // load first page (or last viewed page if using localStorage or exported data)

                if (isFilterActive() === false && options.filterCancelled === false) {                    
                    localStorageService().setLocalStorageItem("JTE_PAGE", options.page);
                }

                let shutterInDelays = 100 * 11; // there is a 100ms compounded animation-delay on first 10 rows
                setTimeout(function() {
                   for (let collection of getPages().collections) {
                        for (let row of collection) {
                            row.classList.remove("shutter-in");
                        }
                   }
                }, (shutterInDelays));              
            },
            loadNextPage: () => {
                return loadPage(currentPage + 1);
            },
            loadPreviousPage: () => {
                return loadPage(currentPage - 1);
            },
            showCtrls: () => {
                return showCtrls();
            },
            hideCtrls: () => {
                pagination_ctrls.classList.remove("active");
            },
            GetPages: () => {
                return getPages();
            },
            GetLastViewedPage: () => {
                return getLastViewedPage();
            },
            SetLastViewedPage: (page) => {
                return setLastViewedPage(page);
            },
            filterApply: () => {
                filterActive = true;
            },
            filterRemove: () => {
                filterActive = false;
            },
            isFilterActive: () => {
                return filterActive;
            }
        }
    }
})();
