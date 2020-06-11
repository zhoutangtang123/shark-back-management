<template>
  <el-card class="box-card">
    <h5>店铺管理</h5>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="店铺名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item label="店铺公告">
        <el-input type="textarea" v-model="form.bulletin"></el-input>
      </el-form-item>

      <el-form-item label="店铺头像">
        <img :src="basepath+this.form.avatar" alt class="shop_header_img" />
      </el-form-item>

      <el-form-item label="店铺图片">

        <!-- :file-list="fileList" 图片一加载进来就显示的 -->
        <el-upload
          action="http://127.0.0.1:5000/shop/upload"
          list-type="picture-card"
          :file-list="fileList"
          :on-preview="handlePictureCardPreview"
          :on-success="handleAvatarSuccess"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="配送费">
        <!-- <el-input></el-input> -->
        <div >
          <el-input placeholder="请输入内容" v-model="form.deliveryPrice">
            <template slot="append">元</template>
          </el-input>
        </div>
      </el-form-item>

      <el-form-item label="配送时间">
        <div >
          <el-input placeholder="请输入内容"  v-model="form.deliveryTime">
            <template slot="append">分</template>
          </el-input>
        </div>
      </el-form-item>
      <el-form-item label="起送价格">
        <el-input v-model="form.minPrice"></el-input>
      </el-form-item>
      <el-form-item label="配送描述">
        <el-input v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label="店铺评分">
        <el-input v-model="form.score"></el-input>
      </el-form-item>
      <el-form-item label="销量">
        <el-input v-model="form.sellCount"></el-input>
      </el-form-item>

      <el-form-item label="活动">
        <el-checkbox-group v-model="form.supports">
          <el-checkbox label="在线支付满28减5" name="type"></el-checkbox>
          <el-checkbox label="VC无限橙果汁全场8折" name="type"></el-checkbox>
          <el-checkbox label="单人精彩套餐" name="type"></el-checkbox>
          <el-checkbox label="特价饮品5折购" name="type"></el-checkbox>
          <el-checkbox label="单人特色套餐" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="营业时间">
        <div class="block">
          <el-date-picker
            v-model="form.date"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </el-form-item>

      <el-form-item>
        
      </el-form-item>







    </el-form>
    <div>
      <el-button type="primary" style="margin: 40px auto; width: 160px; display:block;" @click="editshopinfo">确认修改店铺信息</el-button>
    </div>
    
  </el-card>
</template>

<script>
//SHOPINFO_API 获取店铺信息  SHOPEDIT_API 编辑店铺信息
import { SHOPINFO_API } from "@/api/apis"
import { SHOPEDIT_API } from "@/api/apis"


export default {
  data() {
    return {
      form: {   
        //name: 店铺名称,   bulletin:公告 ,   avatar:店铺头像 ,   deliveryPrice: 配送费,   deliveryTime: 送达时间,   description: 描述,   score: 评分,   sellCount: 销量,   supports: 活动,   pics: 商铺图片,   date: 营业时间,   minPrice: 起送价格,
        name: "",
        bulletin: "",
        avatar: "",
        deliveryPrice: "",
        deliveryTime: "",
        description: "",
        score: "",
        sellCount: "",
        supports: "",
        pics: "",
        date: "",
        minPrice: "",
      },
      basepath:'http://127.0.0.1:5000/upload/shop/',
      dialogImageUrl: '',
      dialogVisible: false,
      uploadpicarr:[],//上传图片数组
      fileList: [],//店铺图片数组

      
    };
  },
  created(){
    this.showshopinfo() 
  },
  methods: {
    //显示店铺类容函数
    showshopinfo(){
      SHOPINFO_API().then(res=>{
        let dataobj = res.data.data
        //赋值给form
        for (let key in dataobj) {
          this.form[key] = dataobj[key]
        }
        //店铺图片数组 fileList
        this.fileList = this.form.pics.map((item)=>{
          return {url:this.basepath+item} //将获取的店铺图片给渲染图片的数组 是对象的形式
        })
      })
    },

    handleAvatarSuccess(res) {
      this.form.pics.push(res.imgUrl)  //图片上传成功之后将图片名字加到图片数组里面
    },

    handleRemove(file) { //移除图片 file被删除的, fileList 剩下的图片数组
      let index = file.url.lastIndexOf("/")  //file被删除的文件的/的索引 
      let item = file.url.substr(index+1)   //获取图片地址/之后的内容
      this.form.pics.splice(this.form.pics.indexOf(item),1) //将得到的内容在pics数组的那个索引开始删除1个
    },
    handlePictureCardPreview(file) { //预览图片时调用
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    // 转换时间为"2019-10-05 00:00:00" 格式的函数
    GMTToStr(time){
      let date = new Date(time)
      let Str=date.getFullYear() + '-' +
      (date.getMonth() + 1) + '-' + 
      date.getDate() + ' ' + 
      date.getHours() + ':' + 
      date.getMinutes() + ':' + 
      date.getSeconds()
      return Str
    },
    //点击编辑店铺信息
    editshopinfo(){
      let {id,name,bulletin,avatar,deliveryPrice,deliveryTime,description,score,sellCount,supports,date,pics} =this.form //解构得到数据
      let datetime = [this.GMTToStr(date[0]),this.GMTToStr(date[1])] //将时间转成数组

      SHOPEDIT_API(id,name,bulletin,avatar,deliveryPrice,deliveryTime,description,score,sellCount,JSON.stringify(supports),JSON.stringify(datetime),JSON.stringify(pics)).then(()=>{
        this.showshopinfo()  //调用获取店铺信息函数
        
      })
    }

  },
 
};
</script>

<style lang="less" scoped>
.el-card {
  h5 {
    border-bottom: 1px solid #ccc;
    line-height: 30px;
    margin-bottom: 20px;
  }
  .el-form-item {
    .shop_header_img {
      width: 200px;
      border: 1px solid #ccc;
    }
    .shop_imgs {
      display: flex;
      flex-wrap: wrap;
      
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