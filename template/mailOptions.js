const environment = require('../environments/environment')

const registerOptions = (to, cusEmail, token) => {
    return {
        from: {
            name: 'ABC_OnlineAuction',
            email: `${environment.mailConfig.user}`
        },
        to: `${to}`,
        subject: 'Xác nhận Email',
        html: ` <h1>Chào ${cusEmail} thân mến! </h1><br>
                <h3>Bạn đã sử dung email ${to} để đăng ký tài khoản, chào mừng đến với trang website ABC Online Auction của chúng tôi</h3>
                <h3>Mã Xác minh: ${token}</h3><br>
                <h3>Lưu ý: Vui lòng không cung cấp mã này cho bất kì ai, mã xác minh chỉ được sử dụng 1 lần.</h3><br>
                <h3>Trân trọng!</h3>`
    }
    
}

const resetPasswordOptions = (to, cusEmail, newPassword) => {
    return {
        from: {
            name: 'ABC_OnlineAuction',
            email: `${environment.mailConfig.user}`
        },
        to: `${to}`,
        subject: 'Reset Password By Admin',
        html: ` <h1>Chào ${cusEmail} thân mến! </h1><br>
                <h3>Chúng tôi đã reset password tài khoản ${to}, mật khẩu của bạn sẽ là ${newPassword}</h3>
                <h3>Trân trọng!</h3>`
    }
    
}

const offerSuccessOwnerOptions = (to, ownerEmail, prodName, offerPrice) => {
    return {
        from: {
            name: 'ABC_OnlineAuction',
            email: `${environment.mailConfig.user}`
        },
        to: `${to}`,
        subject: 'Thong Bao Dau Gia',
        html: ` <h1>Chào ${ownerEmail} thân mến!</h1><br>
                <h3>Bạn đã đấu giá thành công sản phẩm ${prodName} với mức giá ${offerPrice}</h3>
                <h3>Trân trọng!</h3>`
    }
    
}

const offerSuccessOptions = (to, email, prodName) => {
    return {
        from: {
            name: 'ABC_OnlineAuction',
            email: `${environment.mailConfig.user}`
        },
        to: `${to}`,
        subject: 'Thong Bao Dau Gia',
        html: ` <h1>Chào ${email} thân mến! </h1><br>
                <h3>Đã có người khác đấu giá thành công sản phẩm ${prodName}</h3>
                <h3>Trân trọng!</h3>`
    }
    
}

const takePermissionOptions = (to, email, prodName) => {
    return {
        from: {
            name: 'ABC_OnlineAuction',
            email: `${environment.mailConfig.user}`
        },
        to: `${to}`,
        subject: 'Thong Bao Dau Gia',
        html: ` <h1>Chào ${email} thân mến! </h1><br>
                <h3>Lựt đấu giá sản phẩm ${prodName} của bạn đã bị từ chối</h3>
                <h3>Trân trọng!</h3>`
    }
    
}
  
const forgotPasswordOptions = (to, cusName, token) => {
    return {
        from: {
            name: 'ABC_OnlineAuction',
            email: `${environment.mailConfig.user}`
        },
        to: `${to}`,
        subject: 'Quên mật khẩu',
        html: ` <h1>Chào ${cusName} thân mến! </h1><br>
                <h3>Mã Xác minh quên mật khẩu: ${token}</h3><br>
                <h3>Lưu ý: Vui lòng không cung cấp mã này cho bất kì ai, mã xác minh chỉ được sử dụng 1 lần.</h3><br>
                <h3>Trân trọng!</h3>`
    }
}

const verifyBillOptions = (account, listProduct, address) => {
    
    var htmlOption = ` <h1>Chào quý khách thân mến! </h1><br>
    <h3>ABC_OnlineAuction gửi quý khách hóa đơn điện tử. Quý khách vui lòng xem chi tiết hóa đợn bên dưới.</h3>
    <h3>Thông tin đơn hàng:</h3>
    <h3>Địa chỉ giao hàng: ${address}</h3>
    <h3>Thông tin khách hàng:</h3>
    <h4>        - ${account.acc_email}</h4>
    <h4>        - ${account.acc_phone_number}</h4><br>
    <h3>Danh sách sản phẩm:</h3>
    <div id="infoList">
        <table class="table table-hover" id="tableCategory">
            <thead>
                <tr style="background-color:bisque">
                    <th scope="col" class="text-center" style="width: 25%">Tên sản phầm</th>
                    <th scope="col" style="width: 25%;" class="text-center">Mô tả</th>
                    <th scope="col" style="width: 15%;" class="text-center">số lượng</th>
                    <th scope="col" class="text-center">Giá</th>
                </tr>
            </thead>
            <tbody id="tbodyCateParent">`
    listProduct.forEach((prod) => {
        const price = prod.prod_price * prod.bdetail_quantity
        htmlOption += `\n<div id="">
                            <tr>
                                <div style="size:100px;margin:1%;background-color:aliceblue">
                                    <td class="text-center">
                                        <label>${prod.prod_name}</label>
                                    </td>
                                    <td class="text-center">
                                        <label>${prod.prod_description}</label>
                                    </td>
                                    <td class="text-center">
                                        <label>${prod.bdetail_quantity}</label>
                                    </td>
                                    <td class="text-center">
                                        <label>${price}</label>
                                    </td>
                                </div>
                            </tr>
                        </div>`
    })

    htmlOption += `\n</tbody>
                </table>
            </div>
            <h3>Tổng tiền đơn hàng: ${listProduct[0].bill_total_price} VNĐ</h3>
            <h3>Trân trọng!</h3>`
    
    return {
        from: {
            name: 'ABC_OnlineAuction',
            email: `${environment.mailConfig.user}`
        },
        to: `${account.acc_email}`,
        subject: 'Xác nhận đơn hàng',
        html: htmlOption
    }
}

module.exports = {
    registerOptions,
    forgotPasswordOptions,
    verifyBillOptions,
    offerSuccessOwnerOptions,
    offerSuccessOptions,
    takePermissionOptions,
    resetPasswordOptions
}