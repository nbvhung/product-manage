module.exports = (objectPagination, query, countProducts) => {
    if(query.page){
        objectPagination.currentPage = parseInt(query.page);// trang go tren url chuyen ve int
    }

    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;

    
    const totalPage = Math.ceil(countProducts/objectPagination.limitItems);
    objectPagination.totalPage = totalPage;

    return objectPagination;
}