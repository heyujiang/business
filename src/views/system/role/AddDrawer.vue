<template>
  <a-drawer :width="420" :visible="showDrawer" @ok="handleSubmit" @cancel="handleCancel" unmountOnClose>
      <template #title>{{getTitle}}</template>
      <div class="drawer-box">
        <a-form ref="formRef" :model="formData" auto-label-width>
          <a-form-item field="title" label="角色名称" validate-trigger="input" :rules="[{required:true,message:'请填写角色名称'}]" style="margin-bottom:15px;">
            <a-input v-model="formData.title" placeholder="请填写角色名称" allow-clear/>
          </a-form-item>
          <a-form-item label="上级角色" field="pid" style="margin-bottom:15px;" validate-trigger="change" :rules="[{
            validator: (value, cb) => {
              if (formData.id > 0 && formData.id == value) {
                cb('不可选择自己作为上级角色')
              } else {
                cb()
              }
            }
          }]">
            <a-tree-select placeholder="选择上级角色" :data="parentList"
            :fieldNames="{
                key: 'id',
                title: 'title',
                children: 'children'
              }"
            v-model="formData.pid"
            @change="parentRoleChange">
            </a-tree-select>
          </a-form-item>
          <a-form-item field="remark" label="备注" validate-trigger="input" style="margin-bottom:15px;">
            <a-textarea v-model="formData.remark" placeholder="请填写备注" allow-clear/>
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
                    v-model:checked-keys="formData.ruleIds"
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
  import { getParent,getMenuList, save,RuleItem,update } from '@/api/system/role';
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
      const parentList = ref<RuleItem[]>([]);
      
      //表单
      const formRef = ref<FormInstance>();
      //表单字段
      // const basedata={
      //       id:0,
      //       pid:1,
      //       name: '',
      //       remark: "",
      //       ruleIds:[],
      //       menu: [],//选择的id，用于编辑赋值
      //       rules: [],//规则ID 所拥有的权限包扣父级
      //       weigh: 1,
      //       data_access: 0,
      //   }

      type baseData = {
        id:number,
        pid?:number,
        name?:string,
        title?:string,
        remark?:string
        ruleIds:number[],
        menu?:number[],
        rules?:number[]
      }
      const formData = ref<baseData>({id:0,pid:1,ruleIds:[]})

      //菜单权限
      const isRules=ref(false)
      const IsChecked=ref(false)
      const onExpanded=ref(false)
      const ruleTreeRef = ref();
      const menutreeData = ref<TreeItem[]>([]);
      //打开弹框
      const openDrawer=async(item:any)=>{
        isUpdate.value = item?.isUpdate || false;
        showDrawer.value = true;
        formRef.value?.resetFields()
        parentList.value = await getParent();
        // if(resultdata&&resultdata.length>0){
        //   parentList.value=resultdata
        //   if (!unref(isUpdate)) {
        //     formData.value.pid=resultdata[0].id
        //   }else{
        //     if(item.record.pid==0){
        //       const parentList_df : any=[{id: 0,name: "一级角色",pid: 0,locale:""}];
        //       parentList.value=parentList_df.concat(resultdata)
        //     }
        //   }
        // }else{
        //   parentList.value=[]
        // }
        if (unref(isUpdate)) {
          isRules.value = item.record.id == 1;
          formData.value= cloneDeep(item.record)

          // const menuarr=cloneDeep(item.record.ruleIds)
          // if(item.record.rules=="*"){
          //   isRules.value=true
          // }else{
          //   isRules.value=false
          // }
          // if(menuarr=="*"){
          //   formData.value.menu=[]
          //   nextTick(()=>{
          //     setTimeout(()=>{
          //       if(ruleTreeRef.value)
          //       ruleTreeRef.value.checkAll(true)
          //     },800)
          //   })
          // }else if(formData.value.menu&&menuarr!="*"){
          //   formData.value.menu=JSON.parse(menuarr)
          // }
        } else{
          formData.value = <baseData>({id:0,pid:1,ruleIds:[]})
          // formData.value.menu=[]
          // formData.value.ruleIds=[]
        }
        //获取菜单
        const id = unref(isUpdate)?item.record.id:0;
        const pid = unref(isUpdate)?item.record.pid:1;
        menutreeData.value = (await getMenuList(pid)) as any as TreeItem[];
        await nextTick(() => {
          onExpanded.value = true
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
            if(unref(isUpdate)){
              await update(formData.value.id,unref(formData));
            }else{
              await save(unref(formData));
            }
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
        console.log(newCheckedKeys)
        formData.value.menu=newCheckedKeys
      }

      const parentRoleChange = async (value:number) => {
        menutreeData.value = (await getMenuList(value)) as any as TreeItem[];
        onExpanded.value=true
        ruleTreeRef.value.expandAll(onExpanded.value)
        // nextTick(()=>{
        //   onExpanded.value=true
        //   ruleTreeRef.value.expandAll(onExpanded.value)
        // })
      }

      return { 
        showDrawer,handleCancel,openDrawer,
        getTitle, 
        handleSubmit,
        formRef,
        loading,
        formData,
        parentList,
        menutreeData,
        onCheck,
        toggleChecked,
        toggleExpanded,
        ruleTreeRef,
        onExpanded,
        IsChecked,
        isRules,//是否是超级权限
        parentRoleChange,
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
