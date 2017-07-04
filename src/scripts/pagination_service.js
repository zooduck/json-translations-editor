import {pagination_ctrls, table_rows} from "./dom_service";
import {translationsTableService} from "./translations_table_service";


export const paginationService = (function() {
    let pagination = {}
    let currentPage = 1;
    let itemsPerPage = 10;
    const updateCurrentPage = (page) => {
        currentPage = page;
    };
    const showCtrls = () => {
        pagination_ctrls.classList.add("active");
    };
    const loadPage = (page = 1) => {
        let pageToLoad = pagination.collections[page - 1];
        if (pageToLoad) {
            showCtrls();
            pagination_ctrls.querySelector(".pagination-info").innerHTML = `page ${page} of ${pagination.collections.length}`;
            for (let row of Array.from(table_rows.children)) {
                row.parentNode.removeChild(row);
            }
            for (let row of pageToLoad) {
                table_rows.appendChild(row);
            }
            updateCurrentPage(page);
        }
        translationsTableService().resize();
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
                console.log("pagination.collections:", pagination.collections);
                loadPage(); // load first page

                let shutterInDelays = 100 * 11; // there is a 100ms compounded animation-delay on first 10 rows
                setTimeout(function() {
                   console.log("getPages()", getPages());
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
            }
        }
    }
})();