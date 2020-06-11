<template>
  <el-card class="box-card">
    <h5>账号列表</h5>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
     > <!--@selection-change="handleSelectionChange" 选中状态的改变-->
      <el-table-column type="selection" width="55"></el-table-column>

      <el-table-column prop="account" label="账号" width="120"></el-table-column>
      

      <el-table-column prop="userGroup" label="用户组" width="120"></el-table-column>

      <el-table-column prop="ctime" label="创建时间"></el-table-column>

      <el-table-column label="操作" width="250px">
        <!-- slot-scope="scope"  scope.row.id 获取当前行的字段 -->
        <template slot-scope="scope">
          <!-- <el-button size="small" @click="editacc(scope.row.id)">编辑</el-button> -->

        <el-button  @click="editacc(scope.row)"  size="small">编辑</el-button>
        <el-dialog title="账号编辑" :visible.sync="dialogFormVisible">
          <el-form :model="form">
            <el-form-item label="账号" :label-width="formLabelWidth">
              <el-input v-model="form.account" autocomplete="off" width="300px"></el-input>
            </el-form-item>
             <el-form-item label="用户组" :label-width="formLabelWidth">
              <el-select v-model="form.userGroup" placeholder="请选择活动区域">
                <el-option label="超级管理者" value="super"></el-option>
                <el-option label="普通管理者" value="normal"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="acceditsure">确 定</el-button>
          </div>
        </el-dialog>
        
        <el-button type="danger" size="small" @click="removeacc(scope.row.id)" style="margin-left:20px;">删除</el-button>
      </template>


       
        
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block mt20">
      <el-pagination
        :page-sizes="[5, 10, 15, 20]"
        :page-size="50"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>

    <div style="margin-top: 20px">
      <el-button @click="toggleSelection()">取消选择</el-button>
      <el-button type="danger" @click="removeaccmore(multipleSelection)">批量删除</el-button>     
    </div>
    

  </el-card>

 
</template>

<script>

// REMOVEACCMORE_API 批量删除账号  REMOVEACC_API 删除账号 ,ACCOUNTLIST_API 账号列表
import { REMOVEACC_API ,ACCOUNTLIST_API ,EDITACC_API } from "@/api/apis.js";
import { REMOVEACCMORE_API  } from "@/api/apis.js";




export default {
  data() {
    return {
      // 后台拿到的用户列表
      tableData: [],
      // 选中的数据
      multipleSelection: [],


      total:0,
      currentPage:1,
      pageSize:5,
      dialogFormVisible: false,
      form: {
        account: '',
        userGroup: '',
      },
      editid:0, //要编辑的数据的id
      formLabelWidth: '120px'


      
    };
  },

  methods: {

    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });

        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },


      handleSelectionChange(val) {
        this.multipleSelection = val;
      },


    // 点击编辑数据
    editacc(row){ //点击编辑的时候显示模态框  将该行数据显示出来，可进行编辑
      this.dialogFormVisible = true
      this.form.account = row.account
      this.form.userGroup = row.userGroup
      this.editid = row.id
    },

    //点击更改账户信息确认按钮
    acceditsure(){
      this.dialogFormVisible = false
      EDITACC_API(this.editid,this.form.account,this.form.userGroup).then(()=>{
        this.querydata()
      })
    },
   //每页大小改变的时候
    handleSizeChange(val) {
      this.pageSize = val
      this.querydata()
    },
    //当前页改变的时候
    handleCurrentChange(val) {
      this.currentPage = val
      this.querydata()
    },

    // 获取账号列表函数
    querydata(){
      // 参数1,当前页 参数2,每页显示条数
      ACCOUNTLIST_API(this.currentPage, this.pageSize).then(res => {
        // 得到一个用户的数组
        this.total = res.data.total
        
        this.tableData = res.data.data; 
      });
    },

    // 点击删除数据
    removeacc(id) {
      if (confirm("确认删除此消息吗?删除之后不可找回")) {
        REMOVEACC_API(id).then(()=>{
          this.querydata() //调用获取账号列表函数函数
        })
      }
    },


    // 点击批量删除
    removeaccmore(data){
      
      // 得到的数据是整条数据 循环数据,拿到里面的id值,成一个数组 将数组成一个字符串 然后发送axios请求
      let arr=[]
      for (let i = 0; i < data.length; i++) {
        arr.push(data[i].id)
      }
      
      if (confirm("您确定删除"+data.length+"条数据吗")) {
        arr=JSON.stringify(arr)
        REMOVEACCMORE_API(arr).then(()=>{
          this.querydata() //调用获取账号列表函数函数
        })
      }
    },
    
  },

  

  // 页面加载进来的时候就要得到数据,
  created() {
    this.querydata()
  }

  
  
};
</script>

<style lang="less" scoped>
.mt20 {
  margin-top: 20px;
}
.el-card {
  h5 {
    border-bottom: 1px solid #ccc;
    line-height: 30px;
    margin-bottom: 20px;
  }
}
</style>