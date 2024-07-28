<template>
  <a-spin  class="loading" :tip="text" :loading="loading" :size="32">
    <slot></slot>
  </a-spin>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "am-loading",
  components: {
  },
  props: {
    text: String,
    loading: Boolean,
  },
});
</script>
<style css>
.loading {
  display: block;
}

.ant-spin-nested-loading {
  position: inherit;
}
.ant-spin-nested-loading .ant-spin-container {
  position: inherit;
}
</style>
