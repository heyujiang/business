<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :loading="loading" helpMessage="新增项目联系人" width="400px" :minHeight="300" :title="getTitle" @ok="handleSubmit">
    <a-form ref="formRef" :model="formData" auto-label-width>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item field="name" label="联系人" validate-trigger="input" :rules="[{required:true,message:'请填写联系人姓名'}]" style="margin-bottom:15px;">
            <a-input v-model="formData.name"  placeholder="请填写联系人" allow-clear/>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item field="phoneNumber" label="电话" validate-trigger="input" :rules="[{required:true,message:'请填写电话'}]" style="margin-bottom:15px;">
            <a-input v-model="formData.phoneNumber"  placeholder="请填写电话" allow-clear/>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item field="type" label="类型" validate-trigger="blur" :rules="[{required:true,message:'请选择类型'}]" style="margin-bottom:15px;">
            <a-select v-model="formData.type"  :options="typeOptions" placeholder="请选择类型" allow-clear/>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item field="description" label="备注" style="margin-bottom:15px;">
            <a-textarea v-model="formData.description"  placeholder="请选择备注" allow-clear/>
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
  import { saveProjectContact} from '@/api/project/project';
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
        name: '',
        phoneNumber: '',
        type:'',
        description:'',
        projectId:0,
      }
      const formData = ref(basedata)
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
          formRef.value?.resetFields()
          setModalProps({ confirmLoading: false });
          basedata.projectId = data.projectId
          formData.value=basedata
      });
      const getTitle = computed(() => (!unref(isUpdate) ? '新增项目联系人' : '编辑项目联系人'));
      //点击确认
      const { loading, setLoading } = useLoading();
      const handleSubmit = async () => {
        try {
          const res = await formRef.value?.validate();
          if (!res) {
            setLoading(true);

            Message.loading({content:"新增中",id:"upStatus"})
            await saveProjectContact(unref(formData));
            Message.success({content:"新增成功",id:"upStatus"})

            closeModal()
            emit('success');
            setLoading(false);
          }
        } catch (error) {
          setLoading(false);
          Message.clear("top")
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
          label: "同行公司",
          value: 1,
        },
        {
          label: "分包方",
          value: 2,
        },
        {
          label: "总包方",
          value: 3,
        },
        {
          label: "小E",
          value: 4,
        },
        {
          label: "劳务",
          value: 5,
        },
        {
          label: "政府单位",
          value: 6,
        },
        {
          label: "资源方",
          value: 7,
        },
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
