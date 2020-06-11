<template>
    <el-card class="box-card">
        <h5>添加账号</h5>
        <el-form ref="form" :model="form" label-width="80px">

            <el-form-item label="账号" id="acc_add">
                <el-input v-model="form.account" placeholder="请输入账号"></el-input>
            </el-form-item>

            <el-form-item label="密码" id="acc_add_pwd">
                <el-input v-model="form.password" placeholder="请输入密码"></el-input>
            </el-form-item>

            <el-form-item label="用户组">
                <el-select v-model="form.userGroup" placeholder="请选择用户组">
                    <el-option label="超级管理者" value="superman" ></el-option>
                    <el-option label="普通管理者" value="commonman"></el-option>
                </el-select>
            </el-form-item>

            
            <el-form-item>
                <el-button type="primary" size="small" @click="clickadd">添加</el-button>
                <el-button plain  size="small" type="reset" @click="resetinput">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
import {ACCOUNTADD_API} from "@/api/apis.js"
export default {
    
    data() {
        return {
        form: {
            account: "",
            password: "",
            userGroup:"",
        },
        imageUrl: ''
        };
    },
    methods: {
        
        
        // 点击添加用户
        clickadd(){
            var userGroup =this.form.userGroup =="superman" ? "超级管理组" :"普通管理组"
            ACCOUNTADD_API(this.form.account,this.form.password,userGroup).then((res)=>{
                if (res.data.code==0) {
                    this.$message({
                        message:"登录成功",
                        type: 'success',
                    });
                }

                //1.5秒之后跳转到用户列表
                setTimeout(()=>{
                    this.$router.push("/index/account/accountlist")
                    this.resetinput()
                },1000)
                
            })
        },
        //点击重置表单  // 将输入框设置成空
        resetinput(){
            this.form.userGroup=""
            this.form.account=""
            this.form.password=""
        }


        
    }
};
</script>

<style lang="less" scoped>
.el-card {
    h5 {
        border-bottom: 1px solid #ccc;
        line-height: 30px;
        margin-bottom: 20px;
    }
    .el-form{
        width: 400px;
        margin: 0 auto;
        #acc_add,#acc_add_pwd{
            width: 300px;
        }
    }
  
}
</style>