<template>
  <el-card class="box-card">
    <h5>商品添加</h5>
    <el-form ref="form" :model="form" label-width="80px">
      <!-- // name,category,price,imgUrl,goodsDesc -->
      <el-form-item label="商品名称" id="goods_name">
        <el-input v-model="form.name" placeholder="商品名称"></el-input>
      </el-form-item>

      <el-form-item label="商品分类">
        <el-select v-model="form.category" placeholder="请选择商品分类">

          <el-option :label="item.cateName" :value="item.cateName" v-for="(item,index) in categories" :key="index"></el-option>

        </el-select>
      </el-form-item>

      <el-form-item label="商品价格" id="goods_price">
        <el-input-number v-model="form.price" :min="1" :max="999" label="描述文字"></el-input-number>
      </el-form-item>

      <el-form-item label="商品图片">
        <el-upload
          class="avatar-uploader"
          list-type="picture-card"
          action="http://127.0.0.1:5000/goods/goods_img_upload"
          :show-file-list="true"
          :on-success="handleAvatarSuccess"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>

      </el-form-item>

      <el-form-item label="商品描述">
        <el-input type="textarea" v-model="form.goodsDesc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { CATEGORIES_API } from "@/api/apis.js"
import { GOODSADD_API } from "@/api/apis" ;

export default {
  data() {
    return {
      form: {
        name: "",
        category: "",
        price: "",
        goodsDesc: "",
      },
      imageUrl: "",
      num: 1,
      dialogImageUrl: "",
      dialogVisible: false ,//点击加号是否放大图片
      categories:[], //商品分类的数组
      disabled: false
    };
  },
  methods: {
    //上传成功之后就将他返回的图片名字给data里面的图片
    handleAvatarSuccess(res) {
      this.imageUrl = res.imgUrl;
    },

    // 点击添加商品
    onSubmit() {
      // name,category,price,imgUrl,goodsDesc
      let forminfo =this.form 
      GOODSADD_API(forminfo.name,forminfo.category,String(forminfo.price),this.imageUrl,forminfo.goodsDesc).then(()=>{
        this.$message({
          message: '添加商品信息成功',
          type: 'success'
        });
        this.$router.push("/index/goods/Goodslist")
        
        
        
      })
      // console.log(filelist);
    },
    
  },
  created(){
    //获取商品列表
    CATEGORIES_API().then(res=>{
      this.categories = res.data.categories
    })
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
  .el-form {
    #goods_name,
    #goods_price {
      width: 300px;
      
    }
  }

  //   图片上传框样式
  // .avatar-uploader .el-upload {
  //   border: 1px dashed #d9d9d9;
  //   border-radius: 6px;
  //   cursor: pointer;
  //   position: relative;
  //   overflow: hidden;
  // }
  // .avatar-uploader .el-upload:hover {
  //   border-color: #409eff;
  // }
  // .avatar-uploader-icon {
  //   font-size: 28px;
  //   color: #8c939d;
  //   width: 178px;
  //   height: 178px;
  //   line-height: 178px;
  //   text-align: center;
  // }
  // .avatar {
  //   width: 178px;
  //   height: 178px;
  //   display: block;
  // }
}
</style>