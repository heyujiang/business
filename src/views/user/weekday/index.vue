<template>
  <title>周报日报</title>
  <div class="container">
    <Breadcrumb :items="['menu.user.info', 'menu.user.weekday']" />
    <a-card class="general-card onelineCard" style="margin-bottom: 10px">
      <a-row>
        <a-col :span="24">
          <a-space>
            <a-select style="width: 220px" v-if="userStore.isSystem || userStore.isSuper" :default-value="userStore.userId" v-model="searchForm.userId" :options="userOptions"  placeholder="用户" allow-clear/>
            <a-range-picker
                style="width: 250px;"
                v-model="searchForm.timeRange"
                value-format="timestamp"
                format="YYYY-MM-DD"
                :shortcuts="[
                    {
                      label: '当日',
                      value: () => [dayjs().startOf('day').toDate(),dayjs().startOf('day').add(1,'day').toDate()],
                    },
                    {
                      label: '近7天',
                      value: () => [dayjs().startOf('day').add(-6, 'day').toDate(), dayjs().startOf('day').add(1,'day').toDate()],
                    },
                    {
                      label: '近30天',
                      value: () => [dayjs().startOf('day').add(-29, 'day').toDate(),dayjs().startOf('day').add(1,'day').toDate()],
                    },
                  ]"/>
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              查询
            </a-button>
          </a-space>
        </a-col>
      </a-row>
    </a-card>


    <div class="scroll-f">
      <div style="width: 380px;">
        <a-scrollbar :style="{height:unref(scrollHeight)}" style="width: 100%;background-color: var(--color-bg-2);overflow: auto;border-radius: 5px">
          <MyProject v-model:projectList="reportResp"/>
        </a-scrollbar>
      </div>
      <div style="width: calc(100% - 390px);">
        <a-scrollbar :style="{height:unref(scrollHeight)}" style="width: 100%;background-color: var(--color-bg-2);overflow: auto;border-radius: 5px">
          <ProjectInfos v-model:projectList="reportResp"/>
        </a-scrollbar>
      </div>
      </div>
  </div>
</template>

<script lang="ts" setup>
  import MyProject from './components/my-project.vue';
  import ProjectInfos from './components/project-infos.vue';
  import {nextTick, onMounted, ref, unref, watch} from 'vue';
  import dayjs from 'dayjs';
  import { getUserOptions } from '@/api/user';
  import {Report, ReportResponseData, ReportSearch} from "@/api/report";
  import {useUserStore} from "@/store";
  import {Message} from "@arco-design/web-vue";
  import {del} from "@/api/system/node";

  const userStore = useUserStore();

  document.title="周报日报"
  const userOptions = ref<any[]>([]);
  const clientHeight = ref<number>(document.documentElement.clientHeight) //浏览器可视区域高度
  const scrollHeight = ref<string>('')
  const searchForm = ref<ReportSearch>({
    timeRange:[dayjs().startOf('day').add(-6, 'day').valueOf(),dayjs().startOf('day').add(1,'day').valueOf()]
  })
  const reportResp = ref<ReportResponseData[]>([])

  onMounted(() => {
    scrollHeight.value = clientHeight.value- 255 + 'px';
    window.onresize = function (){
      scrollHeight.value = clientHeight.value- 255 + 'px';
      console.log(scrollHeight.value)
    }

    fetchUserOptions()
    featUserReport()
  })

  const fetchUserOptions = async ()=>{
    userOptions.value = await getUserOptions();
  }

  watch(
      ()=>(clientHeight.value),
      (v) => {
        console.log(scrollHeight.value)
        scrollHeight.value = v - 480 + 'px';
      },
      {}
  )

  const search = () => {
    featUserReport()
  }

  const featUserReport = async () => {
    try {
      Message.loading({content:"加载中",id:"upStatus"})
      reportResp.value = await Report(searchForm.value)
      Message.clear("top")
    }catch (error){
      console.log(error)
    }

  }
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
    height: 100%;
  }
  :deep(.general-card > .arco-card-header){
    padding: 10px 16px;
  }
  .scroll-f{
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

</style>

