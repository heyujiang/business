<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :loading="loading" helpMessage="编辑和修改节点" width="800px" :minHeight="420" :title="getTitle" @ok="handleSubmit">
    <a-form ref="formRef" :model="formData" auto-label-width>
      <a-row :gutter="16">
        <a-col :span="24">
          <a-form-item field="name" label="菜单名称" validate-trigger="input" :rules="[{required:true,message:'请填写菜单名称'}]" style="margin-bottom:15px;">
            <a-input v-model="formData.name" placeholder="请填写节点名称" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="上级节点" field="pid" style="margin-bottom:15px;">
            <a-select placeholder="选择上级节点" :options="parentList" allow-clear v-model="formData.pid">
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="排序" field="sort" style="margin-bottom:15px;">
            <a-input-number v-model="formData.sort" placeholder="请填排序" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref,reactive, computed, unref} from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import useLoading from '@/hooks/loading';
  import { useI18n } from 'vue-i18n';
  import { cloneDeep } from 'lodash-es';
  //api
  import { getParent, save,update,NodeOption,NodeSaveItem } from '@/api/system/node';
  import { IconPicker ,Icon} from '@/components/Icon';
  import { Message } from '@arco-design/web-vue';
  export default defineComponent({
    name: 'AddBook',
    components: { BasicModal,IconPicker,Icon },
    emits: ['success'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const isUpdate = ref(false);
      const parentList = ref<NodeOption[]>([]);
      //表单
      const formRef = ref<FormInstance>();
      //表单字段
      const recordId = ref(0)

      const formData = ref<NodeSaveItem>({})

      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
          formRef.value?.resetFields()
          setModalProps({ confirmLoading: false });
          isUpdate.value = !!data?.isUpdate;

          const parentOptions = await getParent();
          const parentListDefault : any =[{value: 0,label: "顶级节点"}];
          if(parentOptions){
            parentList.value = parentListDefault.concat(parentOptions)
          }else{
            parentList.value = parentListDefault
          }

          if (unref(isUpdate)) {
            recordId.value = data.record.id
            formData.value=cloneDeep(data.record)
          }
      });
      const getTitle = computed(() => (!unref(isUpdate) ? '新增节点' : '编辑节点'));
     //点击确认
     const { loading, setLoading } = useLoading();
     const handleSubmit = async () => {
      try {
          const res = await formRef.value?.validate();
          if (!res) {
            setLoading(true);
            Message.loading({content:"更新中",id:"upStatus"})
            if (unref(isUpdate)) {
              await update(unref(recordId),unref(formData));
            }else{
              await save(unref(formData));
            }
            Message.success({content:"更新成功",id:"upStatus"})
            closeModal()
            emit('success');
            setLoading(false);
          }
        } catch (error) {
          setLoading(false);
          Message.clear("top")
        }
      };
      return {
        registerModal,
        getTitle,
        handleSubmit,
        formRef,
        loading,
        formData,
        parentList,
        t,
        OYoptions:[
          { label: '否', value: 0 },
          { label: '是', value: 1 },
        ],
      };
    },
  });
</script>
