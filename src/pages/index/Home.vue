<template>
  <div>
    <div class="main_header">
      <el-card class="box-card">
        <div class="text item">
          <i class="el-icon-document blue"></i>
          <div>
            <p>总订单</p>
            <p>{{totalOrder}}</p>
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div class="text item">
          <i class="el-icon-coin violet"></i>
          <div>
            <p>今日订单</p>
            <p>{{todayOrder}}</p>
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div class="text item">
          <i class="el-icon-goods blue"></i>
          <div>
            <p>总销售额</p>
            <p>{{totalAmount }}</p>
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div class="text item">
          <i class="el-icon-s-order green"></i>
          <div>
            <p>今日销售额</p>
            <p>{{totayAmount}}</p>
          </div>
        </div>
      </el-card>
    </div>

    <div id="myecharts" ></div>
    

  </div>
  
</template>

<script>
import echarts from "echarts"
import { ORDERTOTALDATA_API } from "@/api/apis"


export default {
  data(){
    return{
      todayOrder: 0,
      totalAmount: 0,
      totalOrder: 0,
      totayAmount: 0,

    }
  },

  //使用Echarts步骤
  //1：下载 npm i  echarts -S 或 yarn add echarts -S
  //2: 引入echarts import echarts from "echarts"
  //:3: 1）定一个dom容器 要将echarts放在那里 
  //:3: 2）初始化echarts  既是将echarts和dom容器联系起来
  //:3: 3）配置option参数
  //:3: 3）用echarts实例化出来的对象使用option
  // let myechart = echarts
  mounted(){
    let myechart = echarts.init(document.getElementById('myecharts'))
    myechart.showLoading()
    setTimeout(()=>{
      
      ORDERTOTALDATA_API().then(res=>{
        console.log(res);
        let {xData,amountData,orderData,todayOrder,totalAmount,totalOrder,totayAmount} = res.data
        this.todayOrder = todayOrder
        this.totalAmount = totalAmount
        this.totalOrder = totalOrder
        this.totayAmount = totayAmount


        let option = {
          title: {
              text: '营销数据'
          },
          tooltip: {
              trigger: 'axis'
          },
          legend: {
              data: ['金额数据','订单数据',]
          },
          grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
          },
          toolbox: {
              feature: {
                  saveAsImage: {}
              }
          },
          xAxis: {
              type: 'category',
              boundaryGap: false,
              data: xData
          },
          yAxis: {
              type: 'value'
          },
          series: [
            {
                name: '订单数据',
                type: 'line',
                stack: '总量',
                data: orderData
            },
            {
                name: '金额数据',
                type: 'line',
                stack: '总量',
                data: amountData
            },

          ],
        };
        myechart.setOption(option);
        myechart.hideLoading()
        
      })

    },3000)
  }


  




};
</script>

<style lang="less" scoped>

    .el-main {
      .main_header{
          display: flex;
          .el-card {
              width: 23%;
              margin: 0 1%;

              .item{
                  display: flex;
                  justify-content: space-between;
                  div{
                      font-size: 14px;
                      font-weight: 600;
                      p{
                          line-height: 30px;
                          &:nth-child(1){
                              color: #ccc;
                          }
                      }
                  }
                  [class*=" el-icon-"], [class^=el-icon-]{
                      font-size: 40px;
                      &.blue{
                          color: #1296DB;
                      }
                      &.violet{
                          color: #D4237A;
                      }
                      &.green{
                          color: #1AFA29;
                      }
                  }
              }
          }
      }
      #myecharts{
        margin: 60px auto;
        width: 800px;
        height: 500px;
        border: 1px solid #ccc;
        padding: 20px;
      }
    }
</style>