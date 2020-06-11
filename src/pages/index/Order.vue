<template>
  <el-card class="box-card">
    <el-form ref="form" :model="form" label-width="80px" id="queryform">
      <el-form-item label="订单号">
        <el-input v-model="form.orderNo" size="small" placeholder="订单号"></el-input>
      </el-form-item>
      <el-form-item label="收货人">
        <el-input v-model="form.consignee" size="small" placeholder="收货人"></el-input>
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="form.phone" size="small" placeholder="电话"></el-input>
      </el-form-item>
      <el-form-item label="订单状态">
          <el-select v-model="form.orderState" placeholder="请选择" size="small">
            <el-option label="已受理" value="已受理"></el-option>
            <el-option label="已完成" value="已完成"></el-option>
            <el-option label="进行中" value="进行中"></el-option>
          </el-select>
        
      </el-form-item>

      <el-form-item label="活动时间" id="actice_time" size="small">

        <div class="block">
          <el-date-picker
            v-model="form.datetime"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
          </el-date-picker>
        </div>

      </el-form-item>

      <el-form-item id="actice_time" size="small" width="120px">
        <el-button type="primary" id="query" @click="clickquery">查询</el-button>
      </el-form-item>

      
    </el-form>

    <!-- 表格 -->

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column  prop="orderNo" label="订单号"></el-table-column>

      <el-table-column  label="下单时间" >
        <template slot-scope="props">
          {{props.row.orderTime.substr(0,10)}}
        </template>
      </el-table-column>

      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column prop="consignee" label="收货人"></el-table-column>
      <el-table-column prop="deliverAddress" label="配送地址"></el-table-column>

      <el-table-column  label="送达时间">
        <template slot-scope="props">
          {{props.row.deliveryTime.substr(0,10)}}
        </template>
      </el-table-column>

      <el-table-column prop="remarks" label="用户备注" ></el-table-column>
      <el-table-column prop="orderAmount" label="订单金额"></el-table-column>
      <el-table-column prop="orderState" label="订单状态"></el-table-column>
      <!-- 操作 -->
      <el-table-column  label="操作" width="100px">
        <!-- 查看 -->
        <template slot-scope="scope">
          <el-dialog
            title="订单详情"
            :visible.sync="centerDialogVisible"
            width="30%"
            center>
            <ul id="orderdet">
               <li v-for="item in checkorderarr" :key="item.name">
                <span>{{item.name}}</span> <label>{{item.prop}}</label>
              </li>
            </ul>
            <span slot="footer" class="dialog-footer">
              <el-button size="small" type="primary" @click="centerDialogVisible = false">确 定</el-button>
            </span>
          </el-dialog>
          <el-button type="text" @click="checkorderdet(scope.row)" size="small" style="margin-right:10px">查看</el-button>
          
          <!-- 编辑 -->
           <el-dialog title="收货地址" :visible.sync="dialogFormVisible">
            <el-form :model="form" >
              <!-- 循环 将订单号一栏设置为只读 -->
              <div v-for="item in checkorderarr" :key="item.name" >

                <el-form-item :label="item.name" :label-width="formLabelWidth" v-if="item.name == '订单号' ">
                  <el-input v-model="item.prop" autocomplete="off" size="small" readonly></el-input>
                </el-form-item>

                <el-form-item :label="item.name" :label-width="formLabelWidth" v-else>
                  <el-input v-model="item.prop" autocomplete="off" size="small"></el-input>
                </el-form-item>

              </div>

             
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="editsure">确 定</el-button>
            </div>
          </el-dialog>

          <el-button type="text" @click="handleClick(scope.row)">编辑</el-button>
          
        </template> 
 

      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block" style="margin-top:20px">
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
    </div>


  </el-card>
</template>

<script>
// ORDERLIST_API获取订单列表  ORDERDETAIL_API获取订单详情 ORDERSEARCH_API 查询
import {  ORDERLIST_API , ORDEREDIT_API } from "@/api/apis.js"

import {  ORDERSEARCH_API } from "@/api/apis.js" //查询

// import {  ORDERDETAIL_API } from "@/api/apis.js"查看


export default {
    data() {
        return {
          tableData: [], //订单列表数组
          currentPage:1,
          pageSize:5,
          total:0,
          centerDialogVisible: false,
          checkorderarr:[], //查看或编辑时生成的数组
          dialogFormVisible: false,
          form: {
            orderNo:"",
            consignee: "",
            phone:"",
            orderState:"",
            datetime : [],
          },
          formLabelWidth: '120px',
          orderid:"",
          // 查询时间
          pickerOptions: {
            shortcuts: [{
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            }, {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              }
            }],
          
          },
          

            
        };
    },
    methods:{
      //获取所有订单数据
      queryorderlist(){
        ORDERLIST_API(this.currentPage,this.pageSize).then((res)=>{
          this.tableData =res.data.data
          this.total = res.data.total
        })
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
      // 查询
      clickquery(){
        let {orderNo,consignee,phone,orderState,datetime} = this.form
        console.log(orderNo,consignee,phone,orderState,datetime);
        //将时间转换成可以传递的数组的形式
        let date 
        if (datetime.length == 0) {
          date=[]
        } else {
          date=[this.GMTToStr(datetime[0]),this.GMTToStr(datetime[1])]
        }
        ORDERSEARCH_API(this.currentPage,this.pageSize,orderNo,consignee,phone,orderState,date).then((res)=>{
          this.tableData =res.data.data
          this.total = res.data.total
          
        })
        
      },
      

      // 编辑或是查看时生成的数组
      creatarr(data){
        this.checkorderarr = [
          {name:"订单号",prop:data.orderNo},
          {name:"收货人",prop:data.consignee},
          {name:"订单状态",prop:data.orderState},
          {name:"订单金额",prop:data.orderAmount},
          {name:"配送地址",prop:data.deliverAddress},
          {name:"手机号",prop:data.phone},
          {name:"订餐时间",prop:data.orderTime.substr(0,10)},
          {name:"送达时间",prop:data.deliveryTime.substr(0,10)},
          {name:"客户备注",prop:data.remarks},
        ]
      },
      //点击编辑
      handleClick(data){
        this.dialogFormVisible = true
        this.orderid = data.id
        
        this.creatarr(data)
      },

      //点击编辑里面的确认的时候
      // id,orderNo,orderTime,phone,consignee,deliverAddress,deliveryTime,remarks,orderAmount,orderState 参数
      editsure(){
        console.log(this.checkorderarr);
        //打开编辑的时候将该条订单信息的所有数据渲染出来 ，因为用的是数组循环的方式给里面的input框添加值 ，那么改变的值也在那个数组里面去找，穿值的时候将数组里面的prop上的值取出来穿过去即可
        let formarr = this.checkorderarr.map(item =>{
          return item.prop
        })
        let orderNo = formarr[0]
        let orderTime = formarr[6]
        let phone = formarr[5]
        let consignee = formarr[1]
        let deliverAddress = formarr[4]
        let deliveryTime = formarr[7]
        let remarks = formarr[8]
        let orderAmount = formarr[3]
        let orderState = formarr[2]
        
        ORDEREDIT_API(this.orderid,orderNo,orderTime,phone,consignee,deliverAddress,deliveryTime,remarks,orderAmount,orderState).then((res)=>{
          console.log(res);
          
          this.queryorderlist()
          
        })
        this.dialogFormVisible = false


      },

      //点击查看
      checkorderdet(data){
        this.creatarr(data)
        this.centerDialogVisible = true
      },

      
      

      handleSizeChange(val){
        this.pageSize = val
        this.queryorderlist()
      },

      handleCurrentChange(val){
        this.currentPage = val
        this.queryorderlist()
      }
    },

    created(){
      this.queryorderlist()
    }
};
</script>

<style lang="less" scoped>
.el-card {
  #queryform {
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      width: 25%;
      &#actice_time {
        width: 50%;
      }
    }
    #query {
      height: 32px;
      line-height: 1px;
      margin-left: 20px;
    }
  }
  .el-table{
    .el-table__body{
      .el-table__row{
        .cell{
          .el-dialog__wrapper{
            #orderdet{
              list-style: none;
              li{
                border-bottom: 1px solid #ccc;
                line-height: 40px;
                span{
                  display: inline-block;
                  width: 100px;
                }
                label{
                  color: #f00;
                  font-weight: bold;
                }
              }
            }
          }
          
        }
      }
    }
  }
}
</style>