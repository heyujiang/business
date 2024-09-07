<template>
  <a-grid :cols="2" :colGap="12" class="panel">
    <a-grid-item class="panel-col">
      <a-space>
        <a-avatar :size="36" class="col-avatar">
          <img
              alt="avatar"
              src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/288b89194e657603ff40db39e8072640.svg~tplv-49unhts6dw-image.image"
          />
        </a-avatar>
        <a-statistic
            title="记录数量"
            size="10"
            :value="total.record"
            :value-from="0"
            animation
            show-group-separator
        >
          <template #suffix>
            <span class="unit">条</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item >
    <a-grid-item class="panel-col">
      <a-space>
        <a-avatar :size="36" class="col-avatar">
          <img
              alt="avatar"
              src="//p3-armor.byteimg.com/tos-cn-i-49unhts6dw/fdc66b07224cdf18843c6076c2587eb5.svg~tplv-49unhts6dw-image.image"
          />
        </a-avatar>
        <a-statistic
            title="文件数量"
            :value="total.attached"
            :value-from="0"
            :start="true"
            animation
            show-group-separator
        >
          <template #suffix>
            <span class="unit">个</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
  </a-grid>
</template>

<script lang="ts" setup>
import {defineProps, ref, withDefaults} from "vue";

interface reportTotal {
  record:number,
  attached:number,
}

withDefaults(
    defineProps<{
      total: reportTotal
    }>(),
    {}
);

</script>

<style lang="less" scoped>
.panel-col {
  //padding-left: 43px;
  text-align: center;
}
.col-avatar {
  margin-right: 12px;
  background-color: var(--color-fill-2);
}
.up-icon {
  color: rgb(var(--red-6));
}
.unit {
  color: rgb(var(--gray-8));
  font-size: 10px;
}
</style>
