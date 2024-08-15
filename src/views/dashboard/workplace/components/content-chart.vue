<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: 0 }"
      :body-style="{
        paddingTop: '20px',
      }"
      :title="$t('workplace.contentData')"
    >
      <template #extra>
        <a-link>{{ $t('workplace.viewMore') }}</a-link>
      </template>
      <Chart height="289px" :option="chartOption" />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { graphic } from 'echarts';
  import useLoading from '@/hooks/loading';
  import { queryContentData, ContentDataRecord } from '@/api/dashboard';
  import useChartOption from '@/hooks/chart-option';
  import { ToolTipFormatterParams } from '@/types/echarts';
  import { AnyObject } from '@/types/global';
  import {getUserData} from "@/api/dashboard/workplace";

  function graphicFactory(side: AnyObject) {
    return {
      type: 'text',
      bottom: '8',
      ...side,
      style: {
        text: '',
        textAlign: 'center',
        fill: '#4E5969',
        fontSize: 12,
      },
    };
  }
  const { loading, setLoading } = useLoading(true);
  const xAxis = ref<string[]>([]);
  const seriesProject = ref<number[]>([]);
  const seriesRecord = ref<number[]>([]);
  const seriesAttached = ref<number[]>([]);

  const { chartOption } = useChartOption(() => {
    return {
      legend: {
        data: ["项目", "记录", "文件"]
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true
      },
      tooltip:{
        trigger:"item"
      },
      xAxis: {
        type: "category",
        data: xAxis.value
      },
      yAxis: {
        type: "value"
      },
      series: [{
        name: "项目",
        type: "bar",
        data: seriesProject.value,
        tooltip:{
          position:'inside',
        }
      }, {
        name: "记录",
        type: "bar",
        data:  seriesRecord.value,
        tooltip:{
          position:'inside',
        }
      }, {
        name: "文件",
        type: "bar",
        data:  seriesAttached.value,
        tooltip:{
          position:'inside',
        }
      }]
    };
  })

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getUserData();
      xAxis.value  = data.usernames
      seriesProject.value = data.projectCounts
      seriesRecord.value = data.recordCounts
      seriesAttached.value =data.attachedCounts

    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  fetchData();
</script>

<style scoped lang="less"></style>
