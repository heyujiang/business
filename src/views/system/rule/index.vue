<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.rule']" />
    <a-card class="general-card onelineCard" style="height: calc(100% - 50px);">
      <a-row style="margin-bottom: 10px">
        <a-col :span="16">
           <div>
            此项菜单适用于开发时，方便业务端添加新业务项，开发完成即可在admin端关闭。也可以直接在admin端的业务管理添加。
           </div>
        </a-col>
        <a-col
          :span="8"
           style="text-align: right;"
        >
         <a-space>
          <a-button type="primary" @click="createRule">
            <template #icon>
              <icon-plus />
            </template>
            {{ $t('searchTable.operation.create') }}
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
      <a-table
         row-key="id"
        :loading="loading"
        :pagination="false"
        :columns="(cloneColumns as TableColumnData[])"
        :data="renderData"
        :bordered="{wrapper:true,cell:true}"
        :size="size"
        :default-expand-all-rows="true"
        ref="artable"
        @change="handleChange" 
      >
        <template #title="{ record }">
          <span v-html="record.spacer" style="padding-right: 5px;color: var(--color-neutral-4);"></span>{{ record.title }}
        </template>
        <template #icon="{ record }">
          <Icon :icon="record.icon" :size="20"></Icon>
        </template>
        <template #createtime="{ record }">
          {{dayjs(record.createtime*1000).format("YYYY-MM-DD")}}
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
          <Icon icon="icon-drag-dot-vertical" class="iconbtn dragIcon" :size="18" color="#0960bd"></Icon>
          <a-divider direction="vertical" />
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
  import { computed, ref, onMounted, watch, nextTick } from 'vue';
  import useLoading from '@/hooks/loading';
  import { getList,upStatus,del} from '@/api/system/rule';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
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
  //排序
  import Sortable from 'sortablejs'
  import { tableWeigh } from '@/api/common';

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
  type SizeProps = 'mini' | 'small' | 'medium' | 'large';
  type Column = TableColumnData & { checked?: true };
  const { loading, setLoading } = useLoading(true);
  const renderData = ref([]);
  const cloneColumns = ref<Column[]>([]);
  const showColumns = ref<Column[]>([]);
  const size = ref<SizeProps>('large');
  const artable=ref()
  const fetchData = async () => {
    setLoading(true);
    try {
      const data= await getList({});
      renderData.value = data;
      nextTick(()=>{
        artable.value.expandAll()
      })
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const search = () => {
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
  //排序拖拽
  const handleChange = (_data:any) => {
    console.log(_data);
    renderData.value = _data
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
       const res= await del({ids:[record.id]});
       if(res){
        fetchData();
         Message.success({content:"删除成功",id:"upStatus"})
       }
    }catch (error) {
      Message.clear("top")
    } 
  }
    //排序
    const initDropTable = () => {
      const el = artable.value.$el.querySelector('.arco-table-element tbody') as HTMLElement
       Sortable.create(el, {
        handle: '.dragIcon', //设置指定列作为拖拽
        dataIdAttr: 'data-id',//指定获取拖动后排序的属性
        onEnd(event: any) {
          const { newIndex, oldIndex } = event
          let ids=ref<number []>([])
          for(var i=0;i<renderData.value.length;i++){
            ids.value.push(renderData.value[i]["id"]);
          }
         let numids= getTreeId(renderData.value)
         let draid = numids[oldIndex];
         numids[oldIndex] = numids[newIndex];
         numids[newIndex] = draid;
         let pids= getPIdArr(renderData.value)
          orrdersave(numids,draid,pids[oldIndex])
        }
      })
    }
    //获取id
    const getTreeId=(renderData:any)=>{
        let midleArr=<number []>[];
        renderData.forEach((item:any) => {
          if(item.children){
           let cdata= getTreeId(item.children)
            midleArr.push(item.id)
            midleArr.push(...cdata)
          }else{
            midleArr.push(item.id)
          }
        }) 
      return midleArr
    }
    //获取pid
    const getPIdArr=(renderData:any)=>{
        let pidArr=<number []>[];
        renderData.forEach((item:any) => {
          if(item.children){
           let cdata= getPIdArr(item.children)
           pidArr.push(item.pid)
           pidArr.push(...cdata)
          }else{
            pidArr.push(item.pid)
          }
        }) 
      return pidArr
    }
    //排序
    const orrdersave=async(ids:number[],id:any,pid:any)=>{
      if(!ids||!id){
         return
      }
      try {
        Message.loading({content:"更新排序中",id:"tableWeigh"})
        const res= await tableWeigh({ids:ids,changeid:id,field:'orderNo',table:"business_auth_rule",prikey:'id',pid:pid,orderway:"asc"});
        if(res){
          Message.success({content:"更新排序成功",id:"tableWeigh"})
        }
      }catch (error) {
        Message.clear("top")
      }
    }
  //初始化排序
  onMounted(() => {
    nextTick(() => {
      initDropTable()
    })
  })
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
  .dragIcon{
    cursor: move;
  }
</style>
