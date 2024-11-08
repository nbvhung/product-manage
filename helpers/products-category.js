const ProductCategory = require("../models/product-category.model");

module.exports.getSubCategory = async (parentId) => {
    const getCategory = async (parentId) => {
        const subs = await ProductCategory.find({ // tìm con cho id cha
            parent_id: parentId,
            status: "active",
            deleted: false
        });
    
        let allSub = [...subs]; // sao chép tất cả phần tử vào allSub
    
        for (const sub of subs) {
            const childs = await getCategory(sub.id); // gọi đệ quy tìm dang mục con
            allSub = allSub.concat(childs); // nối mảng childs vào allSub
        }
    
        return allSub;
    }
    const result = await getCategory(parentId);
    return result;
}