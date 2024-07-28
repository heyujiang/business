<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :loading="loading" :footer="false" helpMessage="接口分类" width="900px" :minHeight="600" :title="getTitle" @ok="handleSubmit">
    <a-row style="margin-bottom: 1px">
            <a-col :span="12">
            <a-space>
            </a-space>
          </a-col>
          <a-col
            :span="12"
            style="text-align: right;padding-bottom: 2px;"
          >
            <a-space>
              <a-button type="primary" @click="handleCreate">新增分组</a-button>
              <a-button type="primary" @click="handleType">接口类型配置(小程序)</a-button>
            </a-space>
          </a-col>
        </a-row>
      <a-table
        row-key="id"
        :loading="loading"
        :pagination="false"
        :columns="(groupcolumns as TableColumnData[])"
        :data="renderData"
        :bordered="{wrapper:true,cell:true}"
        size="large"
        :default-expand-all-rows="true"
        ref="artable"
      >
        <template #status="{ record }">
          {{ record.status==0?"正常":"未启用" }}
        </template>
        <template #operations="{ record }">
          <Icon icon="svgfont-bianji1" class="iconbtn" @click="handleEdit(record)" :size="18" color="#0960bd"></Icon>
          <a-divider direction="vertical" />
          <a-popconfirm content="您确定要删除吗?" @ok="handleDel(record)">
            <Icon icon="svgfont-icon7" class="iconbtn" :size="18" color="#ed6f6f"></Icon>
          </a-popconfirm>
        </template>
      </a-table>
      <!--添加数据-->
      <a-modal v-model:visible="GroupVisible" @cancel="GroupVisible=false" @ok="handleSubmit" :closable="false">
         <a-form ref="formRef" :model="formData" auto-label-width>
            <a-form-item field="name" label="分类名称" validate-trigger="input" :rules="[{required:true,message:'请填写分类名称'}]" style="margin-bottom:15px;">
              <a-input v-model="formData.name" placeholder="请填分类名称" />
            </a-form-item>
            <a-form-item field="pid" label="选择上级" style="margin-bottom:15px;">
                <a-tree-select placeholder="选择上级" :data="prantList" 
                :fieldNames="{
                    key: 'id',
                    title: 'name',
                    children: 'children'
                  }"  v-model="formData.pid">
                </a-tree-select>
            </a-form-item>
            <a-form-item field="type_id" label="接口类型" :rules="[{required:true,message:'请选择接口类型'}]" style="margin-bottom:15px;">
              <template #extra>
                使用接口端，如B端后台，小程序，微信公账号等
              </template>
              <a-select v-model="formData.type_id"  placeholder="请选择接口类型" >
                <a-option v-for="item of TypeList" :value="item['id']" :label="item['name']" />
              </a-select>
            </a-form-item>
          </a-form>
      </a-modal>
      <!--分类管理-->
      <a-modal v-model:visible="TypeVisible" @cancel="TypeVisible=false" @ok="handleSubmit" :closable="false" width="800px">
        <template #title>
          <div class="titlebox">
            <div class="left">类型管理</div>
            <div class="right">
              <a-button type="primary" @click="handleCreateType">新增</a-button>
            </div>
          </div>
        </template>
        <div class="talbe-modal">
          <a-table
                row-key="id"
                :pagination="false"
                :columns="(typecolumns as TableColumnData[])"
                :data="TypeList"
                :bordered="{wrapper:true,cell:true}"
                :default-expand-all-rows="true"
              >
                <template #isself="{ record }">
                  {{ record.isself==0?"否":"是" }}
                </template>
                <template #operations="{ record }">
                  <Icon icon="svgfont-bianji1" class="iconbtn" @click="handleTypeEdit(record)" :size="18" color="#0960bd"></Icon>
                  <a-divider direction="vertical" />
                  <a-popconfirm content="您确定要删除吗?" @ok="handleTypeDel(record)">
                    <Icon icon="svgfont-icon7" class="iconbtn" :size="18" color="#ed6f6f"></Icon>
                  </a-popconfirm>
                </template>
              </a-table>
        </div>
      </a-modal>
      <!--添加类型-->
      <a-modal v-model:visible="AddTypeVisible" @cancel="AddTypeVisible=false" @ok="handleTypeSubmit" :closable="false">
        <a-form ref="typeformRef" :model="typeForm" auto-label-width>
          <a-form-item field="name" label="类型名称" validate-trigger="input" :rules="[{required:true,message:'请填写类型名称'}]" style="margin-bottom:15px;">
            <a-input v-model="typeForm.name" placeholder="请填类型名称" />
          </a-form-item>
          <a-form-item field="isself" label="是否为本端接口" style="margin-bottom:15px;">
            <template #extra>
               在当前业务端使用的接口，就接口文档所在应用。
            </template>
            <a-radio-group v-model="typeForm.isself">
                <a-radio :value="0">否</a-radio>
                <a-radio :value="1">是</a-radio>
              </a-radio-group>
          </a-form-item>
          <template v-if="typeForm.isself==0" >
            <a-form-item field="rooturl" label="请求服务器" validate-trigger="input" :rules="[{required:true,message:'请填写请求服务器地址'}]" style="margin-bottom:15px;">
              <a-input v-model="typeForm.rooturl" placeholder="请填请求服务器地址" />
            </a-form-item>
            <a-form-item field="verifyEncrypt" label="请求验证字符串" validate-trigger="input" :rules="[{required:true,message:'请填写请求验证字符串'}]" style="margin-bottom:15px;">
              <a-input v-model="typeForm.verifyEncrypt" placeholder="请填请求验证字符串" />
            </a-form-item>
            <a-form-item  field="model_name" label="模块目录" extra="用于公共接口模块请求" validate-trigger="input" style="margin-bottom:15px;">
              <a-select v-model="typeForm.model_name" placeholder="请选择模块目录"  allow-search  allow-clear>
                    <a-option v-for="item in modellist" :value="item">{{ item }}</a-option>
                </a-select>
            </a-form-item>
            <a-form-item  field="user_tablename" label="授权用户数据表名" extra="用于测试的用户账号所在的表：business_wxsys_user" validate-trigger="input" style="margin-bottom:15px;">
              <a-select v-model="typeForm.user_tablename" placeholder="请填数据表名(选填)"  allow-search  allow-clear>
                  <template #label="{ data }">
                      <span>{{data?.value}}</span>
                    </template>
                    <a-option v-for="item in tablelist" :value="item.name">{{ item.name+" "+item.title }}</a-option>
                </a-select>
            </a-form-item>
            <a-form-item  field="user_tablename" label="获取测试用户" extra="获取要测试用户" validate-trigger="input" style="margin-bottom:15px;">
              <a-select v-model="typeForm.user_id" placeholder="请选择用户数据" @popup-visible-change="onSelectUserList" :loading="userloading"  @search="handleSearch" allow-search  allow-clear>
                    <a-option v-for="item in userlist" :value="item.id">{{ "ID:"+item.id+" - "+item.name }}</a-option>
                </a-select>
            </a-form-item>
            <a-form-item  field="login_url" label="登录请求接口" extra="用于测试登录请求接口地址，方法名统一为：get_apitoken" validate-trigger="input" style="margin-bottom:15px;">
              <a-select v-model="typeForm.login_url" placeholder="请填数据表名(选填)"  allow-search  allow-clear>
                  <template #label="{ data }">
                      <span>{{data?.value}}</span>
                    </template>
                    <a-option v-for="item in routerlist" :value="item">{{ item }}</a-option>
                </a-select>
            </a-form-item>
          </template>
        </a-form>
    </a-modal>
 </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref} from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import useLoading from '@/hooks/loading';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { cloneDeep } from 'lodash-es';
  //api
  import { getParent,getList, save,del} from '@/api/developer/devapigroup';
  import { getType, saveType,delType} from '@/api/developer/devapitype';
  import { getTables,TableItem,getRoutes,getModel,getTablelist,UserItem} from '@/api/developer/devapi';
  import { IconPicker ,Icon} from '@/components/Icon';
  import { Message } from '@arco-design/web-vue';
  import { groupcolumns,typecolumns} from './data';
  export default defineComponent({
    name: 'groupForm',
    components: { BasicModal,IconPicker,Icon },
    emits: ['success'],
    setup(_, { emit }) {
      const isUpdate = ref(false);
      const GroupVisible = ref(false);
      const prantList = ref([]);
      //表单
      const formRef = ref<FormInstance>();
      const typeformRef = ref<FormInstance>();
      //接口
      const tablelist = ref<TableItem[]>([]);
      const routerlist = ref<string[]>([]);
      const modellist = ref<string[]>([]);
      const userlist = ref<UserItem[]>([]);
      //表单字段
      const basedata={
            id:0,
            pid:0,
            type: 'biz',
            name: '',
            type_id: 0,
        }
      const formData = ref(basedata)
      const renderData = ref([]);
      const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
          formRef.value?.resetFields()
          isUpdate.value = !!data?.isUpdate;
          setModalProps({ confirmLoading: false });
          //获取列表数据
          renderData.value = await getList({});
          const deptdata = await getParent();
          const parntList_df : any=[{id: 0,name: "一级分类",pid: 0}];
          if(deptdata){
            prantList.value=parntList_df.concat(deptdata)
          }else{
            prantList.value=parntList_df
          }
          //获取数据库信息
          tablelist.value = await getTables({});
          routerlist.value= await getRoutes({});
          modellist.value= await getModel({});
      });
      const getTitle = computed(() => (!unref(isUpdate) ? '管理分类' : '管理分类'));
     //点击确认
     const { loading, setLoading } = useLoading();
     const handleSubmit = async () => {
      try {
          const res = await formRef.value?.validate();
          if (!res) {
            setLoading(true);
            Message.loading({content:"提交中",id:"upStatus"})
            await save(unref(formData));
            Message.success({content:"提交成功",id:"upStatus"})
            setLoading(false);
          }
        } catch (error) {
          setLoading(false);
          Message.clear("top")
        }
      };
      //新增
      const handleCreate=async()=>{
        GroupVisible.value=true
        formRef.value?.resetFields()
        if(!TypeList.value||TypeList.value.length==0){
          TypeList.value = await getType({});
        }
        if(TypeList.value&&TypeList.value.length>0){
          formData.value.type_id=TypeList.value[0]["id"]
        }
        formData.value=cloneDeep(basedata)
      }
      //编辑数据
      const handleEdit=async(record:any)=>{
        if(!TypeList.value||TypeList.value.length==0){
          TypeList.value = await getType({});
        }
        GroupVisible.value=true
        formData.value=cloneDeep(record)
      }
      //删除数据
      const handleDel=async(record:any)=>{
        try {
           Message.loading({content:"删除中",id:"upStatus"})
          const res= await del({ids:[record.id]});
          if(res){
            Message.success({content:"删除成功",id:"upStatus"})
          }
        }catch (error) {
          Message.clear("top")
        } 
      }
      //类型管理
      const TypeVisible=ref(false)
      const AddTypeVisible=ref(false)
        //表单字段
      const basetype={
          id:0,
          name: '',
          rooturl: '',
          model_name: '',
          verifyEncrypt: '',
          isself: 0,
          user_tablename: '',
          user_id: "",
          login_url: ""
      }
      const typeForm = ref(basetype)
      const TypeList = ref([]);//类型数据列表
      const handleType=()=>{
        TypeVisible.value=true
        //获取
        getTypelist()
      }
      const getTypelist=async()=>{
          //获取列表数据
          TypeList.value = await getType({});
      }
      //新增
      const handleCreateType=()=>{
        AddTypeVisible.value=true
        typeformRef.value?.resetFields()
        typeForm.value=cloneDeep(basetype)
      }
      const handleTypeEdit=(record:any)=>{
        AddTypeVisible.value=true
        typeForm.value=cloneDeep(record)
      }
      //提交类型
      const handleTypeSubmit=async()=>{
        try {
          const res = await typeformRef.value?.validate();
          if (!res) {
            Message.loading({content:"提交中",id:"upStatus"})
            await saveType(unref(typeForm));
            Message.success({content:"提交成功",id:"upStatus"})
            getTypelist()
          }
        } catch (error) {
          Message.clear("top")
        }
      }
      //删除数据
      const handleTypeDel=async(record:any)=>{
        try {
           Message.loading({content:"删除中",id:"upStatus"})
          const res= await delType({ids:[record.id]});
          if(res){
            getTypelist()
            Message.success({content:"删除成功",id:"upStatus"})
          }
        }catch (error) {
          Message.clear("top")
        } 
      }
      //获取用户数据
      const onSelectUserList=(val:boolean)=>{
        if(!typeForm.value.user_tablename){
          Message.warning("请先选择用户数据库")
        }else{
          if(val){
             getUserList("")
           }
        }
      }
      //查询
      const handleSearch = (value:string) => {
         getUserList(value)
      };
      const userloading=ref(false);
      const getUserList=async(seachword:string)=>{
        userloading.value=true
        userlist.value= await getTablelist({tablename:typeForm.value.user_tablename,seachword:seachword});
        userloading.value=false
      }
      return { 
        registerModal, 
        getTitle, 
        handleSubmit,
        formRef,
        loading,
        formData,
        prantList,
        renderData,groupcolumns,
        handleCreate,handleEdit,handleDel,
        GroupVisible,
        handleType,TypeVisible,typecolumns,AddTypeVisible,typeForm,typeformRef,TypeList,
        handleCreateType,handleTypeEdit,handleTypeSubmit,handleTypeDel,
        tablelist,routerlist,modellist,userlist,onSelectUserList,handleSearch,userloading,
      };
    },
  });
</script>
<style lang="less" scoped>
.talbe-modal{
  height: 320px;
  overflow: auto;
}
.titlebox{
  display: flex;
  width: 100%;
  .left{
    flex: 1;
  }
  .right{
    flex: 1;
    text-align: right;
  }
}
</style>