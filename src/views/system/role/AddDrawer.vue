<template>
  <a-drawer :width="420" :visible="showDrawer" @ok="handleSubmit" @cancel="handleCancel" unmountOnClose>
      <template #title>{{getTitle}}</template>
      <div class="drawer-box">
        <a-form ref="formRef" :model="formData" auto-label-width>
          <a-form-item field="name" label="角色名称" validate-trigger="input" :rules="[{required:true,message:'请填写角色名称'}]" style="margin-bottom:15px;">
            <a-input v-model="formData.name" placeholder="请填写角色名称" allow-clear/>
          </a-form-item>
          <a-form-item label="上级菜单" field="pid" style="margin-bottom:15px;">
            <a-tree-select placeholder="选择上级菜单" :data="parntList" 
            :fieldNames="{
                key: 'id',
                title: 'name',
                children: 'children'
              }"
            v-model="formData.pid">
            </a-tree-select>
          </a-form-item>
          <a-form-item field="remark" label="备注" validate-trigger="input" style="margin-bottom:15px;">
            <a-textarea v-model="formData.remark" placeholder="请填写备注" allow-clear/>
          </a-form-item>
           <a-form-item field="data_access" label="数据权限" style="margin-bottom:5px;">
            <a-radio-group v-model="formData.data_access" :options="OYoptions" />
           </a-form-item>
           <a-form-item field="menu" label="菜单分配" style="margin-bottom:5px;">
            <div class="rule_data">
              <div class="haeder">
                  <a-checkbox v-if="!isRules" v-model="IsChecked" @change="toggleChecked" style="margin-right: 15px;"> {{ IsChecked ? '取消' : '全选' }}</a-checkbox>
                  <a-checkbox v-model="onExpanded" @change="toggleExpanded">{{ onExpanded? '收起' : '展开'  }}</a-checkbox>
              </div>
              <div class="treebox">
                <a-tree
                    :show-line="true"
                    :checkable="!isRules"
                    v-model:checked-keys="formData.menu"
                    :fieldNames="{
                      key: 'id',
                      title: 'title',
                      children: 'children',
                    }"
                    ref="ruleTreeRef"
                    @check="onCheck"
                    :data="menutreeData"
                  />
              </div>
            </div>
           </a-form-item>
        </a-form>
      </div>
    </a-drawer>
</template>
<script lang="ts">
  import { defineComponent, ref,nextTick, computed, unref} from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import useLoading from '@/hooks/loading';
  import { cloneDeep } from 'lodash-es';
  //api
  import { getParent,getMenuList, save,RuleItem } from '@/api/system/role';
  import { Icon} from '@/components/Icon';
  import { Message } from '@arco-design/web-vue';
  import { TreeItem } from './data';


  export default defineComponent({
    name: 'AddDrawer',
    components: { Icon },
    emits: ['success'],
    setup(_, { emit }) {
      const showDrawer = ref(false);
      const isUpdate = ref(false);
      const parntList = ref<RuleItem[]>([]);
      
      //表单
      const formRef = ref<FormInstance>();
      //表单字段
      const basedata={
            id:0,
            pid:0,
            name: '',
            remark: "",
            menu: [],//选择的id，用于编辑赋值
            rules: [],//规则ID 所拥有的权限包扣父级
            weigh: 1,
            data_access: 0,
        }
      const formData = ref(basedata)
      //菜单权限
      const isRules=ref(false)
      const IsChecked=ref(false)
      const onExpanded=ref(false)
      const ruleTreeRef = ref();
      const menutreeData = ref<TreeItem[]>([]);
      //打开弹框
      const openDrawer=async(item:any)=>{
        isUpdate.value = !!item?.isUpdate;
        showDrawer.value = true;
        formRef.value?.resetFields()
          const resultdata = await getParent();
          if(resultdata&&resultdata.length>0){
            parntList.value=resultdata
            if (!unref(isUpdate)) {
              formData.value.pid=resultdata[0].id
            }else{
              if(item.record.pid==0){
                const parntList_df : any=[{id: 0,name: "一级角色",pid: 0,locale:""}];
                parntList.value=parntList_df.concat(resultdata)
              }
            }
          }else{
            parntList.value=[]
          }
          if (unref(isUpdate)) {
            formData.value=cloneDeep(item.record)
            const menuarr=cloneDeep(item.record.menu)
            if(item.record.rules=="*"){
              isRules.value=true
            }else{
              isRules.value=false
            }
            if(menuarr=="*"){
              formData.value.menu=[]
              nextTick(()=>{
                setTimeout(()=>{
                  if(ruleTreeRef.value)
                  ruleTreeRef.value.checkAll(true)
                },800)
              })
            }else if(formData.value.menu&&menuarr!="*"){
              formData.value.menu=JSON.parse(menuarr)
            }
          }else{
            formData.value.menu=[]
          }
          //获取菜单
          const id = unref(isUpdate)?item.record.id:0;
          const pid = unref(isUpdate)?item.record.pid:0;
          menutreeData.value = (await getMenuList({id:id,pid:pid})) as any as TreeItem[];
          nextTick(()=>{
            onExpanded.value=true
            ruleTreeRef.value.expandAll(onExpanded.value)
          })
      }
      const getTitle = computed(() => (!unref(isUpdate) ? '新增角色菜单' : '编辑角色菜单'));
     //点击确认
     const { loading, setLoading } = useLoading();
     const handleSubmit = async () => {
      try {
          const res = await formRef.value?.validate();
          if (!res) {
            setLoading(true);
            Message.loading({content:"提交数据中",id:"upStatus"})
            await save(unref(formData));
            Message.success({content:"数据提交成功",id:"upStatus"})
            emit('success');
            showDrawer.value = false;
            setLoading(false);
          }
        } catch (error) {
          setLoading(false);
          Message.clear("top")
        }
      };
      const handleCancel = () => {
        showDrawer.value = false;
      }
      //权限菜单
     //全选
     const toggleChecked=(value:any) =>{
       ruleTreeRef.value.checkAll(value)
      }
      //展开
      const toggleExpanded=(value:any) =>{
          ruleTreeRef.value.expandAll(value)
      }
      //选中
      const onCheck=(newCheckedKeys:any, event:any)=>{
        formData.value.menu=newCheckedKeys
      }
      return { 
        showDrawer,handleCancel,openDrawer,
        getTitle, 
        handleSubmit,
        formRef,
        loading,
        formData,
        parntList,
        OYoptions:[
          { label: '自己', value: 0 },
          { label: '自己及子权限', value: 1 },
          { label: '全部', value: 2 },
        ],
        menutreeData,
        onCheck,
        toggleChecked,
        toggleExpanded,
        ruleTreeRef,onExpanded,
        IsChecked,
        isRules,//是否是超级权限
      };
    },
  });
</script>
<style lang="less" scoped>
.drawer-box{
  .rule_data{
    width: 100%;
    .haeder{
      border-bottom:var(--color-neutral-4) solid 1px;
    }
  }
}
</style>
