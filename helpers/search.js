module.exports = (query) => {

    let objectSearch = {
        keyword: ""
    }

    if(query.keyword){
        objectSearch.keyword = query.keyword;

        const regex = new RegExp(objectSearch.keyword, "i")// tìm kiếm không cần viết hẳn, "i" : tìm kiếm ko pb hoa thường
        objectSearch.regex = regex;
    }

    return objectSearch; 
}