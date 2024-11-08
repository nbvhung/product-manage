// button-status 
const buttonStatus = document.querySelectorAll("[button-status]");
if(buttonStatus.length > 0){

    let url = new URL(window.location.href);// lấy ra url

    buttonStatus.forEach(button => {
        button.addEventListener("click",() => {
            const status = button.getAttribute("button-status");
            

            if(status){
                url.searchParams.set("status",status);
            }
            else{
                url.searchParams.delete("status");
            }

            window.location.href = url.href; // chuyển hướng trang
            console.log(url.href);
        });
    });
}
// end buttonStatus
  


// Form search 
const formSearch = document.querySelector("#form-search");
if(formSearch){
    let url = new URL(window.location.href);
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;

        if(keyword){
            url.searchParams.set("keyword", keyword);
        }
        else{
            url.searchParams.delete("keyword");
        }
        
        window.location.href = url.href;
    });
}
//end form search



// Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if(buttonsPagination){
    let url = new URL(window.location.href);

    buttonsPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");
            
            url.searchParams.set("page",page);

            window.location.href = url.href;
        });
    });
}
// End pagination



// Checkbox
const checkboxMulti = document.querySelector("[checkbox-multi]")
if(checkboxMulti){
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']");

    inputCheckAll.addEventListener("click", () => {
        //console.log(inputCheckAll.checked); // trả về true khi đc bấm vào và ngược lại
        if(inputCheckAll.checked){
            inputsId.forEach(input => {
                input.checked = true;
            });
        }
        else{
            inputsId.forEach(input => {
                input.checked = false;
            });
        }
    });

    inputsId.forEach(input => {
        input.addEventListener("click", () => {
            const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;//mỗi lần bấm lấy ra 1 id(queryselectorAll: trả về 1 mảng)
      
            if(countChecked == inputsId.length){
                inputCheckAll.checked = true;
            }
            else inputCheckAll.checked = false;
        });
    });
}
// End checkbox


// Form change multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti){
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault(); // ngăn việc load lại trang
        
        const checkboxMulti = document.querySelector("[checkbox-multi]");
        const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");

        const typeChange = e.target.elements.type.value;

        if(typeChange == "delete-all"){
            const isConfirm = confirm("Bạn có chắc muốn xóa những sản phẩm này?");

            if(!isConfirm){
                return;
            }
        } 

        if(inputsChecked.length > 0){
            const ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']");
            
            inputsChecked.forEach(input => {
                const id = input.value;

                if(typeChange == "change-position"){
                    const position = input.closest("tr").querySelector("input[name='position']").value;// closest: đi ra ngoài thẻ cha
                    
                    ids.push(`${id}-${position}`);
                }
                else{
                    ids.push(id);
                }
            });

            inputIds.value = ids.join(", ");// join: chuyển mảng thành string

            formChangeMulti.submit();
        }
        else{
            alert("Hãy chọn ít nhất 1 bản ghi!");
        }
    });
} 
// End form change multi 



// Show alert
const showAlert = document.querySelector("[show-alert]");
if(showAlert){
    const time = parseInt(showAlert.getAttribute("data-time"));

    const closeAlert = showAlert.querySelector("[close-alert]");

    setTimeout(() => {
        showAlert.classList.add("alert-hidden"); // add them class
    },time);

    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    });

}
// End show alert 

 

// Upload image
const uploadImage = document.querySelector("[upload-image]");
if(uploadImage){
    const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
    const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");

    uploadImageInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if(file){
            uploadImagePreview.src = URL.createObjectURL(file);
        }
    });
}
// End upload image



// Sort
const sort = document.querySelector("[sort]");
if(sort){
    let url = new URL(window.location.href);

    const sortSelect = sort.querySelector("[sort-select]");
    const sortClear = sort.querySelector("[sort-clear]");

    // sap xep
    sortSelect.addEventListener("change", (e) => {
        const value = e.target.value;
        const [sortKey, sortValue] = value.split("-");// chuyen 1 xau thanh mang

        url.searchParams.set("sortKey", sortKey);
        url.searchParams.set("sortValue", sortValue);

        window.location.href = url.href;
    });


    // bo sap xep
    sortClear.addEventListener("click", () => {
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");

        window.location.href = url.href;
    });

    // them selected cho option
    const sortKey = url.searchParams.get("sortKey");
    const sortValue = url.searchParams.get("sortValue");

    if(sortKey && sortValue){
        const stringSort = `${sortKey}-${sortValue}`;
        const optionSelected = sortSelect.querySelector(`option[value='${stringSort}']`);
        optionSelected.selected = true;
    }
}
// End Sort