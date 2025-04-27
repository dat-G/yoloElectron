<template>
    <el-drawer v-model="drawerVisible" :title="title" :with-header="withHeader" :size="size" :direction="direction">
        <el-table :data="filterTableData" style="width: 100%">
            <el-table-column label="文件名" width="170">
                <template #default="scope">
                    <el-tooltip placement="right" :enterable="false">
                        <template #content>
                            <div class="image-preview-tooltip">
                                <img :src="scope.row.path" alt="预览" class="preview-image" />
                            </div>
                        </template>
                        <span class="filename-text">{{ scope.row.name }}</span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column label="日期" prop="date" width="120" />
            <el-table-column label="路径" prop="relativePath"/>
            <el-table-column align="right" width="150">
                <template #header>
                    <el-input v-model="search" size="small" placeholder="输入关键字搜索" />
                </template>
                <template #default="scope">
                    <el-button size="small" @click="handleView(scope.$index, scope.row)">查看</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        
        <!-- 隐藏的文件选择器 -->
        <input 
            ref="folderInput"
            type="file" 
            webkitdirectory 
            multiple 
            style="display: none" 
            @change="handleFolderSelected" 
        />
        
        <template #footer>
            <el-button size="small" @click="drawerVisible = false">取消</el-button>
            <el-button type="primary" size="small" @click="openFolderDialog">选择文件夹</el-button>
        </template>
    </el-drawer>
</template>

<script>
export default {
    name: 'AppDrawer',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: "预测文件夹"
        },
        withHeader: {
            type: Boolean,
            default: false
        },
        size: {
            type: String,
            default: '50%'
        },
        direction: {
            type: String,
            default: 'rtl'
        }
    },
    emits: ['update:visible', 'file-selected'],
    computed: {
        drawerVisible: {
            get() {
                return this.visible;
            },
            set(val) {
                this.$emit('update:visible', val);
            }
        }
    }
}
</script>

<script setup>
import { computed, ref , onBeforeUnmount } from 'vue'

const search = ref('')
const folderInput = ref(null)

onBeforeUnmount(() => {
    // 清理对象URL
    tableData.value.forEach(data => {
        if (data.path && data.path.startsWith('blob:')) {
            URL.revokeObjectURL(data.path)
        }
    })
})

// 过滤表格数据
const filterTableData = computed(() =>
    tableData.value.filter(
        (data) =>
            !search.value ||
            data.name.toLowerCase().includes(search.value.toLowerCase())
    )
)

// 表格数据，改为响应式
const tableData = ref([
    // {
    //     date: '2023-05-03',
    //     name: 'example.jpg',
    //     path: '/path/to/example.jpg',
    // }
])

// 处理编辑按钮点击
const handleView = (index, row) => {
    console.log('查看图片:', row)
    // 可以触发一个事件，通知父组件显示选中的图片
    emit('file-selected', row.file)
    emit('update:visible', false)
}

// 处理删除按钮点击
const handleDelete = (index, row) => {
    console.log('删除图片:', row)
    tableData.value.splice(index, 1)
}

// 触发文件夹选择对话框
const openFolderDialog = () => {
    folderInput.value.click()
}

// 定义一个emits函数来发出事件
const emit = defineEmits(['update:visible', 'file-selected'])

// 修改 handleFolderSelected 方法

// 处理文件夹选择
const handleFolderSelected = (event) => {
    const files = event.target.files
    
    if (!files || files.length === 0) return
    
    // 清空现有数据
    tableData.value = []
    
    // 处理所有文件
    Array.from(files).forEach(file => {
        // 仅处理JPG文件
        if (file.type === 'image/jpeg' || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg')) {
            // 创建临时的对象URL作为"绝对路径"
            const objectUrl = URL.createObjectURL(file)
            
            // 完整的相对路径，包括文件夹结构
            const relativePath = file.webkitRelativePath
            
            // 创建文件日期
            const fileDate = new Date(file.lastModified)
            const dateStr = fileDate.toISOString().split('T')[0]
            
            // 添加到表格数据
            tableData.value.push({
                date: dateStr,
                name: file.name,
                path: objectUrl,       // 使用对象URL代替相对路径
                relativePath,          // 保存相对路径用于显示
                file: file             // 保存文件引用以便后续使用
            })
        }
    })
    
    // 重置文件输入，允许选择相同的文件夹
    event.target.value = ''
}
</script>

<style scoped>
.el-table {
    height: calc(100% - 20px);
    overflow: auto;
}

.image-preview-tooltip {
    padding: 0;
    max-width: 300px;
    max-height: 200px;
    overflow: hidden;
}

.preview-image {
    max-width: 300px;
    max-height: 200px;
    object-fit: contain;
    display: block;
}

.filename-text {
    cursor: pointer;
}

:deep(.el-drawer__body) {
    padding: 10px;
    display: flex;
    flex-direction: column;
    height: calc(100% - 60px); /* 减去底部按钮区域的高度 */
}

:deep(.el-tooltip__popper) {
    padding: 8px;
    background-color: white;
    border: 1px solid #e4e7ed;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

:deep(.el-table__body-wrapper) {
    overflow-y: auto;
}
</style>