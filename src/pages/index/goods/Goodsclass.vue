<template>
  <el-card class="box-card">
    <h5>
      商品列表
      <el-button type="primary" size="small" style="float:right" @click="open">添加分类</el-button>
    </h5>

    <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="序号" width="180"></el-table-column>
        <el-table-column prop="cateName" label="分类名称" width="180"></el-table-column>
        <el-table-column prop="enable" label="是否启用">
          <template slot-scope="scope">

            <el-switch
              v-model="scope.row.state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="启用"
              inactive-text="禁止"
              @change="changeSwitch(scope.row)">
            </el-switch>
          </template>

        </el-table-column>
        
        <el-table-column prop="operation" label="操作" width="180">
          <template slot-scope="scope">
            <!-- <el-button type="primary" size="small" @click="clickedit(scope.row.id,scope.row.cateName)"> 编辑 </el-button> -->
            <el-button type="primary" size="small" @click="clickedit(scope.row)"> 编辑 </el-button>
            <!-- 编辑里面的内容 -->
            <el-dialog title="修改分类类容" :visible.sync="dialogFormVisible" style="font-weight: 600;">
              <el-form :model="form">
                <el-form-item label="分类名称" :label-width="formLabelWidth">
                  <el-input v-model="editcateName" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item label="是否启用" :label-width="formLabelWidth">
                  <el-switch
                    v-model="goodsstate"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="启用"
                    inactive-text="禁止"
                    @change="changeSwitch"
                    >
                  </el-switch>
                </el-form-item>
                
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false" size="small">取 消</el-button>
                <el-button type="primary" @click="clickeditsure" size="small">确 定</el-button>
              </div>
            </el-dialog>

            <el-button type="danger" size="small" @click="delcate(scope.row.id)" class="removecate">删除</el-button>
          </template>  
        </el-table-column>
        

    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        :page-sizes="[5,10]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total" 
        @current-change="currentchange"
        @size-change="sizechange"
      ></el-pagination>
      
    </div>


    
        






  </el-card>
</template>

<script>
//CATELIST_API获取分类列表 ADDCATE_API添加分类 DELCATE_API删除分类
import { CATELIST_API , ADDCATE_API , DELCATE_API} from "@/api/apis.js"
import { EDITCATE_API } from "@/api/apis.js"




export default {
    data() {
      return {
        tableData: [],
        value: false,
        total:5,//总分类条数,
        currentPage:1,//商品分类当前页
        pagesize:5,//每页显示条数
        dialogFormVisible: false, //编辑弹出框是否显示
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
        },
        formLabelWidth: '120px',
        editcateName:"",//点击编辑时编辑框里面显示的内容
        goodsid:0,
        goodsstate:false,


      }
    },
    methods:{
      changeSwitch () {
      },


      // 弹框id,cateName
      clickedit(scoperow){
        this.dialogFormVisible = true //模态框显示
        this.editcateName = scoperow.cateName //将原来的值赋值给模态框里的input
        this.goodsid = scoperow.id 
        this.goodsstate = scoperow.state 
      },

      // 点击模态框的确定，发送axios请求  编辑信息
      clickeditsure(){
        EDITCATE_API(this.goodsid,this.editcateName,JSON.stringify(this.goodsstate)).then(()=>{
          this.querydata()//调用要显示的数据请求函数
        })
        this.dialogFormVisible = false
        this.editcateName=""
      },


      open() {
        this.$prompt('分类名称', '添加分类', { 
          confirmButtonText: '确定', 
          cancelButtonText: '取消', 
          inputPattern: /^[\u4e00-\u9fa5]+$/, 
          inputErrorMessage: '请输入汉字'
        }).then(({ value }) => {
          this.$message({ 
          type: 'success', 
          message: '你添加的分类是: ' + value,});

          // 添加分类成功要做的事情
            ADDCATE_API(value,true).then(()=>{
              this.querydata()
            })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });       
        });
      },

      // 获取要显示的数据请求函数
      querydata(){
        CATELIST_API(this.currentPage,this.pagesize).then(res=>{
          this.total = res.data.total //商品分类的总条数
          let datas = res.data.data
          for (let i = 0; i < datas.length; i++) {
            if (datas[i].state == 1 || datas[i].state == true) {
              datas[i].state = true
            } else if(datas[i].state == 0 || datas[i].state == false){
              datas[i].state == false
            }
          }
          this.tableData = datas
        })
      },

      //pager表示输入的当前页 当前页改变触发的函数
      currentchange(pager){ //当应该显示的当前的页的数字改变的时候调用获取数据请求函数
        this.currentPage = pager //将输入的页面值给当前页的变量
        this.querydata()
      },


      // 每页条数改变时触发的函数
      sizechange(sizes){
        this.pagesize = sizes
        this.querydata()
      },

      // 删除分类
      delcate(id){
        if (confirm("您确定删除此分类")) {
          DELCATE_API(id).then(()=>{
            this.querydata()
          })
        }
      }
      
      
    },


    // 获取商品分类
    created(){
      this.querydata()//调用要显示的数据请求函数
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
  .removecate{
    margin-left: 10px;
  }
}
</style>