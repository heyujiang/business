<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :loading="loading" helpMessage="编辑和修改菜单" width="800px" :minHeight="420" :title="getTitle" @ok="handleSubmit">
    <a-form ref="formRef" :model="formData" auto-label-width>
     <a-form-item field="type" label="菜单类型" style="margin-bottom:15px;">
        <a-radio-group type="button"  v-model="formData.type" @change="handleChangeType">
          <a-radio :value="0">目录</a-radio>
          <a-radio :value="1">菜单</a-radio>
          <a-radio :value="2">按钮</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item field="title" label="菜单名称" validate-trigger="input" :rules="[{required:true,message:'请填写菜单名称'}]" style="margin-bottom:15px;">
            <a-input v-model="formData.title" placeholder="请填写菜单名称" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="locale" label="多语言标识" validate-trigger="input" style="margin-bottom:15px;">
            <a-input v-model="formData.locale" placeholder="请填写菜单名称" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="上级菜单" field="pid" style="margin-bottom:15px;">
            <a-tree-select placeholder="选择上级菜单" :data="parntList" 
            :fieldNames="{
                key: 'id',
                title: 'title',
                children: 'children'
              }"
            v-model="formData.pid">
            </a-tree-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="排序" field="orderNo" style="margin-bottom:15px;">
            <a-input-number v-model="formData.orderNo" placeholder="请填排序" />
          </a-form-item>
        </a-col>
        <a-col :span="12"  v-if="formData.type!=2">
          <a-form-item label="图标" field="icon" style="margin-bottom:15px;">
            <a-input-search v-model="formData.icon" placeholder="选择图标/填写"  search-button>
              <template  v-if="formData.icon" #prefix>
                <Icon :icon="formData.icon" :size="23"></Icon>
              </template>
                <template #button-icon>
                  <a-popover position="bl" trigger="click">
                    <icon-apps />
                    <template #content>
                       <IconPicker @change="(icon)=>{formData.icon=icon}"></IconPicker>
                    </template>
                  </a-popover>
                </template>
              </a-input-search>
          </a-form-item>
        </a-col>
        <a-col :span="12"  v-if="formData.type!=2">
          <a-form-item field="routePath" label="路由地址" validate-trigger="input" :rules="[{required:true,message:'请填写路由地址'}]" style="margin-bottom:15px;">
            <a-input v-model="formData.routePath" placeholder="路由地址（path）" />
          </a-form-item>
        </a-col>
        <a-col :span="12"  v-if="formData.type!=2">
          <a-form-item field="routeName" label="路由名称" validate-trigger="input" :rules="[{required:true,message:'请填写路由名称'}]" style="margin-bottom:15px;">
            <a-input v-model="formData.routeName" placeholder="路由名称（name）" />
          </a-form-item>
        </a-col>
        <a-col :span="12" v-if="formData.type==0">
          <a-form-item field="redirect" label="重定向地址" validate-trigger="input" :rules="[{required:true,message:'请填写重定向地址'}]">
            <a-input v-model="formData.redirect" placeholder="重定向地址（redirect）" />
          </a-form-item>
        </a-col>
        <a-col :span="12" v-if="formData.type==1">
          <a-form-item field="component" label="组件路径" validate-trigger="input" :rules="[{required:true,message:'请填写组件路径'}]">
            <a-input v-model="formData.component" placeholder="组件路径（component）" />
          </a-form-item>
        </a-col>
        <a-col :span="12" v-if="formData.type==2">
          <a-form-item field="permission" label="权限标识" validate-trigger="input" :rules="[{required:true,message:'请填写权限标识'}]">
            <a-input v-model="formData.permission" placeholder='权限标识 （v-permission="[admin]"）' />
          </a-form-item>
        </a-col>
        <a-col :span="12" v-if="formData.type!=2">
          <a-form-item field="isExt" label="是否外链" style="margin-bottom:5px;">
            <a-radio-group v-model="formData.isExt" :options="OYoptions" />
          </a-form-item>
        </a-col>
        <a-col :span="12"  v-if="formData.type!=2">
          <a-form-item field="keepalive" label="是否缓存" style="margin-bottom:5px;">
            <a-radio-group v-model="formData.keepalive" :options="OYoptions" />
          </a-form-item>
        </a-col>
        <a-col :span="12"  v-if="formData.type!=2">
          <a-form-item field="hideInMenu" label="左侧菜单中隐藏" style="margin-bottom:5px;">
            <a-radio-group v-model="formData.hideInMenu" :options="OYoptions" />
          </a-form-item>
        </a-col>
        <a-col :span="12"  v-if="formData.type!=2">
          <a-form-item field="hideChildrenInMenu" label="左侧菜单中显示" style="margin-bottom:5px;">
            <a-radio-group v-model="formData.hideChildrenInMenu" :options="OYoptions" />
          </a-form-item>
        </a-col>
        <a-col :span="12"  v-if="formData.type!=2">
          <a-form-item field="noAffix" label="添加到标签中" style="margin-bottom:5px;">
            <a-radio-group v-model="formData.noAffix" :options="OYoptions" />
          </a-form-item>
        </a-col>
        <a-col :span="12"  v-if="formData.type!=2">
          <a-form-item field="activeMenu" label="高亮设置的菜单" style="margin-bottom:5px;">
            <a-radio-group v-model="formData.activeMenu" :options="OYoptions" />
          </a-form-item>
        </a-col>
        <a-col :span="12"  v-if="formData.type!=2">
          <a-form-item field="requiresAuth" label="是否需要登录鉴权" style="margin-bottom:5px;">
            <a-radio-group v-model="formData.requiresAuth" :options="OYoptions" />
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
  import { getParent, save,RuleItem } from '@/api/system/rule';
  import { IconPicker ,Icon} from '@/components/Icon';
  import { Message } from '@arco-design/web-vue';
  export default defineComponent({
    name: 'AddBook',
    components: { BasicModal,IconPicker,Icon },
    emits: ['success'],
    setup(_, { emit }) {
      const { t } = useI18n();
      const isUpdate = ref(false);
      const parntList = ref<RuleItem[]>([]);
      //表单
      const formRef = ref<FormInstance>();
      //表单字段
      const basedata={
            id:0,
            title: '',
            locale: '',
            orderNo: 1,
            type: 0,
            pid:0,
            icon:"",
            routePath:"",//path
            routeName:"",//name
            component:"",//外部layar、import
            redirect:"",//重定向
            permission:"",//页面内权限 roles
            isExt:0,//是否外链
            keepalive:0,//是否缓存 0=否1=是
            requiresAuth:1,//是否需要登录鉴权 默认false
            hideInMenu:0,//是否在左侧菜单中隐藏该项
            hideChildrenInMenu:0,//强制在左侧菜单中显示单项
            activeMenu:0,//高亮设置的菜单项
            noAffix:0,//如果设置为true，标签将不会添加到tab-bar中
        }
      const formData = ref(basedata)
      const m_component=ref("")
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
          formRef.value?.resetFields()
          setModalProps({ confirmLoading: false });
          isUpdate.value = !!data?.isUpdate;
          const resultdata = await getParent({id:unref(isUpdate)?data.record.id:0});
          const parntList_df : any=[{id: 0,title: "一级菜单",pid: 0,locale:""}];
          if(resultdata){
            parntList.value=parntList_df.concat(resultdata)
          }else{
            parntList.value=parntList_df
          }
          if (unref(isUpdate)) {
            m_component.value=data.record.component
            formData.value=cloneDeep(data.record)
          }else{
            m_component.value=""
            formData.value=cloneDeep(basedata)
          }
      });
      const getTitle = computed(() => (!unref(isUpdate) ? '新增系统菜单' : '编辑系统菜单'));
     //点击确认
     const { loading, setLoading } = useLoading();
     const handleSubmit = async () => {
      try {
          const res = await formRef.value?.validate();
          if (!res) {
            setLoading(true);
            if(formData.value.type==0&&formData.value.component==""){
              formData.value.component='LAYOUT'
            }
            if(formData.value.type==0&&formData.value.routePath&&formData.value.routePath.substr(0,1)!="/"){
              formData.value.routePath='/'+formData.value.routePath
            }
            Message.loading({content:"更新中",id:"upStatus"})
            await save(unref(formData));
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
      //切换菜单类型
      const handleChangeType=(value:any)=>{
         if(value==0){
          formData.value.component="LAYOUT"
         }else if(value==1){
          formData.value.component=m_component.value
          formData.value.redirect=""
         }else if(value==2){
          formData.value.component=""
          formData.value.redirect=""
        }
      }
      return { 
        registerModal, 
        getTitle, 
        handleSubmit,
        formRef,
        loading,
        formData,
        parntList,
        t,
        OYoptions:[
          { label: '否', value: 0 },
          { label: '是', value: 1 },
        ],
        handleChangeType,
      };
    },
  });
</script>
