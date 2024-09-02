<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: '0' }"
      :body-style="{ padding: '17px 20px 21px 20px' }"
    >
      <template #title>
        项目概况
      </template>

      <a-space direction="vertical" :size="10" fill>
        <a-space>
          <a-radio-group
              v-model:model-value="latestType.type"
              type="button"
              @change="typeChange as any"
          >
            <a-radio value="threeStar">
              三星
            </a-radio>
            <a-radio value="progress">
              进展
            </a-radio>
            <a-radio value="noProgress">
              无进展
            </a-radio>
          </a-radio-group>

          <a-radio-group
              v-model:model-value="latestType.latest"
              @change="typeChange as any"
          >
            <a-radio value="week">
              近一周
            </a-radio>
            <a-radio value="month">
              近一月
            </a-radio>
          </a-radio-group>
        </a-space>
        <a-table
          :data="renderList"
          :pagination="false"
          :bordered="false"
          :hover="true"
          :stripe="true"
          :scroll="{ x: '100%', y: '264px' }"
        >
          <template #columns>
            <!-- <a-table-column width=80 title="ID" data-index="id"></a-table-column> -->
            <a-table-column title="项目名称" data-index="name">
              <template #cell="{ record }" >
                <a-typography-paragraph
                  :ellipsis="{
                    rows: 1,
                  }"
                  style="cursor:pointer;color: #4daaff"
                  @click="viewDetail(record.id)"
                >
                  <a-link @click="viewProject(record.id)">{{ record.name }}</a-link>
                </a-typography-paragraph>
              </template>
            </a-table-column>
            <a-table-column width="100" title="容量" data-index="capacity" :sortable="{sortDirections: ['ascend', 'descend'],}">
              <template #capacity="{ record }">
                 <span v-if="record.type == 1||record.type == 2">
                 {{record.capacity +' MW'}}
                 </span>
                <span v-else-if="record.type == 3">
                 {{record.capacity +' Mwh'}}
                  </span>
              </template>
            </a-table-column>
            <a-table-column width="100"
              title="负责人"
              data-index="username"
              :sortable="{
                sortDirections: ['ascend', 'descend'],
              }"
            >
              <template #cell="{ record }">
                <div class="increases-cell">
                  <span>{{ record.username }}</span>
                </div>
              </template>
            </a-table-column>
             <a-table-column title="创建时间" data-index="createdAt">
             </a-table-column>
          </template>
        </a-table>
      </a-space>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import useLoading from '@/hooks/loading';
  import type { TableData } from '@arco-design/web-vue/es/table/interface';
  import {LatestType,getLatestProjectByType ,LatestDataItem} from "@/api/dashboard/workplace";
  import router from "@/router";

  const latestType = ref<LatestType>({
    type:'threeStar',
    latest:'week',
  })
  const { loading, setLoading } = useLoading();
  const renderList = ref<LatestDataItem[]>();

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log(latestType.value)
      renderList.value = await getLatestProjectByType(latestType.value);
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const typeChange = () => {
    fetchData();
  };

  const viewDetail = (projectId: number) => {
    router.push({
      path: "/project/detail",
      query: {
        id: projectId,
      }
    });
  }
  fetchData();

  const viewProject = (id:number) => {
    router.push({
      path: "/project/detail",
      query: {
        id:id,
      }
    });
  }
</script>

<style scoped lang="less">
  .general-card {
    min-height: 395px;
  }
  :deep(.arco-table-tr) {
    height: 44px;
    .arco-typography {
      margin-bottom: 0;
    }
  }
  .increases-cell {
    display: flex;
    align-items: center;
    span {
      margin-right: 4px;
    }
  }
</style>
