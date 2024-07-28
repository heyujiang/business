<template>
  <div class="container" >
    <Breadcrumb :items="[route.matched[0].meta.locale, route.meta.locale]" />
    <a-card class="general-card onelineCard" ref="onelineCardRef" style="height: calc(100% - 50px);">
      <a-row style="margin-bottom: 10px">
        <a-col :span="16">
          <a-space>
            <a-input :style="{width:'120px'}"  v-model="formModel.name" placeholder="标题" allow-clear />
            <a-range-picker v-model="formModel.createdTime" :style="{width:'200px'}" />
            <a-select v-model="formModel.status"  :options="statusOptions" placeholder="状态" :style="{width:'120px'}" />
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
          :span="8"
           style="text-align: right;"
        >
        <a-space>
          <a-button type="primary" @click="updateTable">
            <template #icon>
              <icon-refresh />
            </template>
            更新数据表
          </a-button>
          <a-tooltip :content="$t('searchTable.actions.refresh')">
            <div class="action-icon" @click="search"
              ><icon-refresh size="18"
            /></div>
          </a-tooltip>
          <a-dropdown @select="handleSelectDensity">
            <a-tooltip :content="$t('searchTable.actions.density')">
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
      <div class="tablebox">
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
        :scroll="{x:cardboxWidth}"
        @page-change="handlePaageChange" 
        @page-size-change="handlePaageSizeChange" 
      >
        <template #image="{ record }">
          <img
              alt="封面"
              style="height: 50px;border-radius: 5px;"
              :src="record.image"
            />
        </template>
        <template #createtime="{ record ,column}">
          {{dayjs(record[column.dataIndex]*1000).format("YYYY-MM-DD")}}
        </template>
        <template #overtime="{ record }">
          {{record.overtime==0?"不限":record.overtime}}
        </template>
        <template #status="{ record }">
          <a-switch type="round" v-model="record.status" :checked-value="0" :unchecked-value="1" @change="handleStatus(record)">
              <template #checked>
                开
              </template>
              <template #unchecked>
                关
              </template>
            </a-switch>
        </template>
        <template #operations="{ record }">
          <ButtonGroup size="small">
            <!-- <a-button style="color: rgb(var(--arcoblue-6));"  @click="handleEdit(record)">生成代码</a-button> -->
            <a-button style="color: rgb(var(--arcoblue-6));"  @click="openCodeMaker(record)">生成代码</a-button>
            <a-popconfirm :content="`您确定要${record.is_install==1?'卸载':'删除'}数据库和代码吗?`" @ok="handleDel(record)">
              <a-button style="color: red;">{{record.is_install==1?"卸载":"删除"}}</a-button>
            </a-popconfirm>
          </ButtonGroup>
        </template>
      </a-table>
      </div>
        <div class="tigbox">
          <div class="title">生成代码说明：</div>
          <div class="item">
            <div class="label">1.新增数据表时，请点击右上角的“更新数据表”进行更新</div>
          </div>
          <div class="item">
            <div class="label">2.生成数据列表不带分类，则直接选择“模板类型=仅数据列表”</div>
            <div class="text"></div>
          </div>
          <div class="item">
            <div class="label">3.生成列表数据时，如果数据有对应分类（如：产品分类）时“模板类型=数据关联分类”，产品列表数据表命名为：business_product_content 分类数据表命名为：business_product__cate</div>
            <div class="text"></div>
          </div>
          <div class="item">
            <div class="label">4.生成更多配置说明请到<a href="https://doc.goflys.cn/docview?id=25&fid=275" target="_blank" style="color: #165dff;">开发文档查看</a></div>
            <div class="text"></div>
          </div>
      </div>
      
    </a-card>
    <!--表单-->
    <!-- <AddForm @register="registerModal"  @success="handleData"/> -->
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive, watch, onMounted,onUnmounted} from 'vue';
  import useLoading from '@/hooks/loading';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
  import cloneDeep from 'lodash/cloneDeep';
  //数据
  import { columns} from './data';
  //api
  import { getList,upStatus,del,upCodeTable} from '@/api/developer/generatecode';
  import { useModal} from '/@/components/Modal';
  // import AddForm from './AddForm.vue';
  import { useI18n } from 'vue-i18n';
  import { Message ,Button} from '@arco-design/web-vue';
  import { Pagination } from '@/types/global';
  import { useRoute,useRouter } from 'vue-router'
  import dayjs from 'dayjs';
  const route = useRoute(),router = useRouter();
  const ButtonGroup=Button.Group
  const { t } = useI18n();
  const [registerModal, { openModal }] = useModal();
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
    showTotal:true,
    showPageSize:true,
  });
  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };
  const { loading, setLoading } = useLoading(true);
  const renderData = ref([]);
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const size = ref<SizeProps>('large');
   //查询字段
   const generateFormModel = () => {
    return {
      trade_no: '',
      name: '',
      createdTime: [],
      status: '',
    };
  };
  const formModel = ref(generateFormModel());
  const fetchData = async () => {
    setLoading(true);
    try {
      const data= await getList({page:pagination.current,pageSize:pagination.pageSize,...formModel.value});
      renderData.value = data.items;
      pagination.current = data.page;
      pagination.total = data.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  //查询 
  const search = () => {
    fetchData();
  };
  const reset = () => {
    formModel.value = generateFormModel();
    fetchData();
  };
  //组件挂载完成后执行的函数
  const timer=ref()
  onMounted(()=>{
    fetchData();
    timer.value=setTimeout(()=>{
      updateTable()
    },1000)
  })
   //离开
onUnmounted(() => {
  timer.value && clearTimeout(timer.value);
})
  const onelineCardRef = ref(null);
  const cardboxWidth= computed(() => (onelineCardRef.value ? onelineCardRef.value["$el"]["offsetWidth"] -100: 1200));
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
    { deep: true, immediate: true }
  );
  //更新数据表
  const updateTable=async()=>{
    Message.loading({content:"更新中",id:"upStatus",duration:0})
    await upCodeTable({id:0});
    fetchData();
    Message.success({content:"更新成功！",id:"upStatus",duration:2000})
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
  //更新状态
  const handleStatus=async(record:any)=>{
    try {
        Message.loading({content:"更新状态中",id:"upStatus"})
       const res= await upStatus({id:record.id,status:record.status});
       if(res){
         Message.success({content:"更新状态成功",id:"upStatus"})
       }
    }catch (error) {
      Message.clear("top")
    } 
  }
  //删除数据
  const handleDel=async(record:any)=>{
    try {
        Message.loading({content:"删除中",id:"upStatus"})
       const res= await del({id:record.id,is_install:record.is_install});
       if(res){
        fetchData();
         Message.success({content:"删除成功",id:"upStatus"})
       }
    }catch (error) {
      Message.clear("top")
    } 
  }
    //状态
    const statusOptions = computed<SelectOptionData[]>(() => [
    {
      label: "全部",
      value: "",
    },
    {
      label: "正常",
      value: 0,
    },
    {
      label: "禁用",
      value: 1,
    },
  ]);
  //打开代码生成器
  const openCodeMaker=(record:any)=>{
    router.push({name:"codemaker",query:{id:record.id}})
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

  //添加底部说明
  .tablebox{
    min-height: 496px;
  }
    //说明
  .tigbox{
    .title{
      font-size: 16px;
      font-weight: 600;
    }
    .item{
      display: flex;
      margin-top: 10px;
      .label{
        color: var(--color-neutral-10);
      }
      .text{
        flex:1;
        color: 	var(--color-neutral-6);
      }
    }
  }
</style>
