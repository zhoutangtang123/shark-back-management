<template>
    <el-card class="box-card">
        <h5>管理员信息</h5>
         <ul id="list" v-for="item in accountInfoarr" :key="item.id">
             <li> <p>管理员id</p> <span>{{item.id}}</span></li>
             <li> <p>账号</p> <span>{{item.account}}</span></li>
             <li> <p>用户组</p> <span>{{item.userGroup}}</span></li>
             <li> <p>创建时间</p> <span>{{item.ctime.substr(0,10)}}</span></li>
             <li> <p>管理员头像</p> <img :src="item.imgUrl" alt="" style="width:160px;  height:160px ; border:1px soild #ccc; border-radius:5px"></li>
             <li> <p>上传头像</p> 
             <el-upload
                class="avatar-uploader"
                action="http://127.0.0.1:5000/users/avatar_upload"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :data="data"
            >
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
             
             </li>
         </ul>
        
    </el-card>
</template>

<script>
//PERSONAL_API获取个人信息
import { PERSONAL_API } from "@/api/apis.js"


export default {
    data(){
        return{
            id:parseInt(localStorage.userid),
            accountInfoarr:[],
            imageUrl: '',
            data:{}, //上传图片的时候传递的参数

        }
    },
    methods:{
        //获取个人中心信息
        querypersonalinfo(){
            PERSONAL_API(this.id).then(res=>{
                this.accountInfoarr.push(res.data.accountInfo)  //将得到的数据放到要循环的数组里面
                this.data={id:localStorage.userid}
            })
        },

        handleAvatarSuccess(res) { //图片上传成功触发的函数  将图片上传之后返回的res里面的图片地址给数组里面的图片地址
            this.accountInfoarr.imgUrl = res.imgUrl
            
            window.location.reload() //在从新刷新页面
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        }

    },
    created(){
        this.querypersonalinfo()  //创建页面的时候获取数据
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
    #list{
        list-style: none;
        li{
            line-height: 40px;
            border-bottom: 1px solid #ccc;
            display: flex;
            font-size: 12px;
            padding: 5px 0;
            p{
                width: 65px;
                margin-right: 10px;
                
                
            }
            span{
                color: #f00;
            }
        }
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }

   
  
}

</style>