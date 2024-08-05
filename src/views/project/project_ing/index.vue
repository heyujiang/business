<template>
  <div class="container">
    <Breadcrumb :items="['menu.schedule', 'menu.project.schedule']"/>
    <a-card class="general-card onelineCard" style="height: calc(100% - 50px);">
      <a-row style="margin-bottom: 10px">
        <a-col :span="16">
          <a-space>
            <a-select :style="{width:'220px'}" v-model="formModel.projectId" :options="projectOption" @change="projectChange" placeholder="请选择项目" allow-clear/>
            <a-tree-select
                :style="{width:'220px'}"
                v-model="formModel.nodeId"
                :data="projectNodeOption"
                placeholder="请选择节点"
                :fieldNames="{
                  key: 'value',
                  title: 'label',
                }"
                allow-clear
            ></a-tree-select>
            <a-select :style="{width:'220px'}" v-model="formModel.userId" :options="userOptions"  placeholder="请选择用户" allow-clear/>

            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search/>
              </template>
              查询
            </a-button>
            <a-button @click="reset">
              {{ $t('searchTable.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
        <a-col
            :span="8"
            style="text-align: right;"
        >
          <a-space>
            <a-button type="primary" @click="createRule">
              <template #icon>
                <icon-plus/>
              </template>
              {{ $t('searchTable.operation.create') }}
            </a-button>
            <a-tooltip :content="$t('searchTable.actions.refresh')">
              <div class="action-icon" @click="search"
              >
                <icon-refresh size="18"
                />
              </div>
            </a-tooltip>
            <a-dropdown @select="handleSelectDensity">
              <a-tooltip :content="$t('searchTable.actions.density')">
                <div class="action-icon">
                  <icon-line-height size="18"/>
                </div>
              </a-tooltip>
              <template #content>
                <a-doption
                    v-for="item in densityList"
                    :key="item.value"
                    :value="item.value"
                    :class="{ active: item.value === size }"
                >
                  <span>{{ item.name }}</span>
                </a-doption>
              </template>
            </a-dropdown>
          </a-space>
        </a-col>
      </a-row>
      <a-table
          row-key="id"
          :loading="loading"
          :pagination="pagination"
          :columns="(cloneColumns as TableColumnData[])"
          :data="renderData"
          :bordered="{wrapper:true,cell:true}"
          :size="size"
          :default-expand-all-rows="true"
          :scroll="{ x: 1500 }"
          ref="artable"
          @page-change="handlePaageChange"
          @page-size-change="handlePaageSizeChange"
      >
        <template #overview="{ record }">
          <a-popover title="概览" trigger="click" :content-style="{width:'500px' }">
            <a-button>查看</a-button>
            <template #content>
             {{record.overview}}
            </template>
          </a-popover>
        </template>

        <template #operations="{ record }">
          <Icon icon="svgfont-bianji1" class="iconbtn" @click="handleEdit(record)" :size="18" color="#0960bd"></Icon>
        </template>
      </a-table>
    </a-card>
    <!--表单-->
    <AddForm @register="registerModal" @success="handleData"/>
  </div>
</template>

<script lang="ts" setup>
import {computed, reactive, ref, watch} from 'vue';
import useLoading from '@/hooks/loading';
import { getList,del} from '@/api/project/project_ing';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';
import type {SelectOptionData} from '@arco-design/web-vue/es/select/interface';
import {  getProjectOption , getProjectNodeOption} from '@/api/project/project';

import cloneDeep from 'lodash/cloneDeep';
//数据
import {columns} from './data';
//表单
import {useModal} from '/@/components/Modal';
import AddForm from './AddForm.vue';
import {useI18n} from 'vue-i18n';
import {Icon} from '@/components/Icon';
import {Message} from '@arco-design/web-vue';
import {Pagination} from '@/types/global';
import {getUserOptions} from "@/api/user";

const {t} = useI18n();
const [registerModal, {openModal}] = useModal();
const densityList = computed(() => [
  {
    name: t('searchTable.size.mini'),
    value: 'mini',
  },
  {
    name: t('searchTable.size.small'),
    value: 'small',
  },
  {
    name: t('searchTable.size.medium'),
    value: 'medium',
  },
  {
    name: t('searchTable.size.large'),
    value: 'large',
  },
]);
//分页
const basePagination: Pagination = {
  current: 1,
  pageSize: 10,
};
const pagination = reactive({
  ...basePagination,
  showTotal: true,
  showPageSize: true,
});
const boxheight = document.documentElement.clientHeight;//页面高度
type SizeProps = 'mini' | 'small' | 'medium' | 'large';
type Column = TableColumnData & { checked?: true };
const {loading, setLoading} = useLoading(true);
const renderData = ref([]);
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);
const size = ref<SizeProps>('large');
//查询字段
const generateFormModel = () => {
  return {
    projectId: '',
    nodeId: '',
    userId: '',
  };
};
const formModel = ref(generateFormModel());
const fetchData = async () => {
  setLoading(true);
  try {
    const data = await getList({page: pagination.current, size: pagination.pageSize, ...formModel.value});
    renderData.value = data.list;
    pagination.current = data.page;
    pagination.total = data.count;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

const search = () => {
  fetchData();
};
const reset = () => {
  formModel.value = generateFormModel();
  fetchData();
};
fetchData();
const handleSelectDensity = (
    val: string | number | Record<string, any> | undefined,
    e: Event
) => {
  size.value = val as SizeProps;
};

watch(
    () => columns.value,
    (val) => {
      cloneColumns.value = cloneDeep(val);
      cloneColumns.value.forEach((item, index) => {
        item.checked = true;
      });
      showColumns.value = cloneDeep(cloneColumns.value);
    },
    {deep: true, immediate: true}
);
//添加菜单
const createRule = () => {
  openModal(true, {
    isUpdate: false,
    record: null
  });
}
//编辑数据
const handleEdit = async (record: any) => {
  openModal(true, {
    isUpdate: true,
    record: record
  });
}
//更新数据
const handleData = async () => {
  fetchData();
}
//分页
const handlePaageChange = (page: any) => {
  pagination.current = page
  fetchData();
}
//分页总数
const handlePaageSizeChange = (pageSize: any) => {
  pagination.pageSize = pageSize
  fetchData();
}

//删除数据
const handleDel = async (record: any) => {
  try {
    Message.loading({content: "删除中", id: "upStatus"})
    const res = await del(record.id);
    if (res) {
      fetchData();
      Message.success({content: "删除成功", id: "upStatus"})
    }
  } catch (error) {
    Message.clear("top")
  }
}
//状态
const statusOptions = computed<SelectOptionData[]>(() => [
  {
    label: "全部",
    value: 0,
  },
  {
    label: "正常",
    value: 1,
  },
  {
    label: "禁用",
    value: 2,
  },
]);

const projectOption = ref([]);
const projectNodeOption = ref([]);

const fatchProjectOption = async () => {
  projectOption.value = await getProjectOption();
}
fatchProjectOption()

const projectChange = async (projectId) => {
  projectNodeOption.value =  await getProjectNodeOption(projectId);
}


const userOptions = ref([]);
const fetchUserOptions = async () => {
  try {
    userOptions.value = await getUserOptions();
  } catch (err) {
    // you can report use errorHandler or other
  } finally {

  }
};
fetchUserOptions();

</script>

<script lang="ts">
export default {
  name: 'Rule',
};
</script>

<style scoped lang="less">
.container {
  padding: 0 20px 20px 20px;
  height: 100%;
}

:deep(.arco-table-th) {
  &:last-child {
    .arco-table-th-item-title {
      margin-left: 16px;
    }
  }
}

.action-icon {
  margin-left: 12px;
  cursor: pointer;
}

.active {
  color: #0960bd;
  background-color: #e3f4fc;
}

.setting {
  display: flex;
  align-items: center;
  width: 200px;

  .title {
    margin-left: 12px;
    cursor: pointer;
  }
}

:deep(.general-card > .arco-card-header) {
  padding: 10px 16px;
}

.iconbtn {
  user-select: none;
  cursor: pointer;
  opacity: .8;

  &:hover {
    opacity: 1;
  }
}
</style>
