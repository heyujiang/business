<template>
  <div>
    <a-card
        class="general-card"
        title="成员"
        :header-style="{ paddingBottom: '18px' }"
        :body-style="{ paddingBottom: '12px' }"
    >
      <a-table :columns="columns" :data="renderData" :pagination="false">
        <template #type="{ record }">
          <span v-if="record.type == 1">第一负责人</span>
          <span v-else-if="record.type == 2">第二负责人</span>
          <span v-else-if="record.type == 3">项目成员</span>
        </template>
        <template #operations="{ record }">
          <a-popconfirm v-if="record.type != 1" content="您确定要删除吗?" @ok="handleDel(record)">
            <Icon icon="svgfont-icon7" class="iconbtn" :size="18" color="#ed6f6f"></Icon>
          </a-popconfirm>
        </template>
      </a-table>

      <template #extra>
        <IconPlusCircle :size="20" @click="viewAddPerson"/>
      </template>
    </a-card>
    <AddForm @register="registerModal"  @success="handleData"/>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, watch, nextTick } from 'vue';
import useLoading from '@/hooks/loading';
import { getProjectPersons,delProjectPerson } from '@/api/project/project';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
import cloneDeep from 'lodash/cloneDeep';
//数据
import { columns} from './data';
//表单
import {Icon} from '@/components/Icon';
import { Message } from '@arco-design/web-vue';
import { getUserOptions } from '@/api/user';
import {useModal} from "@/components/Modal";
import AddForm from "./AddForm.vue";
const [registerModal, { openModal }] = useModal();


const props = defineProps({
  projectId: {
    type: Number,
    default() {
      return 0;
    },
  },
});

const data = [{
  id:1,
  name:"AAA",
  phoneNumber:"12346545",
  type:1,

}]

const projectId = computed(() => {
  return props.projectId
});

type SizeProps = 'mini' | 'small' | 'medium' | 'large';
type Column = TableColumnData & { checked?: true };
const { loading, setLoading } = useLoading(true);
const renderData = ref([]);

const fetchData = async () => {
  setLoading(true);
  try {
    renderData.value = await getProjectPersons(projectId.value);
    console.log(renderData.value)
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};

fetchData();

const handleData=async()=>{
  fetchData();
}
//删除数据
const handleDel=async(record:any)=>{
  try {
    Message.loading({content:"删除中",id:"upStatus"})
    const res= await delProjectPerson(record.id);
    if(res){
      fetchData();
      Message.success({content:"删除成功",id:"upStatus"})
    }
  }catch (error) {
    Message.clear("top")
  }
}

const viewAddPerson = async () => {
  openModal(true, {
    isUpdate: true,
    projectId:projectId.value
  });
}

</script>
<style scoped lang="less">
.general-card {
  margin-bottom: 20px;
  padding: 0 20px;
}
</style>
