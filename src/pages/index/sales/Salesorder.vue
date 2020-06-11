<template>
    <el-card class="box-card">
        <h5>订单统计</h5>
        <div class="times_box">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="时间范围">
                    <el-col :span="11">
                        <el-date-picker type="date" placeholder="开始日期" v-model="form.date1" style="width: 100%;"  size="small"></el-date-picker>
                    </el-col>
                    <el-col class="line" :span="2">-----</el-col>
                        <el-col :span="11">
                        <el-date-picker type="date" placeholder="开始日期" v-model="form.date2" style="width: 100%;"  size="small"></el-date-picker>
                    </el-col>
                </el-form-item>
            </el-form>

            <el-button type="primary" size="small">查询</el-button>
        </div>
    </el-card>
</template>

<script>
export default {
    data() {
      return {
        form: {
          date1: '',
          date2: '',
        }
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
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
  .times_box{
      display: flex;
      .el-button{
          margin-left: 20px;
          height: 30px;
          margin-top: 6px;
      }
  }
}
</style>