<template>
  <div class="container">
    <Breadcrumb :items="['menu.user', 'menu.user.info']" />
<!--    style="height: calc(100% - 50px);"-->
    <a-card class="general-card onelineCard" style="margin-bottom: 10px">
      <a-row>
        <a-col :span="24">
          <a-space>
            <a-select style="width: 220px" v-model="searchForm.userId"   placeholder="用户" allow-clear/>
            <a-range-picker
                style="width: 220px;"
                :shortcuts="[
                    {
                      label: '当日',
                      value: () => [dayjs().toDate(),dayjs().add(1,'day').toDate()],
                    },
                    {
                      label: '本周',
                      value: () => [dayjs().startOf('week').add(1, 'day').toDate(), dayjs().add(1,'day').toDate()],
                    },
                    {
                      label: '当月',
                      value: () => [dayjs().set('date',1).toDate(),dayjs().add(1,'day').toDate()],
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
          <MyProject/>
        </a-scrollbar>
      </div>
      <div style="width: calc(100% - 390px);">
        <a-scrollbar :style="{height:unref(scrollHeight)}" style="width: 100%;background-color: var(--color-bg-2);overflow: auto;border-radius: 5px">
          <ProjectInfos/>
        </a-scrollbar>
      </div>
      </div>
  </div>
</template>

<script lang="ts" setup>
  import UserInfoHeader from './components/user-info-header.vue';
  import LatestNotification from './components/latest-notification.vue';
  import MyProject from './components/my-project.vue';
  import ProjectInfos from './components/project-infos.vue';
  import LatestActivity from './components/latest-activity.vue';
  import MyTeam from './components/my-team.vue';
  import ProjectPerson from "@/views/project/detail/components/project_person/index.vue";
  import ProjectContact from "@/views/project/detail/components/project_contact/index.vue";
  import {densityList} from "@/types/global";
  import {nextTick, onMounted, ref, unref, watch} from 'vue';
  import dayjs from 'dayjs';
  import ProjectTotal from "@/views/user/weekday/components/project-total.vue";

  const clientHeight = ref<number>(document.documentElement.clientHeight) //浏览器可视区域高度
  const scrollHeight = ref<string>('')

  onMounted(() => {
    scrollHeight.value = clientHeight.value- 255 + 'px';
    window.onresize = function (){
      scrollHeight.value = clientHeight.value- 255 + 'px';
      console.log(scrollHeight.value)
    }
  })

  watch(
      ()=>(clientHeight.value),
      (v) => {
        console.log(scrollHeight.value)
        scrollHeight.value = v - 480 + 'px';
      },
      {}
  )

  const searchForm = {
    userId:''
  }
  const search = () => {

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

