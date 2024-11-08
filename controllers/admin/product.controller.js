const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");

const systemConfig = require("../../config/system");

const fillterStatusHelpers = require("../../helpers/filterStatus");
const searchHelpers = require("../../helpers/search");
const paginationHelpers = require("../../helpers/pagination");
const system = require("../../config/system");

const createTreeHelper = require("../../helpers/createTree");
//[GET] /admin/products
module.exports.index = async (req,res) => {

    // bộ lọc 
    let filterStatus = fillterStatusHelpers(req.query);

    let find = {
        deleted: false
    };

    // tìm kiếm
    if(req.query.status){
        find.status = req.query.status;
    } 

    const objectSearch = searchHelpers(req.query);

    if(objectSearch.regex){
        find.title = objectSearch.regex;
    }
     

    // pagination
    const countProducts = await Product.countDocuments(find);

    let objectPagination = paginationHelpers(
        { 
            currentPage: 1,
            limitItems: 4
        },
        req.query,
        countProducts
    );
    // end pagination

    // sort
    let sort = {};

    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue;// truyen 1 string dung []
    }
    else{
        sort.position = "desc";
    }

    // end sort

    const products = await Product.find(find)
        .sort(sort) // sap xep giam dan, "asc" : tang dan
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);

    for (const product of products) {
        // Lấy ra thông tin người tạo
        const user = await Account.findOne({
            _id: product.createdBy.account_id
        });
        
        if(user){
            product.accountFullName = user.fullName;// add thêm thuộc tính cho Product
        }

        // Lấy ra thông tin người cập nhật gần nhất
        const updatedBy = product.updatedBy[product.updatedBy.length-1];
        if(updatedBy){
            const userUpdated = await Account.findOne({
                _id: updatedBy.account_id
            });

            updatedBy.accountFullName = userUpdated.fullName;
        }
    }

    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}

// [PATCH] /change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    await Product.updateOne({_id: id}, {
        status: status,
        $push: {updatedBy: updatedBy}
    });// .updateOne: cap nhat 1 san pham

    req.flash("success", "Cập nhật trạng thái thành công!"); // thong bao khi cap nhat 
    res.redirect("back"); // chuyen huong tro lai trang admin/product, ko link sang trang khac
} 

//[PATCH] /change-multi
module.exports.changeMulti = async (req,res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", "); // split: chuyển xâu thành mảng

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    switch(type){
        case "active":
            await Product.updateMany({_id: {$in: ids}}, {
                status: "active",
                $push: {updatedBy: updatedBy}
            });
            req.flash("success", `Cập nhật trạng thái ${ids.length} sản phẩm thành công!`);
            break;
        
        case "inactive":
            await Product.updateMany({_id: {$in: ids}}, {
                status: "inactive",
                $push: {updatedBy: updatedBy}
            });
            req.flash("success", `Cập nhật trạng thái ${ids.length} sản phẩm thành công!`);
            break;

        case "delete-all":
            await Product.updateMany({_id: ids}, {
                deleted: true,
                deletedAt: new Date()
            });
            req.flash("success", `Đã xóa thành công ${ids.length} sản phẩm!`);
            break;

        case "change-position":
            for (const item of ids){
                let [id,position] = item.split("-");
                position = parseInt(position);
                
                await Product.updateOne({_id: id}, {
                    position: position,
                    $push: {updatedBy: updatedBy}
                });
            }
            req.flash("success", `Đổi vị trí ${ids.length} sản phẩm thành công!`);
            break;

        default:
            break;
    }
    res.redirect("back");
} 


// [DELETE] /admin/products/delete/:id   : xóa cứng(xóa vĩnh viễn)
// module.exports.deleteItem = async (req,res) => {
//     const id = req.params.id;

//     await Product.deleteOne({_id: id});

//     res.redirect("back");
// }

// xóa mềm : cho deleted: true
module.exports.deleteItem = async (req,res) => {
    const id = req.params.id;

    await Product.updateOne({_id: id}, {
        deleted: true,
        deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date(),
        }
    });

    req.flash("success", `Xóa thành công`);

    res.redirect("back");
}


//[GET] /admin/products/create
module.exports.create = async (req,res) => {
    let find = {
        deleted: false,
    };

    const category = await ProductCategory.find(find);

    const newCategory = createTreeHelper.tree(category);

    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm",
        category: newCategory
    });
}

//[POST] /admin/products/create
module.exports.createPost = async (req,res) => {
    

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if(req.body.position == ""){
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    }
    else{
        req.body.position = parseInt(req.body.position);
    }

    req.body.createdBy = {
        account_id: res.locals.user.id
    };

    const product = new Product(req.body);
    await product.save();

    res.redirect(`${systemConfig.prefixAdmin}/products`);
} 


//[GET] /admin/products/edit/:id
module.exports.edit = async (req,res) => {
    try{
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const product = await Product.findOne(find);
    
        const category = await ProductCategory.find({
            deleted: false,
        });
    
        const newCategory = createTreeHelper.tree(category);
    
        res.render("admin/pages/products/edit",{
            pageTitle: "chỉnh sửa sản phẩm",
            product: product,
            category: newCategory
        });
    }
    catch(error){
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    };
}

//[PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req,res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if(req.file){
        req.body.thumnail = `/uploads/${req.filename}`;
    }
    try {
        const updatedBy = {
            account_id: res.locals.user.id,
            updatedAt: new Date()
        }

        await Product.updateOne({_id: req.params.id}, {
            ...req.body,
            $push: {updatedBy: updatedBy}// cập nhật thêm thời gian chỉnh sửa
        });
        req.flash("success","Cập nhật thành công!");
    } catch (error) {
        req.flash("error","Cập nhật thất bại!");
    }

    res.redirect(`${systemConfig.prefixAdmin}/products`);
} 


//[GET] /admin/products/detail
module.exports.detail = async (req,res) => {
    try{
        const find = {
            deleted: false,
            _id: req.params.id
        }

        const product = await Product.findOne(find);

        res.render("admin/pages/products/detail",{
            pageTitle: product.title,
            product: product
        });
    }
    catch (error){
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};