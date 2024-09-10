<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :loading="loading" helpMessage="新增项目成员" width="400px" :minHeight="200" :title="getTitle" @ok="handleSubmit">
    <a-form ref="formRef" :model="formData" auto-label-width>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item field="userId" label="成员" validate-trigger="blur" :rules="[{required:true,message:'请选择成员'}]" style="margin-bottom:15px;">
            <a-select v-model="formData.userId"  :options="userOptions" placeholder="请选择成员" allow-clear/>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item field="type" label="类型" validate-trigger="blur" :rules="[{required:true,message:'请选择类型'}]" style="margin-bottom:15px;">
            <a-select v-model="formData.type"  :options="typeOptions" placeholder="请选择类型" allow-clear/>
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
  import { saveProjectPerson} from '@/api/project/project';
  import { IconPicker ,Icon} from '@/components/Icon';
  import { Message } from '@arco-design/web-vue';
  import dayjs from 'dayjs';
  import type { RequestOption} from '@arco-design/web-vue/es/upload/interfaces';
  import { userUploadApi } from '@/api/common';
  import {getUserOptions} from "@/api/user";
  export default defineComponent({
    name: 'AddBook',
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
        userId: '',
        type: '',
        projectId:0,
      }
      const formData = ref(basedata)
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
          formRef.value?.resetFields()
          setModalProps({ confirmLoading: false });
          basedata.projectId = data.projectId
          formData.value=basedata
      });
      const getTitle = computed(() => (!unref(isUpdate) ? '新增项目成员' : '编辑项目成员'));
      //点击确认
      const { loading, setLoading } = useLoading();
      const handleSubmit = async () => {
        try {
          const res = await formRef.value?.validate();
          if (!res) {
            setLoading(true);

            Message.loading({content:"新增中",id:"upStatus"})
            await saveProjectPerson(unref(formData));
            Message.success({content:"新增成功",id:"upStatus"})

            closeModal()
            emit('success');
            setLoading(false);
          }
        } catch (error) {
          setLoading(false);
          console.log(error)
        }
      };

      const userOptions = ref([]);
      const fetchUserOptions = async () => {
        try {
          userOptions.value = await getUserOptions();
        } catch (err) {
          // you can report use errorHandler or other
        } finally {

        }
      };
      fetchUserOptions();

      // 1-风电，2-光伏，3-储能，
      const typeOptions = computed<SelectOptionData[]>(() => [
        {
          label: "第一负责人",
          value: 1,
        },
        {
          label: "第二负责人",
          value: 2,
        },
        {
          label: "普通成员",
          value: 3,
        }
      ]);

      return {
        registerModal,
        getTitle,
        handleSubmit,
        formRef,
        loading,
        formData,
        isUpdate,
        t,
        typeOptions,
        userOptions,
        dayjs,
      };
    },
  });
</script>
