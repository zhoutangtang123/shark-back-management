<template>
<div id="input_box">
    <div class="login_box">
        <h4>鲨鱼黑帮餐饮管理系统</h4>
        <el-input v-model="acc" placeholder="请输入管理员账号" class="input_acc"></el-input>
        <el-input v-model="pwd" placeholder="请输入密码" class="inpur_pwd"></el-input>
        <el-button type="primary" class="login_btn" @click="clickLogin">登录</el-button>
    </div>
</div>
    
</template>

<script>
    // 引入接口文件
    import {LOGIN_API} from "@/api/apis.js"
    export default {
        data(){
            return{
                acc:"",
                pwd:"",
                isclick:true,
            }
        },
        methods:{

            clickLogin(){
                //1: 如果是false就返回,不执行下面的代码
                if (this.isclick==false) return
                //2: 发送请求
                // 使用api接口返回的对象.then进行操作   发送请求
                LOGIN_API(this.acc,this.pwd).then((res)=>{
                    // 将用户id存起来
                    // console.log(res.data);
                    
                    localStorage.userid = res.data.id
                    localStorage.userrole = res.data.role
                    localStorage.useracc = this.acc
                    localStorage.usertoken = res.data.token
                    if(res.data.code==0){
                        this.$message({
                            message:"登录成功",
                            type: 'success'
                        });
                        this.$router.push("/index/home")
                    }
                })
                // 3:将标杆设置为false
                this.isclick=false;

                // 4:3秒时候又改过来 为true 目的是防止有用户账号或是密码输入错误疯狂点击,疯狂发送你个请求,浪费内存
                setTimeout(() => {
                    this.isclick=true

                }, 3000);
                
            }
            
        },
    }
</script>

<style lang="less">
@basecolor:#2D3A4B;

#input_box{
    width: 100%;
    height: 100%;
    background-color: @basecolor;
    display: flex;
    justify-content: center;
    align-items: center;
    .login_box{
        width: 360px;
        h4{
            text-align: center;
            color: #ccc;
            margin-bottom: 20px;
        }
        .inpur_pwd{
            margin-top: 12px;
        }
        .login_btn{
            width: 360px;
            margin-top: 16px;
        }
    }
}
</style>