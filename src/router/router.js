import Vue from "vue"
import VueRouter from "vue-router"

import Login from "../pages/Login.vue"
import { CHECKTOKEN_API } from "@/api/apis.js"

Vue.use(VueRouter)


let router =  new VueRouter({
    routes:[
        {
            path:"/",
            name:"login",
            component:Login,
        },
        
        {
            path:"/index",
            name:"index",
            component: () => import ("../pages/Index.vue"),
            children:[
                {
                    path:"/index/home",
                    name:"home",
                    component: () => import ("../pages/index/Home.vue"),
                },
                {
                    path:"/index/order",
                    name:"order",
                    component: () => import ("../pages/index/Order.vue"),
                },
                {
                    path:"/index/shop",
                    name:"shop",
                    component: () => import ("../pages/index/Shop.vue"),
                },
                {
                    path:"/index/goods",
                    name:"goods",
                    component: () => import ("../pages/index/Goods.vue"),
                    children:[
                        {
                            path:"/index/goods/goodsadd",
                            name:"goodsadd",
                            component: () => import ("../pages/index/goods/Goodsadd.vue"),
                        },
                        {
                            path:"/index/goods/goodslist",
                            name:"goodslist",
                            component: () => import ("../pages/index/goods/Goodslist.vue"),
                        },
                        {
                            path:"/index/goods/goodsclass",
                            name:"goodsclass",
                            component: () => import ("../pages/index/goods/Goodsclass.vue"),
                        },
                    ]
                },
                {
                    path:"/index/account",
                    name:"account",
                    component: () => import ("../pages/index/Account.vue"),
                    children:[
                        {
                            path:"/index/account/accountadd",
                            name:"accountadd",
                            component: () => import ("../pages/index/account/Accountadd.vue"), 
                        },
                        {
                            path:"/index/account/accountlist",
                            name:"accountlist",
                            component: () => import ("../pages/index/account/Accountlist.vue"), 
                        },
                        {
                            path:"/index/account/accountupdate",
                            name:"accountupdate",
                            component: () => import ("../pages/index/account/Accountupdate.vue"), 
                        },
                        {
                            path:"/index/account/personal",
                            name:"personal",
                            component: () => import ("../pages/index/account/Personal.vue"), 
                        },
                    ]
                },
                {
                    path:"/index/sales",
                    name:"sales",
                    component: () => import ("../pages/index/Sales.vue"),
                    children:[
                        {
                            path:"/index/sales/salesgoods",
                            name:"salesgoods",
                            component: () => import ("../pages/index/sales/Salesgoods.vue"),
                        },
                        {
                            path:"/index/sales/salesorder",
                            name:"salesorder",
                            component: () => import ("../pages/index/sales/Salesorder.vue"),
                        },
                    ]
                },
            ]
        },

    ]
})

//制作路由拦截  就是让用户在没有登录的时候是不能通过手动输入地址来访问网页的，只有当他还在登录状态的时候才可以访问网页
router.beforeEach(( to, from, next )=>{ //beforeEach 前置路由守卫//to表示要跳到哪里去的 hash   from表示跳转之前在那个页面的hash
    //beforeEach当路由发生改变之前拦截
    // console.log(to,from,);



    if ( to.path != "/") {  //表示所有的要跳转的页面只要路由不是 / 的都要做验证，发送token验证 有效直接跳转，无效跳转到登录页面
        CHECKTOKEN_API(localStorage.usertoken).then(res=>{
            if (res.data.code == 0) {
                next()
            } else {
                next("/")
            }
        })
    } else {
        next()
    }
    
    
    
})

export default router
