<template>
  <div class="container" >
    <Breadcrumb :items="['menu.project', 'menu.project.list']" />
    <a-card class="general-card onelineCard" style="height: calc(100% - 50px);">
      <a-row style="margin-bottom: 10px">
        <a-col :span="20">
          <a-space wrap>
            <a-input :style="{width:'220px'}"  v-model="formModel.name" placeholder="项目名称" allow-clear />
            <a-select :style="{width:'220px'}"  v-model="formModel.userId" :options="userOptions" placeholder="负责人" allow-clear />
            <a-select :style="{width:'220px'}"  v-model="formModel.star" :options="starOptions" placeholder="星级" allow-clear />
            <a-select :style="{width:'220px'}"  v-model="formModel.type" :options="typeOptions" placeholder="类型" allow-clear />
            <a-range-picker style="width: 240px" value-format="timestamp" v-model="formModel.createdAt" allow-clear/>
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              查询
            </a-button>
            <a-button @click="reset">
              {{ $t('searchTable.form.reset') }}
            </a-button>
          </a-space>
        </a-col>
        <a-col
          :span="4"
           style="text-align: right;"
        >
          <a-space>
            <a-tooltip :content="$t('searchTable.actions.refresh')">
              <div class="action-icon" @click="search"
                ><icon-refresh size="18"
              /></div>
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
         ellipsis="true"
        :default-expand-all-rows="true"
         :scroll="{ x: 2400 }"
        ref="artable"
        @page-change="handlePaageChange"
        @page-size-change="handlePaageSizeChange"
      >
        <template #name="{ record }">
          <a-link :hoverable="false" @click="detail(record.id)">
            {{ record.name}}
          </a-link>
        </template>
        <template #star="{ record }">
          <icon-star-fill v-for="i in record.star" :key="i" style="color: #f6c200" size="18"/>
<!--          <a-rate :default-value="record.star" :count="record.star"  readonly/>-->
        </template>

        <template #schedule="{ record }">
          <a-progress type="circle" :percent="record.schedule"
          />
        </template>

        <template #attr="{ record }">
          <span v-if="record.attr == '1'" style="background-color: #f09200;  padding: 2px 10px; border-radius: 20px;color: #FFFFFF ">
              {{'集中式'}}
          </span>
          <span v-else-if ="record.attr == '2'" style="background-color: #e9552d;  padding: 2px 10px; border-radius: 20px;color: #FFFFFF ">
              {{'分布式'}}
          </span>
          <span v-else-if ="record.attr == '3'"  style="background-color: #9568fe;  padding: 2px 10px;  border-radius: 20px;color: #FFFFFF ">
              {{'分散式'}}
          </span>
        </template>

        <template #type="{ record }">
          <span v-if="record.type == '1'" style="background-color: #30a4e4;  padding: 2px 10px; border-radius: 20px;color: #FFFFFF ">
              {{'风电'}}
          </span>
          <span v-else-if ="record.type == '2'" style="background-color: #1fbb6a;  padding: 2px 10px; border-radius: 20px;color: #FFFFFF ">
              {{'光伏'}}
          </span>
          <span v-else-if ="record.type == '3'" style="background-color: #00bbbb;  padding: 2px 10px;  border-radius: 20px;color: #FFFFFF ">
              {{'储能'}}
          </span>
        </template>

        <template #state="{ record }">
          <span v-if="record.state == '1'" style="color: #0055d1; ">
              {{'待定'}}
          </span>
          <span v-else-if ="record.state == '2'" style="color: #f6c200;  " >
              {{'进行中'}}
          </span>
          <span v-else-if ="record.state == '3'" style="color: #00bb00; ">
              {{'已完成'}}
          </span>
          <span v-else-if ="record.state == '4'" style="color: #ff0000; ">
              {{'中止'}}
          </span>
        </template>

        <template #capacity="{ record }">
          <span v-if="record.type == 1||record.type == 2">
            {{record.capacity +' MW'}}
          </span>
          <span v-else-if="record.type == 3">
            {{record.capacity +' Mwh'}}
          </span>
        </template>

        <template #investmentAgreement="{record}">
          <a-typography-paragraph
              :ellipsis="{
            rows: 3,
            expandable: true,
               }">
            {{record.investmentAgreement}}
          </a-typography-paragraph>
        </template>

        <template #businessCondition="{record}">
          <a-typography-paragraph
              :ellipsis="{
            rows: 3,
            expandable: true,
               }">
            {{record.businessCondition}}
          </a-typography-paragraph>
        </template>

        <template #properties="{record}">
          <a-typography-paragraph
              :ellipsis="{
            rows: 3,
            expandable: true,
               }">
            {{record.properties}}
          </a-typography-paragraph>
        </template>

        <template #connect="{record}">
          <a-typography-paragraph
              :ellipsis="{
            rows: 3,
            expandable: true,
               }">
            {{record.connect}}
          </a-typography-paragraph>
        </template>

        <template #description="{record}">
          <a-typography-paragraph
              :ellipsis="{
            rows: 3,
            expandable: true,
               }">
            {{record.description}}
          </a-typography-paragraph>
        </template>

        <template #area="{ record }">
          {{record.capacity +' 亩'}}
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
  import { computed, ref, reactive, watch, nextTick } from 'vue';
  import useLoading from '@/hooks/loading';
  import { getList,del} from '@/api/project/project';
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
  import { Pagination } from '@/types/global';
  import { getUserOptions } from '@/api/user';
  import router from "@/router";
  import {typeOptions , starOptions , statusOptions} from "@/views/project/data"

  const { t } = useI18n();
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
  const boxheight=document.documentElement.clientHeight;//页面高度
  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };
  const { loading, setLoading } = useLoading(true);
  const renderData = ref([]);
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const size = ref<SizeProps>('large');
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
    //查询字段
  const generateFormModel = () => {
    return {
      name:'',
      userId: '',
      star:'',
      type:'',
      createdAt: [],
    };
  };
  const formModel = ref(generateFormModel());
  const fetchData = async () => {
    setLoading(true);
    try {
      const data= await getList({page:pagination.current,size:pagination.pageSize,...formModel.value});
      renderData.value = data.list;
      pagination.current = data.page;
      pagination.total = data.count;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const detail = (id:number) => {
    router.push({
      path: "/project/detail",
      query: {
        id:id,
      }
    });
  }

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
  //添加菜单
  const createRule=()=>{
    openModal(true, {
      isUpdate: false,
      record:null
    });
  }
  //编辑数据
  const handleEdit=async(record:any)=>{
    openModal(true, {
      isUpdate: true,
      record:record
    });
  }
  //更新数据
  const handleData=async()=>{
    fetchData();
  }
  //分页
  const handlePaageChange = (page:any) => {
    pagination.current=page
    fetchData();
  }
  //分页总数
  const handlePaageSizeChange = (pageSize:any) => {
    pagination.pageSize=pageSize
    fetchData();
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
      Message.clear("top")
    }
  }
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
