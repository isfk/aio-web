<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="用户名/昵称/手机/邮箱"
        style="width: 200px;"
        class="filter-item"
        size="small"
        @keyup.enter.native="handleFilter"
      />

      <el-select
        v-model="listQuery.status"
        placeholder="状态"
        clearable
        class="filter-item"
        style="width: 130px; margin-left: 10px;"
        size="small"
      >
        <el-option
          v-for="item in statusSearchOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>

      <el-button
        round
        class="filter-item"
        size="small"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>

      <el-button
        round
        class="filter-item"
        size="small"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleAdd"
      >添加用户</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="用户名" width="160">
        <template slot-scope="scope">{{ scope.row.username }}</template>
      </el-table-column>
      <el-table-column label="昵称" width="160">
        <template slot-scope="scope">{{ scope.row.nickname }}</template>
      </el-table-column>
      <el-table-column label="手机" width="160">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>
      <el-table-column label="邮箱" width="200">
        <template slot-scope="scope">{{ scope.row.email }}</template>
      </el-table-column>
      <el-table-column class-name="gender-col" label="性别" width="60">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.gender | genderColorFilter"
            size="small"
          >{{ scope.row.gender | genderTextFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="80">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status | statusColorFilter"
            size="small"
          >{{ scope.row.status | statusTextFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="注册时间">
        <template slot-scope="scope">{{ scope.row.created_at | formatDate }}</template>
      </el-table-column>

      <el-table-column fixed="right" width="100" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="handleRole(scope.row)">角色</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="fetchData"
    />

    <!-- Dialog -->
    <el-dialog :title="formDialog.title" :visible.sync="formDialog.visible">
      <el-form
        ref="userForm"
        v-loading.fullscreen.lock="dialogLoading"
        label-position="right"
        :rules="formRules"
        :model="formData"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="formData.nickname" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" />
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="formData.phone" />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="formData.gender" placeholder="请选择" class="filter-item">
            <el-option
              v-for="item in genderList"
              :key="item"
              :label="item | genderTextFilter"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formData.status" placeholder="请选择" class="filter-item">
            <el-option
              v-for="item in statusList"
              :key="item"
              :label="item | statusTextFilter"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="formDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='add'?addData():editData()">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="角色管理" :visible.sync="roleDialog.visible">
      <el-checkbox-group v-model="checkedRoles" @change="handleRolesChange">
        <el-checkbox v-for="role in roleList" :key="role.id" :label="role.id">{{ role.name }}</el-checkbox>
      </el-checkbox-group>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import dayjs from 'dayjs'

const statusList = [1, -1]
const genderList = [1, 2, 3]
const checkedRoles = []
const oldCheckedRoles = []

const statusSearchOptions = [
  { value: '0', label: '全部' },
  { value: '1', label: '正常' },
  { value: '-1', label: '已删除' }
]

export default {
  components: { Pagination },
  filters: {
    statusColorFilter(status) {
      const statusMap = {
        '1': 'success',
        '-1': 'info'
      }
      return statusMap[status]
    },
    statusTextFilter(status) {
      const statusMap = {
        '1': '正常',
        '-1': '删除'
      }
      return statusMap[status]
    },
    genderColorFilter(status) {
      const statusMap = {
        '1': 'success',
        '2': 'warning',
        '3': 'info'
      }
      return statusMap[status]
    },
    genderTextFilter(gender) {
      const genderMap = {
        '1': '女',
        '2': '男',
        '3': '密'
      }
      return genderMap[gender]
    },
    formatDate(date) {
      return dayjs.unix(date).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  data() {
    return {
      statusSearchOptions,
      statusList,
      genderList,

      dialogLoading: false,
      dialogStatus: 'add',

      // 分页
      total: 0,
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        status: '',
        name: ''
      },

      // 表单数据
      formData: {
        id: undefined,
        username: '',
        nickname: '',
        email: '',
        phone: '',
        gender: 1,
        status: 1
      },
      formRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          {
            type: 'email',
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { len: 11, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        gender: [{ type: 'enum', enum: [1, 2, 3], message: '请选择性别' }],
        status: [{ type: 'enum', enum: [1, -1], message: '请选择状态' }]
      },

      // 编辑
      formDialog: {
        title: '',
        visible: false
      },

      roleList: null,
      checkedRoles,
      oldCheckedRoles,
      roleUid: 0,
      // 角色
      roleDialog: {
        visible: false
      }
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      this.listLoading = true
      this.$store
        .dispatch('user/getList', this.listQuery)
        .then(response => {
          this.list = response.list
          this.total = response.count
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.fetchData()
    },

    resetFormData() {
      this.formData = {
        id: undefined,
        username: '',
        nickname: '',
        email: '',
        phone: '',
        gender: 1,
        status: 1
      }
    },

    // 添加
    handleAdd() {
      this.resetFormData()
      this.dialogStatus = 'add'
      this.formDialog.title = '添加'
      this.formDialog.visible = true
      this.$nextTick(() => {
        this.$refs['userForm'].clearValidate()
      })
    },

    // 编辑
    handleEdit(row) {
      this.dialogStatus = 'edit'
      this.formDialog.title = '编辑'
      this.formDialog.visible = true
      const tempData = Object.assign({}, row)
      this.formData = tempData
      this.$nextTick(() => {
        this.$refs['userForm'].clearValidate()
      })
    },

    // 添加提交
    addData() {
      this.$refs['userForm'].validate(valid => {
        if (valid) {
          this.dialogLoading = true
          const tempData = Object.assign({}, this.formData)
          this.$store
            .dispatch('user/add', tempData)
            .then(response => {
              this.dialogLoading = false
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success',
                duration: 2000
              })
              this.fetchData()
            })
            .catch(error => {
              console.log(error)
              this.dialogLoading = false
            })
        }
      })
    },

    // 编辑提交
    editData() {
      this.$refs['userForm'].validate(valid => {
        if (valid) {
          const that = this
          that.dialogLoading = true
          const tempData = Object.assign({}, this.formData)
          this.$store
            .dispatch('user/edit', tempData)
            .then(response => {
              this.$notify({
                title: '成功',
                message: '编辑成功',
                type: 'success',
                duration: 2000,
                onClose: function() {
                  that.dialogLoading = false
                }
              })
              that.fetchData()
            })
            .catch(error => {
              console.log(error)
              that.dialogLoading = false
            })
        }
      })
    },

    // 角色
    handleRole(row) {
      this.roleDialog.visible = true
      this.checkedRoles = this.oldCheckedRoles = []
      this.roleUid = row.id
      // 获取用户角色
      this.$store
        .dispatch('user/roles', { id: row.id })
        .then(response => {
          if (response.list) {
            for (let i = 0; i < response.list.length; i++) {
              const element = response.list[i]
              this.oldCheckedRoles.push(element.role_id)
            }
          }
          this.checkedRoles = this.oldCheckedRoles
        })
        .catch(error => {
          console.log(error)
        })

      // 获取全部角色
      this.$store
        .dispatch('role/getList', this.listQuery)
        .then(response => {
          this.roleList = response.list.reverse()
        })
        .catch(error => {
          console.log(error)
        })
    },

    handleRolesChange() {
      const that = this
      const sn = new Set(that.checkedRoles)
      const so = new Set(that.oldCheckedRoles)
      const diffAdd = that.checkedRoles.filter(x => !so.has(x))
      const diffDel = that.oldCheckedRoles.filter(x => !sn.has(x))

      // 添加、删除角色
      const roleID = diffAdd.length === 1 ? diffAdd[0] : diffDel[0]
      const storeUrl = diffAdd.length === 1 ? 'user/addRole' : 'user/delRole'

      this.$store
        .dispatch(storeUrl, { uid: that.roleUid, role_id: roleID })
        .then(response => {
          that.oldCheckedRoles = that.checkedRoles
          this.$notify({
            title: '成功',
            message: '编辑成功',
            type: 'success',
            duration: 2000,
            onClose: function() {
              that.dialogLoading = false
            }
          })
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>
