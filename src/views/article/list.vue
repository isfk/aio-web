<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="标题"
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

      <el-select
        v-model="listQuery.category_id"
        placeholder="分类"
        clearable
        class="filter-item"
        style="width: 130px; margin-left: 10px;"
        size="small"
      >
        <el-option
          v-for="item in categoryList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
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
      >添加文章</el-button>
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
      <el-table-column label="标题" width="160">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="80">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status | statusColorFilter"
            size="small"
          >{{ scope.row.status | statusTextFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">{{ scope.row.created_at | formatDate }}</template>
      </el-table-column>

      <el-table-column fixed="right" width="100" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleEdit(scope.row)">编辑</el-button>
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
        ref="articleForm"
        v-loading.fullscreen.lock="dialogLoading"
        label-position="right"
        :rules="formRules"
        :model="formData"
        label-width="100px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="formData.title" />
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <tinymce v-model="formData.content" :height="300" />
        </el-form-item>

        <el-form-item label="分类" prop="status">
          <el-select v-model="formData.category_id" placeholder="请选择" class="filter-item">
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
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
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import Tinymce from '@/components/Tinymce'
import dayjs from 'dayjs'

const statusList = [1, -1]

const statusSearchOptions = [
  { value: '1', label: '正常' },
  { value: '-1', label: '已删除' }
]

export default {
  components: { Pagination, Tinymce },
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
    formatDate(date) {
      return dayjs.unix(date).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  data() {
    return {
      statusSearchOptions,
      statusList,

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
        title: ''
      },

      // 分类
      categoryList: null,

      // 表单数据
      formData: {
        id: undefined,
        title: '',
        content: '',
        category_id: 0,
        status: 1
      },
      formRules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ],
        category_id: [
          { required: true, message: '请选择分类', trigger: 'blur' }
        ],
        status: [{ type: 'enum', enum: [1, -1], message: '请选择状态' }]
      },

      // 编辑
      formDialog: {
        title: '',
        visible: false
      }
    }
  },

  created() {
    this.fetchData()
    this.getCategoryList()
  },

  methods: {
    getCategoryList() {
      this.$store
        .dispatch('article/getCategoryList')
        .then(response => {
          if (response.count > 0) {
            this.categoryList = response.list
          }
        })
        .catch(() => {
        })
    },
    fetchData() {
      this.listLoading = true
      this.list = null
      this.total = 0
      this.$store
        .dispatch('article/getList', this.listQuery)
        .then(response => {
          if (response.count > 0) {
            this.list = response.list
            this.total = response.count
          }
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
      this.formData.id = undefined
      this.formData.title = ''
      this.formData.content =
      this.formData.category_id = 0
      this.formData.status = 1
    },

    // 添加
    handleAdd() {
      this.resetFormData()
      this.dialogStatus = 'add'
      this.formDialog.title = '添加'
      this.formDialog.visible = true
      this.$nextTick(() => {
        this.$refs['articleForm'].clearValidate()
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
        this.$refs['articleForm'].clearValidate()
      })
    },

    // 添加提交
    addData() {
      this.$refs['articleForm'].validate(valid => {
        if (valid) {
          this.dialogLoading = true
          const tempData = Object.assign({}, this.formData)
          this.$store
            .dispatch('article/add', tempData)
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
      this.$refs['articleForm'].validate(valid => {
        if (valid) {
          const that = this
          that.dialogLoading = true
          const tempData = Object.assign({}, this.formData)
          this.$store
            .dispatch('article/edit', tempData)
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
    }
  }
}
</script>
