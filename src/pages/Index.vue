<template>
  <el-container id="index_container">
      <!-- 左边栏 -->
    <el-aside width="200px">
        <!-- default-active="/index/home"  表示默认跳转到那个页面 -->
        <el-menu 
        :default-active="defaultactive" 
        class="el-menu-vertical-demo" 
        background-color="#545c64" 
        text-color="#fff" 
        active-text-color="#ffd04b" 
        router
        >
            <!-- 像这种的里面有一级菜单又有二级菜单的 就在要循环的外面前台一个div,然后在判断循环条件 -->
            <div v-for="item in newtreelist" :key="item.index">
                
                <!-- 有二级菜单的 通过是否有children判断是否存在-->
                <el-submenu v-if="item.children" :index="item.index">
                    <template slot="title">
                        <i :class="item.ical"></i>
                        <span>{{item.title}}</span>
                    </template>
                    <el-menu-item-group v-for="child in item.children" :key="child.index">
                        <el-menu-item :index="child.index">{{child.title}}</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <!-- 没有二级菜单的 -->
                <el-menu-item v-else :index="item.index">
                    <i :class="item.ical"></i>
                    <span slot="title">{{item.title}}</span>
                </el-menu-item>

            </div>
        </el-menu>


    </el-aside>
    <!-- 右边 -->
    <el-container >
        <el-header>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item v-for="item in headerchangetext" :key="item">{{item}}</el-breadcrumb-item>
            </el-breadcrumb>

            <div class="demo-type header_img_box">
                <p class="header_acc">欢迎你 <span v-html="accname" ></span></p>
                <div>
                    <img :src="imgurl" id="header_pic"/>
                </div>
            </div>

        </el-header>
        <!-- 主题部分 -->
        <el-main>
            
            <!-- 组件部分 -->
            <router-view></router-view>
        </el-main>
    </el-container>
  </el-container>
</template>
<script>
//CHECKTOKEN_API 检查token 
import { CHECKTOKEN_API } from "@/api/apis.js"
//PERSONAL_API获取个人信息
import { PERSONAL_API } from "@/api/apis.js"



export default {
    data(){
        return{
            // 左边导航栏一级菜单数据index:路由,ical:小图标,title:文字,children:二级菜单
            treelist:[
                {index:"/index/home",ical:"el-icon-setting",title:"后台首页", role:["super","normal"]},
                {index:"/index/order",ical:"el-icon-document-remove",title:"订单管理", role:["super","normal"]},
                {index:"/index/shop",ical:"el-icon-collection",title:"店铺管理", role:["super","normal"]},
                {index:"/index/goods",ical:"el-icon-shopping-bag-1",title:"商品管理", role:["super","normal"],
                    children:[
                        {index:"/index/goods/goodsadd",title:"添加商品"},
                        {index:"/index/goods/Goodsclass",title:"商品分类"},
                        {index:"/index/goods/Goodslist",title:"商品列表"},
                    ]
                },
                {index:"/index/account",ical:"el-icon-user-solid",title:"账号管理", role:["super"],
                    children:[
                        {index:"/index/account/accountlist",title:"账号列表"},
                        {index:"/index/account/accountadd",title:"添加账号"},
                        {index:"/index/account/accountupdate",title:"修改密码"},
                        {index:"/index/account/personal",title:"个人中心"},
                    ]
                },
                {index:"/index/sales",ical:"el-icon-time",title:"销售统计", role:["super"],
                    children:[
                        {index:"/index/sales/salesgoods",title:"商品统计"},
                        {index:"/index/sales/salesorder",title:"订单统计"},
                    ]
                },
            ],
            // 右边头部显示的文字
            headerchangetext:[],
            // 默认跳转页面
            defaultactive:"",
            accname:"亲，请登录",
            role:"",//用户权限   在创建页面的时候给值
            imgurl:"" ,//头像图片地址


        }
    },
    methods:{
        hashchange(hash){
            var arr=[]
            switch(hash){
                case "/index/home" : arr=["后台首页"] ; break;
                case "/index/order" : arr=["订单管理"] ; break;
                case "/index/shop" : arr=["店铺管理"] ; break;
                case "/index/goods/goodsadd" : arr=["商品管理","添加商品"] ; break;
                case "/index/goods/Goodsclass" : arr=["商品管理","商品分类"] ; break;
                case "/index/goods/Goodslist" : arr=["商品管理","商品列表"] ; break;
                case "/index/account/accountlist" : arr=["账号管理","账号列表"] ; break;
                case "/index/account/accountadd" : arr=["账号管理","账号添加"] ; break;
                case "/index/account/accountupdate" : arr=["账号管理","修改密码"] ; break;
                case "/index/account/personal" : arr=["账号管理","个人中心"] ; break;
                case "/index/sales/salesgoods" : arr=["销售系统","商品统计"] ; break;
                case "/index/sales/salesorder" : arr=["销售系统","订单统计"] ; break;
            }
            this.headerchangetext = arr 
         
        },
        
    },
    watch:{
        // watch和方法、数据平级,可以监听hash值的变化,在vue项目里面使用了路由,就不能使用onhashchange监听hash值的变化,因为router里面就是使用的onhashchange事件,使用的是window.onchashchange事件,这样绑定的事件是不能重复绑定的,只会读取到最后一个,
        $route:{
            handler:function(val){ //val:是当前$route的所有信息 oldval 是前一个$route      $router和$route是有区别的
            window._this.hashchange(val.path) 
            }
        }
    },
    computed:{
        newtreelist(){ //计算属性，直接调用 一定要有返回值
            //通过权限判断要给新的treelist什么样的数据，渲染的时候渲染新的newtreelist，因为新的数组和原来的数组结构是一样的，只是做了一定的筛选

            //1：权限拦截，在用户登录的时候就保存他的权限 2：在配置树菜单的时候在每一个对象上面加上role权限数组，谁可以看就加上谁， 3：判断登录这的权限是什么，从树菜单里面挑选出来成一个新的数组， 4：渲染新的数组
            // return this.treelist.filter((item) =>{
            //    return item.role.includes(this.role)
            // })

           return this.treelist.filter((item) => item.role.includes(this.role))
        },

    },
    created(){
        // 页面从新加载的时候 还是应该显示前一次的页面而不是又跳转到首页了
        var hash=this.$route.path
        this.hashchange(hash)
        this.defaultactive = hash
        window._this = this 

        CHECKTOKEN_API(localStorage.usertoken).then(res=>{
            if (res.data.code == 0) {
                this.accname = localStorage.useracc
            } else {
                this.accname = "<a href='#/'>亲，请登录</a>"
            }
            
        })

        this.role= localStorage.userrole //创建页面的时候给角色

        //获取个人中心信息
        PERSONAL_API(parseInt(localStorage.userid)).then(res=>{
        
            this.imgurl = res.data.accountInfo.imgUrl //将得到的图片地址给右上角的头像图片
            
        })
        

        
    }
};
</script>

<style lang="less" scoped>
@basecolor: #545C64;
@basecolor2: #f0f2f5;
.el-container {
    height: 100%;
    .el-aside {
        background-color: @basecolor;
        .el-menu{
            border: 0;
        }
    }
    .el-header{
        .el-breadcrumb{
            margin-top: 22px;
        }
        
        display: flex;
        justify-content: space-between;
        .header_img_box{
            display: flex;
            font-size: 12px;
            padding-top: 24px;
            #header_pic{
                margin-left: 12px;
                width: 24px;
                height: 24px;
                border-radius: 12px;
            }
        }
    }
    .el-main {
        background-color: @basecolor2;
        
    }
}
</style>