<template>
  <a-drawer
      :width="800"
      :visible="visible.valueOf()"
      placement="right"
      @ok="handleOk"
      @cancel="handleCancel"
      unmountOnClose
  >
    <template #title>
      节点记录附件
    </template>
    <div>You can customize modal body text by the current situation. This modal will be closed immediately once you press the OK button.</div>
  </a-drawer>
</template>
<script lang="ts" setup>
import {withDefaults, defineProps, ref, computed, unref, defineEmits, watch} from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { FormInstance } from '@arco-design/web-vue/es/form';
import useLoading from '@/hooks/loading';
import { useI18n } from 'vue-i18n';
import { cloneDeep } from 'lodash-es';
//api
import {  getProjectOption , getProjectNodeOption} from '@/api/project/project';
import { save,update} from '@/api/project/project_ing';
import { IconPicker ,Icon} from '@/components/Icon';
import { Message } from '@arco-design/web-vue';
import dayjs from 'dayjs';
import {recordStateOptions} from "@/views/project/data";
import type {RequestOption} from "@arco-design/web-vue/es/upload/interfaces";
import {userUploadApi} from "@/api/common";
import AddDrawer from "@/views/system/role/AddDrawer.vue";

const props = withDefaults(
    defineProps<{
      visible: Boolean;
      recordId: Number;
    }>(),
    {}
);

const emits = defineEmits<{
  (e: 'update:visible', val: boolean): void;
  (e: 'update:recordId', val: number): void;
}>();

watch(() => ({...props.recordId}), () => fetchRecordAttached())

const handleOk = () => {
  emits('update:visible',false)
};
const handleCancel = () => {
  emits('update:visible',false)
}

const fetchRecordAttached = () => {
  console.log(props.recordId)

}
fetchRecordAttached()
</script>
