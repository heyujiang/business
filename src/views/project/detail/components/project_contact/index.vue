<template>
  <div >
    <a-card
        class="general-card"
        title="联系人"
        :header-style="{ paddingBottom: '18px' }"
        :body-style="{ paddingBottom: '12px' }"
    >
      <a-table :columns="columns" :data="renderData" :pagination="false" v-if="userStore.isSuper || userStore.isSystem || userStore.userId == userId">
        <template #type="{ record }">
          <span v-if="record.type == 1">同行公司</span>
          <span v-else-if="record.type == 2">分包方</span>
          <span v-else-if="record.type == 3">总包方</span>
          <span v-else-if="record.type == 4">小E</span>
          <span v-else-if="record.type == 5">劳务</span>
          <span v-else-if="record.type == 6">政府单位</span>
          <span v-else-if="record.type == 7">资源方</span>
        </template>
        <template #operations="{ record }">
          <a-popconfirm content="您确定要删除吗?" @ok="handleDel(record)">
            <Icon icon="svgfont-icon7" class="iconbtn" :size="18" color="#ed6f6f"></Icon>
          </a-popconfirm>
        </template>
      </a-table>
      <a-result v-else status="403">
        <template #subtitle>
          没有权限
        </template>
      </a-result>

      <template #extra>
        <IconPlusCircle :size="20" @click="viewAddPerson" v-if="userStore.isSuper || userStore.isSystem || userStore.userId == userId"/>
      </template>
    </a-card>
    <AddForm @register="registerModal"  @success="handleData"/>
  </div>

</template>

<script lang="ts" setup>
import { computed, ref, reactive, watch, nextTick } from 'vue';
import useLoading from '@/hooks/loading';
import { getProjectContacts,delProjectContact } from '@/api/project/project';
import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
import cloneDeep from 'lodash/cloneDeep';
//数据
import { columns} from './data';
//表单
import {Icon} from '@/components/Icon';
import { Message } from '@arco-design/web-vue';
import { getUserOptions } from '@/api/user';
import AddForm from "./AddForm.vue";
import {useModal} from "@/components/Modal";
import {useUserStore} from "@/store";
const [registerModal, { openModal }] = useModal();

const userStore = useUserStore();

const props = defineProps({
  projectId: {
    type: Number,
    default() {
      return 0;
    },
  },
  userId: {
    type: Number,
    default() {
      return 0;
    },
  }
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

const userId = computed(()=>{
  return props.userId
})

type SizeProps = 'mini' | 'small' | 'medium' | 'large';
type Column = TableColumnData & { checked?: true };
const { loading, setLoading } = useLoading(true);
const renderData = ref([]);
// const cloneColumns = ref<Column[]>([]);
// const showColumns = ref<Column[]>([]);

const fetchData = async () => {
  setLoading(true);
  try {
    renderData.value = await getProjectContacts(projectId.value);
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
    const res= await delProjectContact(record.id);
    if(res){
      fetchData();
      Message.success({content:"删除成功",id:"upStatus"})
    }
  }catch (error) {
    console.log(error)
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
