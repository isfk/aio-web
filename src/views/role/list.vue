<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        round
        class="filter-item"
        size="small"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleAdd"
      >添加角色</el-button>
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
      <el-table-column label="名称" width="120">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="80">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status | statusColorFilter"
            size="small"
          >{{ scope.row.status | statusTextFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column fixed="right" prop="created_at" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="handleRule(scope.row)">权限</el-button>
          <el-button type="text" size="small" @click="handleMenu(scope.row)">菜单</el-button>
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
        ref="roleForm"
        v-loading.fullscreen.lock="dialogLoading"
        label-position="right"
        :rules="formRules"
        :model="formData"
        label-width="100px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" />
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

    <el-dialog
      v-loading.fullscreen.lock="dialogLoading"
      title="权限管理"
      :visible.sync="rulesDialog.visible"
    >
      <el-tree
        ref="rulesTree"
        :data="ruleList"
        show-checkbox
        node-key="id"
        :default-expanded-keys="expandedRules"
        :props="defaultProps"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="rulesDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="updateRules()">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog
      v-loading.fullscreen.lock="dialogLoading"
      title="菜单管理"
      :visible.sync="menusDialog.visible"
    >
      <el-tree
        ref="menusTree"
        :data="menuList"
        show-checkbox
        node-key="id"
        :default-expanded-keys="expandedRules"
        :props="defaultProps"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="menusDialog.visible = false">取消</el-button>
        <el-button type="primary" @click="updateMenus()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'

const statusList = [1, -1]
const expandedRules = []
const expandedMenus = []
const ruleList = []
const menuList = []

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
    }
  },

  data() {
    return {
      statusList,

      dialogLoading: false,
      dialogStatus: 'add',

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
        name: '',
        status: 1
      },
      formRules: {
        name: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        status: [{ type: 'enum', enum: [1, -1], message: '请选择状态' }]
      },
      // 编辑
      formDialog: {
        title: '',
        visible: false
      },

      // rules
      rulesDialog: {
        title: '',
        visible: false
      },
      expandedRules,
      ruleList,
      roleID: 0,
      defaultProps: {
        children: 'children',
        label: 'label'
      },

      // menus
      menusDialog: {
        title: '',
        visible: false
      },
      expandedMenus,
      menuList
    }
  },
  created() {
    this.fetchData()
    this.getRuleList()
    this.getMenuList()
  },

  methods: {
    fetchData() {
      this.listLoading = true
      this.$store
        .dispatch('role/getList', this.listQuery)
        .then(response => {
          this.list = response.list
          this.total = response.count
          this.listLoading = false
        })
        .catch(() => {
          this.listLoading = false
        })
    },

    getRuleList() {
      // 获取全部权限
      this.$store
        .dispatch('role/getRuleList')
        .then(response => {
          this.ruleList = response
          for (const key in response) {
            this.expandedRules.push(response[key].id)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },

    getMenuList() {
      // 获取全部权限
      this.$store
        .dispatch('role/getMenuList')
        .then(response => {
          this.menuList = response
          for (const key in response) {
            this.expandedMenus.push(response[key].id)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },

    resetFormData() {
      this.formData = {
        id: undefined,
        name: '',
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
        this.$refs['roleForm'].clearValidate()
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
        this.$refs['roleForm'].clearValidate()
      })
    },

    // 添加提交
    addData() {
      this.$refs['roleForm'].validate(valid => {
        if (valid) {
          this.dialogLoading = true
          const tempData = Object.assign({}, this.formData)
          this.$store
            .dispatch('role/add', tempData)
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
      this.$refs['roleForm'].validate(valid => {
        if (valid) {
          const that = this
          that.dialogLoading = true
          const tempData = Object.assign({}, this.formData)
          this.$store
            .dispatch('role/edit', tempData)
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

    // 角色权限
    handleRule(row) {
      this.rulesDialog.visible = true
      this.roleID = row.id
      // 获取角色权限
      this.$store
        .dispatch('role/getRules', { id: row.id })
        .then(response => {
          if (response.list) {
            const checkedRules = []
            for (let i = 0; i < response.list.length; i++) {
              const element = response.list[i]
              checkedRules.push(parseInt(element[3]))
            }
            this.$refs.rulesTree.setCheckedKeys(checkedRules)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },

    updateRules() {
      const that = this
      that.dialogLoading = true
      that.$store
        .dispatch('role/addRules', {
          role_id: that.roleID,
          id_list: that.$refs.rulesTree.getCheckedKeys()
        })
        .then(response => {
          that.$notify({
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
          that.dialogLoading = false
        })
    },

    // 角色菜单
    handleMenu(row) {
      this.menusDialog.visible = true
      this.roleID = row.id
      // 获取角色菜单
      this.$store
        .dispatch('role/getMenus', { id: row.id })
        .then(response => {
          if (response.list) {
            const checkedMenus = []
            for (let i = 0; i < response.list.length; i++) {
              const element = response.list[i]
              checkedMenus.push(parseInt(element[3]))
            }
            this.$refs.menusTree.setCheckedKeys(checkedMenus)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },

    updateMenus() {
      const that = this
      that.dialogLoading = true
      that.$store
        .dispatch('role/addMenus', {
          role_id: that.roleID,
          id_list: that.$refs.menusTree.getCheckedKeys()
        })
        .then(response => {
          that.$notify({
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
          that.dialogLoading = false
        })
    }
  }
}
</script>
