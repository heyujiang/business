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
            <a-select :style="{width:'220px'}" v-if="userStore.isSuper || userStore.isSystem" v-model="formModel.userId" :options="userOptions"  placeholder="请选择用户" allow-clear/>
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
          @page-change="handlePageChange"
          @page-size-change="handlePageSizeChange"
      >
        <template #projectName="{ record }">
          <a-link :hoverable="false" @click="detail(record.projectId)">
            {{ record.projectName}}
          </a-link>
        </template>

        <template #state="{ record }">
          <span v-if="record.state == 1"  style="color: #00bb00;">
            已完成
          </span>
          <span v-else-if="record.state == 2"  style="color: #f6c200; ">
            进行中
          </span>
        </template>

        <template #overview="{record}">
          <a-tooltip :content="record.overview">
            <a-typography-paragraph spacing="close" ellipsis>
              {{ record.overview }}
            </a-typography-paragraph>
          </a-tooltip>
        </template>

        <template #operations="{ record }">
          <Icon icon="svgfont-bianji1" class="iconbtn" @click="handleEdit(record)" :size="18" color="#0960bd"></Icon>
          <a-divider direction="vertical" />
          <Icon icon="icon-file" @click="viewAttached(record.id)" :size="18" color="#0960bd"></Icon>
          <a-divider direction="vertical" />
          <a-popconfirm content="您确定要删除吗?" @ok="handleDel(record)">
            <Icon icon="svgfont-icon7" class="iconbtn" :size="18" color="#ed6f6f"></Icon>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
    <!--表单-->
    <AddForm @register="registerModal" @success="handleData"/>
    <Attached v-model:visible="visible" :search="{recordId:aRecordId}" :showUpload="true"/>
  </div>
</template>

<script lang="ts" setup>
import {computed, reactive, ref, watch, onMounted, nextTick} from 'vue';
import useLoading from '@/hooks/loading';
import { getList,del} from '@/api/project/project_ing';
import type {TableColumnData} from '@arco-design/web-vue/es/table/interface';
import {  getProjectOption , getProjectNodeOption} from '@/api/project/project';

import cloneDeep from 'lodash/cloneDeep';
//数据
import {columns} from './data';
//表单
import {useModal} from '/@/components/Modal';
import AddForm from './AddForm.vue';
import Attached from '../components/Attached.vue';
import {useI18n} from 'vue-i18n';
import {Icon} from '@/components/Icon';
import {Message} from '@arco-design/web-vue';
import {Pagination} from '@/types/global';
import {getUserOptions} from "@/api/user";
import router from "@/router";
import {useRoute} from "vue-router";
import {useWindowSizeFn} from "@/hooks/event/useWindowSizeFn";
import {useUserStore} from "@/store";

const userStore = useUserStore();
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

type SizeProps = 'mini' | 'small' | 'medium' | 'large';
type Column = TableColumnData & { checked?: true };
const {loading, setLoading} = useLoading(true);
const renderData = ref([]);
const cloneColumns = ref<Column[]>([]);
const showColumns = ref<Column[]>([]);
const size = ref<SizeProps>('large');

const route = useRoute()
const username = route.query.name
const recordId = ref(route.query.id)


//查询字段
type formModelI = {
  projectId?:number,
  nodeId?:number,
  userId?:number,
  id?:number,
}

const formModel = ref<formModelI>({});

const userOptions = ref([]);
const fetchUserOptions = async () => {
  try {
    userOptions.value = await getUserOptions();
    if(username){
      userOptions.value.forEach((item)=>{
        if(username && item.label == username ){
          formModel.value.userId = item.value
          fetchData()
        }
      })
    }
  } catch (err) {
    // you can report use errorHandler or other
  } finally {

  }
};
fetchUserOptions();

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
  formModel.value.id = 0
  fetchData();
};
const reset = () => {
  formModel.value = {};
  fetchData();
};
// fetchData();
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

  //删除数据
  const handleDel=async(record:any)=>{
    try {
       Message.loading({content:"删除中",id:"upStatus"})
       const res= await del(record.id);
       if(res){
         fetchData();
         Message.success({content:"删除成功",id:"upStatus"})
       }
    }catch (error) {
      console.log(error)
    }
  }
const visible = ref(false)
const aRecordId = ref<number>(0)

const viewAttached = async (recordId: number) => {
  visible.value = true
  aRecordId.value = recordId
}

//更新数据
const handleData = async () => {
  await fetchData();
}
//分页
const handlePageChange = (page: any) => {
  pagination.current = page
  fetchData();
}
//分页总数
const handlePageSizeChange = (pageSize: any) => {
  pagination.pageSize = pageSize
  fetchData();
}


const projectOption = ref([]);
const projectNodeOption = ref([]);

const fetchProjectOption = async () => {
  projectOption.value = await getProjectOption();
}
fetchProjectOption()

const projectChange = async (projectId:number) => {
  projectNodeOption.value =  await getProjectNodeOption(projectId);
}


const detail = (id:number) => {
  router.push({
    path: "/project/detail",
    query: {
      id:id,
    }
  });
}

onMounted(async () => {
  if(recordId.value) {
    formModel.value.id = recordId.value
  }
  await fetchData();
});

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
