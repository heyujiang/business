<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :loading="loading" helpMessage="编辑和修改项目进度" width="800px" :minHeight="420" :title="getTitle" @ok="handleSubmit" @close="handleClose">
    <a-form ref="formRef" :model="formData" auto-label-width >
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item field="projectId" label="项目" validate-trigger="change" :rules="[{required:true,message:'请选择项目'}]" style="margin-bottom:15px;">
            <a-select  v-model="formData.projectId" :options="projectOption" @change="projectChange" :disabled="isUpdate" placeholder="请选择项目" allow-clear/>
          </a-form-item>
        </a-col>

        <a-col :span="12">
          <a-form-item field="nodeId" label="节点" validate-trigger="change" :rules="[{required:true,message:'请选择节点'}]" style="margin-bottom:15px;">
            <a-tree-select
                v-model="formData.nodeId"
                :data="projectNodeOption"
                placeholder="请选择节点"
                :fieldNames="{
                  key: 'value',
                  title: 'label',
                }"
                allow-clear
                :disabled="isUpdate"
            ></a-tree-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="state" label="完成情况" validate-trigger="change" :rules="[{required:true,message:'请选择完成情况'}]" style="margin-bottom:15px;">
            <a-select v-model="formData.state"  :options="recordStateOptions" placeholder="请选择请选择完成情况" allow-clear/>
          </a-form-item>
        </a-col>
        <a-col :span="24" >
          <a-form-item field="overview" label="概况"  style="margin-bottom:15px; height: 60px">
            <a-textarea  v-model="formData.overview" placeholder="备注：" allow-clear/>
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <a-form-item field="properties" label="添加附件" validate-trigger="input" style="margin-bottom:15px;">
            <a-upload v-model="formData.file"  placeholder="点击添加附件" allow-clear/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </BasicModal>
</template>
<script lang="ts">
import { defineComponent, ref, computed, unref} from 'vue';
import type { SelectOptionData } from '@arco-design/web-vue/es/select/interface';
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
import type { RequestOption} from '@arco-design/web-vue/es/upload/interfaces';
import { userUploadApi } from '@/api/common';
import project from "@/views/project/project/index.vue";
import {recordStateOptions} from "@/views/project/data";
export default defineComponent({
  name: 'AddBook',
  computed: {
    recordStateOptions() {
      return recordStateOptions
    }
  },
  components: { BasicModal,IconPicker,Icon },
  emits: ['success'],
  setup(_, { emit }) {
    const { t } = useI18n();
    const isUpdate = ref(false);
    //表单
    const formRef = ref<FormInstance>();
    //ID
    const projectId = ref(0);
    //表单字段
    const basedata={
      projectId: '',
      nodeId: '',
      overview: '',
      state: '',
      file: '',
    }
    const formData = ref(basedata)
    const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
      formRef.value?.resetFields()
      setModalProps({ confirmLoading: false });
      isUpdate.value = !!data?.isUpdate;
      if (unref(isUpdate)) {
        projectId.value = data.record.id
        formData.value=cloneDeep(data.record)
        projectChange(data.record.projectId)
      }else{
        formData.value=basedata
      }
    });
    const getTitle = computed(() => (!unref(isUpdate) ? '新增项目进度' : '编辑项目进度'));
    //点击确认
    const { loading, setLoading } = useLoading();
    const handleSubmit = async () => {
      try {
        const res = await formRef.value?.validate();
        if (!res) {
          setLoading(true);

          if(!unref(isUpdate)){
            Message.loading({content:"新增中",id:"upStatus"})
            await save(unref(formData));
            Message.success({content:"新增成功",id:"upStatus"})
          }else{
            Message.loading({content:"更新中",id:"upStatus"})
            await update(unref(projectId),unref(formData));
            Message.success({content:"更新成功",id:"upStatus"})
          }

          closeModal()
          emit('success');
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        Message.clear("top")
      }
    };

    const handleClose = () => {
      formData.value=basedata
    }

    const projectOption = ref([]);
    const projectNodeOption = ref([]);

    const fatchProjectOption = async () => {
      projectOption.value = await getProjectOption();
    }
    fatchProjectOption()

    const projectChange = async (projectId) => {
      projectNodeOption.value =  await getProjectNodeOption(projectId);
    }

    return {
      registerModal,
      getTitle,
      handleSubmit,
      formRef,
      loading,
      formData,
      isUpdate,
      t,
      recordStateOptions,
      projectOption,
      projectNodeOption,
      dayjs,
      projectChange,
      handleClose,
    };
  },
});
</script>
