<template>
  <div class="containers"  >
    <Breadcrumb :items="['menu.project', 'menu.project.add']" />
    <a-card class="general-card onelineCard" style="height: calc(100% - 50px);">

      <a-steps changeable :current="current" class="add-a-steps" @change="setCurrent">
        <a-step >基础数据</a-step>
        <a-step >联系人</a-step>
        <a-step >负责人</a-step>
        <a-step >节点</a-step>
      </a-steps>

      <a-card class="add-project-card">
        <a-form ref="formRef" :model="formData" auto-label-width>
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item field="name" label="项目名" validate-trigger="input" :rules="[{required:true,message:'请填写项目名'}]" style="margin-bottom:15px;">
                <a-input  v-model="formData.name" placeholder="请填写项目名" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item field="attr" label="属性" validate-trigger="input" :rules="[{required:true,message:'请选择属性'}]" style="margin-bottom:15px;">
                <a-select v-model="formData.attr"  :options="attrOptions" placeholder="请选择属性" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item field="attr" label="类型" validate-trigger="input" :rules="[{required:true,message:'请选择类型'}]" style="margin-bottom:15px;">
                <a-select v-model="formData.type"  :options="typeOptions" placeholder="请选择类型" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item field="attr" label="状态" validate-trigger="input" :rules="[{required:true,message:'请选择状态'}]" style="margin-bottom:15px;">
                <a-select v-model="formData.state"  :options="stateOptions" placeholder="请选择状态" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item field="capacity" label="容量：MW" validate-trigger="input" :rules="[{required:true,message:'请填写容量大小'}]" style="margin-bottom:15px;">
                <a-input-number v-model="formData.capacity" :step="10.00" placeholder="请填写容量大小:单位MW" class="input-demo" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item field="area" label="土地:亩" validate-trigger="input" :rules="[{required:true,message:'请填写土地面积'}]" style="margin-bottom:15px;">
                <a-input-number v-model="formData.area" :step="10.00" placeholder="请填写土地面积:单位亩" class="input-demo" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item field="properties" label="土地性质" validate-trigger="input" :rules="[{required:true,message:'请填写土地性质'}]" style="margin-bottom:15px;">
                <a-input v-model="formData.properties"  placeholder="请填写土地性质" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
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
            <a-col :span="24">
              <a-form-item field="address" label="项目地址" validate-trigger="input" :rules="[{required:true,message:'请填写项目地址'}]" style="margin-bottom:15px;">
                <a-input v-model="formData.address"  placeholder="请填写项目地址" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item field="connect" label="电网接入情况" validate-trigger="input" style="margin-bottom:15px;">
                <a-textarea v-model="formData.connect"  placeholder="请填写电网接入情况" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item field="investmentAgreement" label="投资协议" validate-trigger="input" style="margin-bottom:15px;">
                <a-textarea v-model="formData.investmentAgreement"  placeholder="请填写投资协议" allow-clear/>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item field="businessCondition" label="商务条件" validate-trigger="input" style="margin-bottom:15px;">
                <a-textarea v-model="formData.businessCondition"  placeholder="请填写商务条件" allow-clear/>
              </a-form-item>
            </a-col>

            <a-col :span="24">
              <a-form-item field="description" label="简介"  style="margin-bottom:15px;">
                <a-textarea v-model="formData.description"  :options="attrOptions" placeholder="请填写简介" allow-clear/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-card>

      <a-space size="large">
        <a-button type="secondary" v-if="current > 1" @click="onPrev">
          <IconLeft/> 上一步
        </a-button>
        <a-button type="primary" v-if="current < 4 && current >= 1 " @click="onNext">
          下一步 <IconRight/>
        </a-button>
        <a-button type="primary" v-if="current == 4" @click="onNext">
          提交 <IconSend/>
        </a-button>
      </a-space>
    </a-card>
  </div>
</template>
<script lang="ts" setup>
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


const { t } = useI18n();
const isUpdate = ref(false);
const current = ref(1);
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

const onPrev = async () => {
  const res = await formRef.value?.validate();
  if (!res) {
    current.value = Math.max(1, current.value - 1)
  }
};

const onNext = async () => {
  const res = await formRef.value?.validate();
  if (!res) {
    current.value = Math.min(4, current.value + 1)
  }
};

const setCurrent = async (current) => {
  const res = await formRef.value?.validate();
  if (!res) {
    current.value = current
  }
  
}

//属性
const attrOptions = computed<SelectOptionData[]>(() => [
  {
    label: "集中式",
    value: 1,
  },
  {
    label: "分布式",
    value: 2,
  },
  {
    label: "分散式",
    value: 3,
  },
]);
// 1-风电，2-光伏，3-储能，4-风电+光伏，5-风电+储能，6-光伏+储能，7-风光储一体
const typeOptions = computed<SelectOptionData[]>(() => [
  {
    label: "风电",
    value: 1,
  },
  {
    label: "光伏",
    value: 2,
  },
  {
    label: "储能",
    value: 3,
  },
  // {
  //   label: "风电+光伏",
  //   value: 4,
  // },
  // {
  //   label: "风电+储能",
  //   value: 5,
  // },
  // {
  //   label: "光伏+储能",
  //   value: 6,
  // },
  // {
  //   label: "风光储一体",
  //   value: 7,
  // },
]);

// 1-待定，2-推荐，3-终止，4-已完成
const stateOptions = computed<SelectOptionData[]>(() => [
  {
    label: "待定",
    value: 1,
  },
  {
    label: "进行中",
    value: 2,
  },
  {
    label: "已完成",
    value: 3,
  },
  {
    label: "中止",
    value: 4,
  },
]);
</script>

<style scoped lang="less">
.containers {
  padding: 0 20px 20px 20px;
  height: 100%;
}
.add-project-card{
  margin: 0 auto;
  width: 80%;
  border: none !important;
  min-height: 300px;
}
.add-a-steps{
  margin: 0 auto;
  width: 80%;
  padding-top: 40px;
}
</style>