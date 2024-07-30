<template>
  <div class="container"  >
    <Breadcrumb :items="['menu.schedule', 'menu.project.add']" />
    <a-card class="general-card onelineCard" style="height: calc(100% - 200px);">
    <a-form ref="formRef" :model="formData" auto-label-width>
      <a-row :gutter="14">
        <a-col :span="10">
          <a-form-item field="name" label="项目名" validate-trigger="input" :rules="[{required:true,message:'请选择项目名'}]" style="margin-bottom:15px;">
            <a-select  v-model="formData.name"  placeholder="请选择项目名" allow-clear/>
          </a-form-item>
        </a-col>

        <a-col :span="10">
          <a-form-item field="properties" label="项目节点" validate-trigger="input" :rules="[{required:true,message:'请选择项目节点'}]" style="margin-bottom:15px;">
            <a-select v-model="formData.properties"  placeholder="请选择项目节点" allow-clear/>
          </a-form-item>
        </a-col>

        <a-col :span="20">
          <a-form-item field="description" label="备注"  style="margin-bottom:15px;">
            <a-textarea v-model="formData.description" placeholder="备注：" allow-clear/>
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <a-form-item field="beginTime" label="开始时间" validate-trigger="blur" :rules="[{required:true,message:'请选择开始时间'}]" style="margin-bottom:15px;">
            <a-date-picker
                show-time
                v-model="formData.beginTime"
                placeholder="请选择开始时间"
                value-format="timestamp"
                style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <a-form-item field="beginTime" label="结束时间" validate-trigger="blur" :rules="[{required:true,message:'请选择结束时间'}]" style="margin-bottom:15px;">
            <a-date-picker
                show-time
                v-model="formData.beginTime"
                placeholder="请选择结束时间"
                value-format="timestamp"
                style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col :span="10">
          <a-form-item field="attr" label="完成情况" validate-trigger="input" :rules="[{required:true,message:'请选择完成情况'}]" style="margin-bottom:15px;">
            <a-select v-model="formData.type"  :options="ScheduleStatus" placeholder="请选择请选择完成情况" allow-clear/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    </a-card>
  </div>
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
import { save,update} from '@/api/project/project';
import { IconPicker ,Icon} from '@/components/Icon';
import { Message } from '@arco-design/web-vue';
import dayjs from 'dayjs';
import type { RequestOption} from '@arco-design/web-vue/es/upload/interfaces';
import { userUploadApi } from '@/api/common';
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
      description: '',
      attr: '',
      type: '',
      state: '',
      capacity: 0,
      properties: '',
      area:0,
      address:'',
      connect:'',
      investmentAgreement:'',
      businessCondition:'',
      beginTime:0,
    }
    const formData = ref(basedata)
    const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
      formRef.value?.resetFields()
      setModalProps({ confirmLoading: false });
      isUpdate.value = !!data?.isUpdate;
      if (unref(isUpdate)) {
        projectId.value = data.record.id
        formData.value=cloneDeep(data.record)
      }else{
        formData.value=basedata
      }
    });
    const getTitle = computed(() => (!unref(isUpdate) ? '新增项目' : '编辑项目'));
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

    const ScheduleStatus = computed<SelectOptionData[]>(() => [
      {
        label: "已完成",
        value: 1,
      },
      {
        label: "进行中",
        value: 2,
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
      ScheduleStatus,
      t,
      dayjs,
    };
  },
});
</script>
