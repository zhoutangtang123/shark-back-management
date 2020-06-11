<template>
  <el-card class="box-card">
    <h5>商品列表</h5>

    <el-table :data="tableData" style="width: 100%">
      <!-- 二级菜单 -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="商品 ID：">
              <span>{{ props.row.id }}</span>
            </el-form-item>

            <el-form-item label="商品名称：">
              <span>{{ props.row.name }}</span>
            </el-form-item>

            <el-form-item label="所属分类：">
              <span>{{ props.row.category }}</span>
            </el-form-item>

            <el-form-item label="商品价格：">
              <span>{{ props.row.price }}</span>
            </el-form-item>

            <el-form-item label="商品图片：">

              <img :src=" basepath + props.row.imgUrl " alt=""  width="160px" height="160px" /> 

            </el-form-item>

            

            <el-form-item label="创建时间：">
              <span>{{ props.row.ctime.substr(0,10) }}</span>
            </el-form-item>

            <el-form-item label="商品评价：">
              <span>{{ props.row.rating }}</span>
            </el-form-item>

            <el-form-item label="商品销量：">
              <span>{{ props.row.volume }}</span>
            </el-form-item>

            <el-form-item label="商品描述：">
              <span>{{ props.row.goodsDesc }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <!-- 一级菜单 -->

      <el-table-column label="商品名称" prop="name"></el-table-column>
      <el-table-column label="所属分类" prop="category"></el-table-column>
      <el-table-column label="商品价格" prop="price"></el-table-column>
      <el-table-column label="商品图片" width="240px">
        <template slot-scope="scope">
          <!-- 网络地址加图片接口 -->
          <img :src=" basepath + scope.row.imgUrl " alt="" width="160px" height="160px" />
        </template>

      </el-table-column>
      <el-table-column label="商品描述" prop="goodsDesc"></el-table-column>


      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>

          <el-dialog title="编辑商品" :visible.sync="dialogFormVisible">
            <el-form :model="form">

              <el-form-item label="商品名称" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off" size="small"></el-input>
              </el-form-item>

              <el-form-item label="商品分类" :label-width="formLabelWidth">
                <el-input v-model="form.category" autocomplete="off"  size="small"></el-input>
              </el-form-item>

              <el-form-item label="商品价格" :label-width="formLabelWidth">
                <div style="margin-top: 5px;">
                  <el-input placeholder="请输入内容" v-model="form.price"  size="small">
                    <template slot="append">元</template>
                  </el-input>
                </div>
              </el-form-item>

              <el-form-item label="商品图片" :label-width="formLabelWidth" class="editimg">
                <img :src="form.imgUrl" alt="" width="160px" height="160px">

                
                <el-upload
                  action="http://127.0.0.1:5000/goods/edit"
                  list-type="picture-card"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>

                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
                
              </el-form-item>

              <el-form-item label="商品描述" :label-width="formLabelWidth">
                <el-input v-model="form.goodsDesc" autocomplete="off"  size="small"></el-input>
              </el-form-item>

              
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="goodseditsure">确 定</el-button>
            </div>
          </el-dialog>

          <el-button size="mini" type="danger" @click="handleDelete( scope.row.id)" style="margin:10px">删除</el-button>
        </template>
      </el-table-column>







    </el-table>

    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5,10,20,40]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </el-card>
</template>

<script>
//GOODSLIST_API 获取商品列表 ,GOODSDEL_API删除商品 GOODSEDIT_API 编辑商品
import { GOODSLIST_API ,GOODSDEL_API } from "@/api/apis.js";
import { GOODSEDIT_API } from "@/api/apis.js" 


export default {
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 5,
      dialogFormVisible: false,
      basepath:'http://127.0.0.1:5000/upload/imgs/goods_img/',
      total:0,
      imageUrl:"",
      goodsid:"",
    
      form: {
        name: '',
        category: '',
        price: '',
        imgUrl: '',
        goodsDesc: '',
        id:"",
      },
      formLabelWidth: '120px',
      dialogImageUrl: '',
      dialogVisible: false
    };

  },


  methods: {

     //点击编辑
    handleEdit(data) {
      console.log(data);
      this.form.name = data.name
      this.form.category = data.category
      this.form.goodsDesc = data.goodsDesc
      this.form.price = data.price
      this.form.imgUrl = this.basepath + data.imgUrl
      this.form.id = data.id
      this.dialogFormVisible = true
      
    },
    //点击编辑过后的确定
    goodseditsure(){
      this.dialogFormVisible = false 
      let form=this.form 
      let index = this.form.imgUrl.lastIndexOf("/")
      let imgUrl = this.form.imgUrl.substr(index+1)
      
      
      GOODSEDIT_API(form.name,form.category,form.price,imgUrl,form.goodsDesc,form.id,).then(()=>{
        this.querydata();
        
      })
      
    },
  


    
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    handleAvatarSuccess(res, file) {
      console.log(res);
      
      this.imageUrl = URL.createObjectURL(file.raw);
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
    },







    // 页面显示条数改变时
    handleSizeChange(val) {
      this.pageSize = val;
      this.querydata();
    },
    //当前页改变时
    handleCurrentChange(val) {
      this.currentPage = val;
      this.querydata();
    },
   
    //点击删除
    handleDelete(id) {
      console.log(id);
      this.$confirm("此操作将永久删除该商品列表, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"

          });
          GOODSDEL_API(id).then(()=>{
            this.querydata();
          })
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 请求数据函数
    querydata() {
      GOODSLIST_API(this.currentPage, this.pageSize).then(res => {
        this.total = res.data.total
        this.tableData = res.data.data;
      });
    },
  },
  created() {
    this.querydata();
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
  // table组件样式
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
 

}
</style>