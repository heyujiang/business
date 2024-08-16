<template>
  <div class="container" >
    <Breadcrumb :items="['menu.system', 'menu.system.account']" />
    <a-card class="general-card onelineCard" style="height: calc(100% - 50px);">
      <a-row style="margin-bottom: 10px">
        <a-col :span="16">
          <a-space>
            <a-input :style="{width:'220px'}"  v-model="formModel.username" placeholder="用户名" allow-clear />
            <a-input :style="{width:'220px'}"  v-model="formModel.phoneNumber" placeholder="手机号" allow-clear />
            <a-select v-model="formModel.state"  :options="statusOptions" placeholder="状态" :style="{width:'120px'}" allow-clear/>
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              查询
            </a-button>
            <a-button @click="reset">
              重置
            </a-button>
          </a-space>
        </a-col>
        <a-col
          :span="8"
           style="text-align: right;"
        >
        <a-space>
          <a-button type="primary" @click="createUser">
            <template #icon>
              <icon-plus />
            </template>
            新建
          </a-button>

          <a-tooltip content="刷新">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>

          <a-dropdown @select="handleSelectDensity">
            <a-tooltip content="密度">
              <div class="action-icon"><icon-line-height size="18" /></div>
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
        ref="artable"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      >
        <template #avatar="{ record }">
          <a-avatar trigger-type="mask">
            <img
              alt="avatar"
              :src="record.avatar"
            />
          </a-avatar>
        </template>
        <template #name="{ record }">
          {{ record.name }}<span v-if="record.nickName" style="padding-left: 5px;color: var(--color-neutral-4);">{{ record.nickName }}</span>
        </template>
        <template #state="{ record }">
          <a-switch type="round" v-model="record.state" :checked-value="1" :unchecked-value="2" @change="handleStatus(record)">
              <template #checked>
                正常
              </template>
              <template #unchecked>
                禁用
              </template>
            </a-switch>
        </template>
        <template #operations="{ record }">
          <Icon icon="svgfont-bianji1" class="iconbtn" @click="handleEdit(record)" :size="18" color="#0960bd"></Icon>
          <a-divider direction="vertical" />
          <a-popconfirm content="您确定要删除吗?" @ok="handleDel(record)">
            <Icon icon="svgfont-icon7" class="iconbtn" :size="18" color="#ed6f6f"></Icon>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
    <!--表单-->
    <AddForm @register="registerModal"  @success="handleData"/>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, nextTick ,onMounted  } from 'vue';
  import useLoading from '@/hooks/loading';
  import {getList, enable, disable, del, UserCond} from '@/api/system/account';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import cloneDeep from 'lodash/cloneDeep';
  import dayjs from 'dayjs';
  //数据
  import { columns} from './data';
  //表单
  import { useModal } from '/@/components/Modal';
  import AddForm from './AddForm.vue';
  import { useI18n } from 'vue-i18n';
  import {Icon} from '@/components/Icon';
  import { Message } from '@arco-design/web-vue';
  import { Pagination,densityList } from '@/types/global';

  onMounted(()=>{
    fetchData()
  })

  const [registerModal, { openModal }] = useModal();

  //分页
  const basePagination: Pagination = {
    current: 1,
    pageSize: 10,
  };

  const pagination = reactive({
    ...basePagination,
    showTotal:true,
    showPageSize:true,
  });

  type Column = TableColumnData & { checked?: true };
  const { loading, setLoading } = useLoading(true);
  const renderData = ref([]);
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);

  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  const size = ref<SizeProps>('large'); //表格size
  //修改表格size
  const handleSelectDensity = (
      val: string | number | Record<string, any> | undefined,
      e: Event
  ) => {
    size.value = val as SizeProps;
  };

  const formModel = ref<UserCond>({}); //搜索选项

  const fetchData = async () => {
    setLoading(true);
    try {
      const data= await getList({page:pagination.current,size:pagination.pageSize,...formModel.value});
      renderData.value = data.list;
      pagination.current = data.page;
      pagination.total = data.count;
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
    fetchData();
  };

  const reset = () => {
    formModel.value = {};
    fetchData();
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
    { deep: true, immediate: true }
  );

  //添加用
  const createUser=()=>{
    openModal(true, {
      isUpdate: false,
      record:null
    });
  }

  //编辑用户
  const handleEdit=async(record:any)=>{
    openModal(true, {
      isUpdate: true,
      record:record
    });
  }

  // 更新数据
  const handleData= async () => {
    await fetchData();
  }

  // 分页跳转
  const handlePageChange = async (page:any) => {
    pagination.current=page
    await fetchData();
  }
  
  // 设置分页数量
  const handlePageSizeChange = async (pageSize:any) => {
    pagination.pageSize=pageSize
    await fetchData();
  }

  //切换用户状态
  const handleStatus=async(record:any)=>{
    if(record.state == 1) {
        await enableUser(record)
    }else{
        await disableUser(record)
    }
  }

  //启用用户
  const enableUser=async(record:any)=>{
    try {
      Message.loading({content:"启用中",id:"upStatus"})
      const res= await enable(record.id);
      Message.success({content:"启用成功",id:"upStatus"})
    }catch (error) {
      console.log(error)
    }
  }

  //禁用用户
  const disableUser=async(record:any)=>{
    try {
      Message.loading({content:"禁用中",id:"upStatus"})
      await disable(record.id);
      Message.success({content:"禁用成功",id:"upStatus"})
    }catch (error) {
      console.log(error)
    }
  }

  //删除数据
  const handleDel=async(record:any)=>{
    try {
      Message.loading({content:"删除中",id:"upStatus"})
      const res= await del(record.id);
      if(res){
        Message.success({content:"删除成功",id:"upStatus"})
        await fetchData();
      }
    }catch (error) {
      console.log(error)
    }
  }

  //状态选择项
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
  :deep(.general-card > .arco-card-header){
    padding: 10px 16px;
  }
  .iconbtn{
    user-select: none;
    cursor: pointer;
    opacity: .8;
    &:hover{
      opacity: 1;
    }
  }
</style>
