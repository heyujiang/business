<template>
  <div class="containers"  >
    <Breadcrumb :items="['menu.project', 'menu.project.add']" />
    <a-card class="general-card onelineCard" style="height: calc(100% - 50px);">

      <a-steps changeable :current="current" class="add-a-steps" @change="setCurrent">
        <a-step >基础数据</a-step>
        <a-step >联系人</a-step>
        <a-step >负责人</a-step>
        <a-step >节点</a-step>
        <a-step >完成创建</a-step>
      </a-steps>

      <a-card class="add-project-card" :bordered="current<5">
        <a-form ref="formRef" :model="formData" auto-label-width>
          <div v-if="current==1">
            <a-row :gutter="16">
              <a-col :span="24">
                <a-form-item field="name" label="项目名" validate-trigger="input" :rules="[{required:true,message:'请填写项目名'}]" style="margin-bottom:15px;">
                  <a-input  v-model="formData.name" placeholder="请填写项目名" allow-clear/>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item field="attr" label="星级" style="margin-bottom:15px;">
                  <a-select v-model="formData.star"  :options="starOptions" placeholder="请选择星级" allow-clear/>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item field="attr" label="属性" validate-trigger="blur" :rules="[{required:true,message:'请选择属性'}]" style="margin-bottom:15px;">
                  <a-select v-model="formData.attr"  :options="attrOptions" placeholder="请选择属性" allow-clear/>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item field="type" label="类型" validate-trigger="blur" :rules="[{required:true,message:'请选择类型'}]" style="margin-bottom:15px;">
                  <a-select v-model="formData.type"  :options="typeOptions" placeholder="请选择类型" allow-clear/>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item field="state" label="状态" validate-trigger="blur" :rules="[{required:true,message:'请选择状态'}]" style="margin-bottom:15px;">
                  <a-select v-model="formData.state"  :options="stateOptions" placeholder="请选择状态" allow-clear/>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item field="capacity" label="容量：MW" validate-trigger="input" :rules="[{required:true,message:'请填写容量大小'}]" style="margin-bottom:15px;">
                  <a-input-number v-model="formData.capacity" :step="10.00" placeholder="请填写容量大小:单位MW"  allow-clear/>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item field="area" label="土地:亩" validate-trigger="input" :rules="[{required:true,message:'请填写土地面积'}]" style="margin-bottom:15px;">
                  <a-input-number v-model="formData.area" :step="10.00" placeholder="请填写土地面积:单位亩"  allow-clear/>
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
                  <a-textarea v-model="formData.description" placeholder="请填写简介" allow-clear/>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <div v-else-if="current==2">
            <a-card :style="{ marginBottom: '20px' }" title="对接联系人：" v-for="(contactItem,index) in formData.contact">
              <template #extra>
                <IconDelete v-if="formData.contact.length > 1" @click="delContact(index)"/>
              </template>
              <a-col :span="20">
                <a-form-item  label="姓名" :field="`contact.${index}.name`"  validate-trigger="input" :rules="[{required:true,message:'请填写联系人姓名'}]" :key="index" style="margin-bottom:15px;">
                  <a-input v-model="contactItem.name" placeholder="请填写联系人姓名"  allow-clear/>
                </a-form-item>
              </a-col>
              <a-col :span="20">
                <a-form-item  label="电话" :field="`contact.${index}.phoneNumber`"  validate-trigger="input" :rules="[{required:true,message:'请填写联系人电话'}]" :key="index" style="margin-bottom:15px;">
                  <a-input v-model="contactItem.phoneNumber" placeholder="请填写联系人电话"  allow-clear/>
                </a-form-item>
              </a-col>
              <a-col :span="20">
                <a-form-item  label="类型" :field="`contact.${index}.type`"  validate-trigger="blur" :rules="[{required:true,message:'请选择类型'}]" :key="index"  style="margin-bottom:15px;">
                  <a-select v-model="contactItem.type"  :options="contactTypeOptions" placeholder="请选择类型" allow-clear/>
                </a-form-item>
              </a-col>
              <a-col :span="20">
                <a-form-item  label="备注"  style="margin-bottom:15px;">
                  <a-textarea v-model="contactItem.description" placeholder="请填写备注"  allow-clear/>
                </a-form-item>
              </a-col>
            </a-card>
            <a-space>
              <a-button @click="addContact">
                <IconPlus/>
              </a-button>
            </a-space>
          </div>
          <div v-else-if="current==3">
              <a-card :style="{ marginBottom: '20px' }" title="项目成员：" v-for="(personItem,index) in formData.person">
                <template #extra>
                  <IconDelete v-if="formData.person.length > 1" @click="delPerson(index)"/>
                </template>
                <a-col :span="20">
                  <a-form-item  label="项目成员" :field="`person.${index}.userId`"  validate-trigger="input" :rules="[{required:true,message:'请选择项目成员'}]" :key="index" style="margin-bottom:15px;">
                    <a-select v-model="personItem.userId" allow-search :options="userOptions" placeholder="请选择项目成员" allow-clear/>
                  </a-form-item>
                </a-col>
                <a-col :span="20">
                  <a-form-item  label="类型" :field="`person.${index}.type`"  validate-trigger="input" :rules="[{required:true,message:'请选择类型'}]" :key="index"  style="margin-bottom:15px;">
                    <a-select v-model="personItem.type"  :options="personTypeOptions" placeholder="请选择类型" allow-clear/>
                  </a-form-item>
                </a-col>
              </a-card>
              <a-space>
                <a-button @click="addPerson">
                  <IconPlus/>
                </a-button>
              </a-space>
          </div>
          <div v-else-if="current==4">
            <a-col :span="24">
              <a-form-item field="nodeIds" label="已完成节点" style="margin-bottom:15px;">
                <a-cascader
                    placeholder="选择已完成节点（多选）"
                    :multiple="true"
                    :allow-clear="true"
                    :options="nodeOptions"
                    v-model="formData.nodeIds">
                </a-cascader>
              </a-form-item>
            </a-col>
          </div>
          <div v-else-if="current==5">
            <a-col :span="24" style="text-align: center;padding-top: 30px">
              <a-space direction="vertical" size="large">
                <icon-check-circle :style="{fontSize:'40px',color:'green'}" :stroke-width="2" />
                <span>新建项目成功</span>
                <a-space>
                  <a-button @click="keepCreate">继续创建</a-button>
                  <a-button type="primary" @click="viewDetail">查看详情</a-button>
                </a-space>
              </a-space>

            </a-col>
          </div>
        </a-form>
      </a-card>

      <a-space size="large" class="add-project-buts">
        <a-button type="secondary" v-if="current > 1 && current <= 4"  @click="onPrev">
          <IconLeft/> 上一步
        </a-button>
        <a-button type="primary" v-if="current < 4 && current >= 1 " @click="onNext">
          下一步 <IconRight/>
        </a-button>
        <a-button type="primary" v-if="current == 4" @click="handleSubmit">
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
import { cloneDeep } from 'lodash-es';
//api
import {save, update, ProjectContactItem, ProjectPersonItem} from '@/api/project/project';
import { getUserOptions } from '@/api/user';
import { getNodeOptions } from '@/api/system/node';
import { Message } from '@arco-design/web-vue';
import router from "@/router";

const projectId = ref(0)
const current = ref(1);
//表单
const formRef = ref<FormInstance>();

//表单字段
const baseData={
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
  star:1,
  contact:[{}],
  person:[{}],
  nodeIds:[],
}

const formData = ref(baseData)

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

const nodeOptions = ref([]);
const fetchNodeOptions = async () => {
  try {
    nodeOptions.value = await getNodeOptions();
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
  }
};
fetchNodeOptions();


//点击确认
const handleSubmit = async () => {
  try {
    const res = await formRef.value?.validate();
    // console.log(res)
    if (!res) {
      Message.loading({content:"新增中",id:"upStatus"})
      await save(unref(formData)).then((res)=>{
        Message.clear("top")
        current.value = 5
        projectId.value = res.id
      }).catch(()=>{
        Message.error({content:"新增成功",id:"upStatus"})
      });

    }
  } catch (error) {
    Message.clear("top")
  }
};

const onPrev = async () => {
    current.value = Math.max(1, current.value - 1)
};

const onNext = async () => {
  const res = await formRef.value?.validate();
  if (!res) {
    current.value = Math.min(4, current.value + 1)
  }
};

const setCurrent = async (cur:number) => {
  if(current.value < 5 ){
    if(current.value > cur) {
      current.value = cur
    } else{
      const res = await formRef.value?.validate();
      if (!res) {
        current.value = cur
      }
    }
  }
}

const delContact = (index: number) => {
  if(formData.value.contact.length > 1) {
    formData.value.contact.splice(index,1)
    formRef.value?.validate();
  }
}

const addContact = () => {
  formData.value.contact.push({})
}

const delPerson = (index: number) => {
  if(formData.value.person.length > 1) {
    formData.value.person.splice(index,1)
    formRef.value?.validate()
  }
}

const addPerson = () => {
  formData.value.person.push({})
}

const keepCreate = () => {
  formData.value =  ref(baseData)
  current.value = 1
}

const viewDetail = () => {
  router.push({
    name: "detail",
    query: {
      id:projectId.value,
    }
  });
}

//星级
const starOptions = computed<SelectOptionData[]>(() => [
  {
    label: "一星",
    value: 1,
  },
  {
    label: "二星",
    value: 2,
  },
  {
    label: "三星",
    value: 3,
  },
]);
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
  }
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

const contactTypeOptions = computed<SelectOptionData[]>(() => [
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
]);

const personTypeOptions = computed<SelectOptionData[]>(() => [
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
  },
]);
</script>

<style scoped lang="less">
.containers {
  padding: 0 20px 20px 20px;
  height: 100%;
}
.add-a-steps{
  margin: 40px auto;
  width: 80%;
}
.add-project-card{
  margin: 0 auto;
  width: 80%;
  min-height: 300px;
}
.add-project-buts{
  width: 80%;
  margin: 40px auto;
  display: flex;
  align-content: center;
  justify-content: center;
}
</style>
