// DOM...
import {pagination_ctrls, table_rows} from "./dom_service";
// Services...
import {translationsTableService} from "./translations_table_service";

export const paginationService = (function() {
    let pagination = {}
    let currentPage = 1;
    let itemsPerPage = 10;
    const updateCurrentPage = (page) => {
        currentPage = page;
    };
    const getCurrentPage = () => {
        return currentPage;
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
    const loadPage = (page = 1) => {

        let pageToLoad = pagination.collections? pagination.collections[page - 1] : null;

        if (pageToLoad) {
            showCtrls(page);
            pagination_ctrls.querySelector(".pagination-info").innerHTML = `page ${page} of ${pagination.collections.length}`;
            for (let row of Array.from(table_rows.children)) {
                row.parentNode.removeChild(row);
            }
            for (let row of pageToLoad) {
                table_rows.appendChild(row);
            }
            updateCurrentPage(page);
            translationsTableService().resize();
        }       
    };
    const getPages = () => {
        return pagination;
    };
    return function () {
        return {
            setPages: (rows) => {

                pagination.collections = [];

                let collectionsAmount = rows.length / itemsPerPage;
                for (let i = 0; i < collectionsAmount; i++) {
                    pagination.collections.push(rows.splice(0, itemsPerPage));
                }                
                loadPage(); // load first page

                let shutterInDelays = 100 * 11; // there is a 100ms compounded animation-delay on first 10 rows
                setTimeout(function() {
                   for (let collection of getPages().collections) {
                        for (let row of collection) {
                            row.classList.remove("shutter-in");
                        }
                   }
                }, (shutterInDelays));
                if (pagination.collections.length > 1) {
                    pagination_ctrls.querySelectorAll("i")[1].classList.remove("disabled");
                }
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
            }
        }
    }
})();
