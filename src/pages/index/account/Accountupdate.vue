<template>
   <el-card class="box-card">
        <h5>修改密码</h5>
        <el-form ref="form" :model="form" label-width="80px">

            <el-form-item label="原密码" id="old_pwd">
                <el-input v-model="form.oldpwd" placeholder="请输入原密码" ref="input_description" @blur.native.capture="checkoldpwd"></el-input>
                <div class="oldpwd_error" v-show="isoldpwdshow">原密码验证失败,请从新输入</div>
            </el-form-item>

            <el-form-item label="新密码" id="new_pwd">
                <el-input v-model="form.newpwd" placeholder="请输入密码" ></el-input>
            </el-form-item>

            <el-form-item label="确定密码" id="update_pwd" width="200px">
                <el-input v-model="form.surenewpwd" placeholder="请输入密码"></el-input>
            </el-form-item>

            
            <el-form-item>
                <el-button type="primary" size="small" @click="editpwd">修改</el-button>
                <el-button plain  size="small" type="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
    import {CHECKOLDPWD_API} from "@/api/apis.js"
    import {EDITPWD_API} from "@/api/apis.js"
    export default {
        data() {
            return {
                form: {
                    oldpwd: "",
                    newpwd: "",
                    surenewpwd: "",
                },
                imageUrl: '',
                isoldpwdshow:false,
                userid:parseInt(localStorage.getItem("userid"))

            };
        },
        methods:{
            // 检测旧密码是否正确
            checkoldpwd(){ 
                CHECKOLDPWD_API(this.form.oldpwd,this.userid).then(res=>{
                    res.data.code==0 ? this.isoldpwdshow = false : this.isoldpwdshow = true
                })
            },

            // 输入新密码
            editpwd(){
                EDITPWD_API(this.form.newpwd,this.userid).then(res=>{
                    if (res.data.code==0) {
                        this.$message({
                            message: '密码修改成功',
                            type: 'success',
                        });
                        setTimeout(()=>{
                            this.$router.push("/index/account/personal")
                        },1000)
                        
                    }
                })
                
            }
        }
    }
</script>

<style lang="less" scoped>
.el-card {
  h5 {
    border-bottom: 1px solid #ccc;
    line-height: 30px;
    margin-bottom: 20px;
  }
  .el-form{
      margin: 0 auto;
      width: 400px;
        #update_pwd,#old_pwd,#new_pwd{
            width: 300px;
        }
        .el-form-item{
            position: relative;
            .oldpwd_error{
                position: absolute;
                top: 30px;
                left: 0;
                color: #f00;
                font-size: 12px;
            }
        }
    }
  
}

</style>

