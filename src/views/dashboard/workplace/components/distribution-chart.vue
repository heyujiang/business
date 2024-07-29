<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: 0 }"
      :body-style="{
        paddingTop: '20px',
      }"
      :title="$t('workplace.distribution')"
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
  const chartsData = ref<number[]>([]);
  const graphicElements = ref([
    graphicFactory({ left: '2.6%' }),
    graphicFactory({ right: 0 }),
  ]);
  const { chartOption } = useChartOption(() => {
    return {
      grid: {
        left: '45',
        right: '0',
        top: '10',
        bottom: '30',
      },

      xAxis: {
        type: 'category',
        data: ['Matcha Latte', 'Milk Tea', 'Cheese Cocoa', 'Walnut Brownie']
      },
      yAxis: {},
      series: [
        {
          type: 'bar',
          name: '2015',
          data: [89.3, 92.1, 94.4, 85.4]
        },
        {
          type: 'bar',
          name: '2016',
          data: [95.8, 89.4, 91.2, 76.9]
        },
        {
          type: 'bar',
          name: '2017',
          data: [97.7, 83.1, 92.5, 78.1]
        }
      ]
    };
  });
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: chartData } = await queryContentData();
      chartData.forEach((el: ContentDataRecord, idx: number) => {
        xAxis.value.push(el.x);
        chartsData.value.push(el.y);
        if (idx === 0) {
          graphicElements.value[0].style.text = el.x;
        }
        if (idx === chartData.length - 1) {
          graphicElements.value[1].style.text = el.x;
        }
      });
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  fetchData();
</script>

<style scoped lang="less"></style>
