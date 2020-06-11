// 引入axios
import axios from 'axios';

// 设置axios的基础路径
axios.defaults.baseURL="http://127.0.0.1:5000/"

// 登录接口 account:用户名,password:密码
export const LOGIN_API = (account,password) =>  axios.post("/users/checkLogin",{account,password}) 

// 登录接口，检测token是否存在
export const CHECKTOKEN_API = (token) =>  axios.get("/users/checktoken",{params :{token}}) 







// 添加用户接口 account:用户名,password:密码 userGroup分组
export const ACCOUNTADD_API = (account,password,userGroup) =>  axios.post("/users/add",{account,password,userGroup}) 

// 用户列表接口 pageSize:每页条数,currentPage:当前页
export const ACCOUNTLIST_API = (currentPage,pageSize) =>  axios.get("/users/list",{params :{currentPage,pageSize}}) 

// 删除账号接口 id值
export const REMOVEACC_API = (id) =>  axios.get("/users/del",{params :{id}}) 

// 批量删除账号接口 id集合,字符串形式
 export const REMOVEACCMORE_API = (ids) =>  axios.get("/users/batchdel",{params :{ids}}) 

// 编辑账号信息接口 id,account 账号,userGroup 分组
export const EDITACC_API = (id,account,userGroup) =>  axios.post("/users/edit",{id,account,userGroup}) 

// 修改密码，检查旧密码是否正确 oldpwd
export const CHECKOLDPWD_API = (oldPwd,id) =>  axios.get("/users/checkoldpwd",{params :{oldPwd,id}})  

// 修改密码，输入新密码NEWPWD_API
export const EDITPWD_API = (newPwd,id) =>  axios.post("/users/editpwd",{newPwd,id}) 

//个人中心
export const PERSONAL_API = (id) =>  axios.get("/users/accountinfo",{params:{id}}) 








// 获取商品分类currentPage 当前页 pageSize每页条数 
export const CATELIST_API = (currentPage,pageSize) =>  axios.get("/goods/catelist",{params :{currentPage ,pageSize}})

// 添加商品分类接口 cateName:分类名称,state:是否启用 
export const ADDCATE_API = (cateName,state) =>  axios.post("/goods/addcate",{cateName,state}) 

// 删除商品分类 id当前条数的id值 
export const DELCATE_API = (id) =>  axios.get("/goods/delcate",{params :{id}})

// 编辑商品分类 id当前条数的id值 cateName分类名称 state是否启用
export const EDITCATE_API = (id,cateName,state) =>  axios.post("/goods/editcate",{id,cateName,state})

// 图片上传
export const IMGUPLOAD_API = (binary) =>  axios.post("/goods/goods_img_upload",{binary})

// 添加商品 
export const GOODSADD_API = (name,category,price,imgUrl,goodsDesc) =>  axios.post("/goods/add",{name,category,price,imgUrl,goodsDesc})

// 获取商品列表 currentPage 当前页 pageSize每页条数
export const GOODSLIST_API = (currentPage,pageSize) =>  axios.get("/goods/list",{params :{currentPage,pageSize}})


// 删除商品分类 id当前条数的id值 
export const GOODSDEL_API = (id) =>  axios.get("/goods/del",{params :{id}})


// 查询所有分类  已进入商品添加就获取
export const CATEGORIES_API = () =>  axios.get("/goods/categories")

// 编辑商品列表
export const GOODSEDIT_API = (name,category,price,imgUrl,goodsDesc,id) =>  axios.post("/goods/edit",{name,category,price,imgUrl,goodsDesc,id})






//获取订单列表
export const ORDERLIST_API = (currentPage,pageSize,orderNo,consignee,phone,orderState,date) =>  axios.get("/order/list",{params :{currentPage,pageSize,orderNo,consignee,phone,orderState,date}})

//获取订单详情 查看
export const ORDERDETAIL_API = (id) =>  axios.get("/order/list",{params :{id}})

//查询订单
export const ORDERSEARCH_API = (currentPage,pageSize,orderNo,consignee,phone,orderState,date) =>  axios.get("/order/search",{params :{currentPage,pageSize,orderNo,consignee,phone,orderState,date}})

// 编辑订单详情 
export const ORDEREDIT_API = (id,orderNo,orderTime,phone,consignee,deliverAddress,deliveryTime,remarks,orderAmount,orderState) =>  axios.post("/order/edit",{id,orderNo,orderTime,phone,consignee,deliverAddress,deliveryTime,remarks,orderAmount,orderState})





// 获取店铺详情
export const SHOPINFO_API = () =>  axios.get("/shop/info")

//修改店铺信息
export const SHOPEDIT_API = (id,name,bulletin,avatar,deliveryPrice,deliveryTime,description,score,sellCount,supports,date,pics) =>  axios.post("/shop/edit",{id,name,bulletin,avatar,deliveryPrice,deliveryTime,description,score,sellCount,supports,date,pics})



// 首页报表接口
export const ORDERTOTALDATA_API = () =>  axios.get("/order/totaldata")

// //订单报表接口
// export const ORDERDETAIL_API = (date) =>  axios.get("/order/ordertotal",{params :{date}})
// // /order/ordertotal
