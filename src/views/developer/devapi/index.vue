<template>
  <div class="container" >
      <Breadcrumb :items="['developer.title', 'developer.apidoc.title']" />
      <a-card class="general-card onelineCard" ref="onelineCardRef" style="height: calc(100% - 50px);">
         <div class="devapi">
           <div class="left">
            <a-row style="margin-bottom: 10px">
              <a-col :span="12">
              <a-space>
                <a-tree-select placeholder="选择分组" :data="groupList" :style="{width:'120px'}" 
                :fieldNames="{
                    key: 'id',
                    title: 'name',
                    children: 'children'
                  }"  v-model="searchData.cid">
                </a-tree-select>
                <a-input :style="{width:'180px'}" v-model="searchData.title" placeholder="输入接口名称" @press-enter="handleData" allow-clear />
                <a-input :style="{width:'180px'}" v-model="searchData.url" placeholder="输入请求地址" @press-enter="handleData" allow-clear />
                <a-button type="primary" @click="handleData">查找</a-button>
              </a-space>
            </a-col>
            <a-col
              :span="12"
              style="text-align: right;"
            >
            <a-space>
              <a-button type="primary" @click="createRule" >
                {{ $t('developer.apidoc.createapi') }}
              </a-button>
              <a-button type="primary" @click="handleGroup">
                {{ $t('developer.apidoc.mgroun') }}
              </a-button>
            </a-space>
            </a-col>
          </a-row>
          <div class="tablebox" :style="{width:cardboxWidth-410+'px'}">
            <a-table
                row-key="id"
                :loading="loading"
                :pagination="pagination"
                :columns="(columns as TableColumnData[])"
                :data="renderData"
                :bordered="{wrapper:true,cell:true}"
                size="large"
                :scroll="{x:1000}"
                :default-expand-all-rows="true"
                ref="artable"
                :selected-keys="selectedKeys"
                @page-change="handlePaageChange" 
                @page-size-change="handlePaageSizeChange" 
                @row-click="handleRowClick"
              >
                <template #createtime="{ record }">
                  {{dayjs(record.createtime*1000).format("YYYY-MM-DD")}}
                </template>
                <template #status="{ record }">
                  {{ record.status==0?"正常":"未启用" }}
                </template>
                <template #istoken="{ record }">
                  <span :style="{color: record.istoken==0?'gray':'orangered'}">{{ record.istoken==0?"不需":"需要" }}</span>
                </template>
                <template #operations="{ record }">
                  <Icon icon="svgfont-bianji1" class="iconbtn" @click="handleEdit(record)" :size="18" color="#0960bd"></Icon>
                  <a-divider direction="vertical" />
                  <a-popconfirm content="您确定要删除吗?" @ok="handleDel(record)">
                    <Icon icon="svgfont-icon7" class="iconbtn" :size="18" color="#ed6f6f"></Icon>
                  </a-popconfirm>
                </template>
              </a-table>
            </div>
           <div class="tigbox">
              <div class="title">请求说明：</div>
              <div class="item">
                <div class="label">1.小程序、app请求头添加“Businessid”值：</div>
                <div class="text">{{ userInfo.$state.businessID }}</div>
              </div>
              <div class="item">
                <div class="label">2.请求需要Token时，请在请求头加“Authorization”值是Token</div>
                <div class="text"></div>
              </div>
              <div class="item">
                <div class="label">3.接口请求验证，请求头添加 verify-time(时间戳)和verify-encrypt=md5(时间戳+接口验证字符串),接口验证字符串在<span style="color: #165dff;">管理分组->接口配置</span>中</div>
                <div class="text"></div>
              </div>
              <div class="item">
                <div class="label">4.接口自动生成时，如果新增模块（例如admin）请手动把模块路由添加到route\router.go下,同样也需手动删除，这种情况比较少系统不再自动添加。<a href="https://doc.goflys.cn/docview?id=25&fid=274" target="_blank" style="color: #165dff;">去开发文档查看更多</a></div>
                <div class="text"></div>
              </div>
            </div>
          </div>
           <div class="right">
                <div class="items-center">
                    <span class="text-label">接口名称: </span>
                    <span class="text-title">{{requestData.title}}</span>
                </div>
                <a-divider dashed style="margin:10px 0px"/>
                <div class="handlebox">
                   <div class="url">请求地址：<a @click="copyText(requestData.url)">{{requestData.url}} <icon-copy /></a></div>
                </div>
                <div class="parambox">
                    <CodeEditor v-model:value="requestData.param"  :mode="modeValue" />
                </div>
                <div class="doEvant">
                  <a-space>
                    <a-select :style="{width:'95px'}" v-model="requestData.method" placeholder="选择请求方式" >
                          <a-option value="get">get</a-option>
                          <a-option value="post">post</a-option>
                          <a-option value="delete">delete</a-option>
                        </a-select>
                      <a-button type="primary" @click="handleQuest">立即请求</a-button>
                      <ButtonGroup status="warning">
                        <a-popover position="tr" title="接口说明" trigger="click">
                          <a-button >查看说明</a-button>
                          <template #title>
                            <div class="popovertitle">
                              接口说明
                            </div>
                            <a-divider dashed style="margin:5px 0px"/>
                          </template>
                          <template #content>
                             <div class="showapides" >
                                <div class="text" v-html="requestData.des"></div>
                             </div>
                          </template>
                        </a-popover>
                        <a-button  @click="showField(requestData.tablename)">查看字段</a-button>
                      </ButtonGroup>
                    </a-space>
                </div>
                <div class="requtback">
                    <div class="text-label">请求结果 </div>
                    <a-divider dashed style="margin:10px 0px"/>
                    <div class="field_item">
                      <div class="label">请求状态：</div>
                      <div class="text">
                        {{ requestAfter.laoding }}
                       </div>
                    </div>
                    <div class="field_item">
                      <div class="label">请求结果：</div>
                      <div class="text">
                        <span class=" mr-4" :style="{color:requestAfter.status==200?'#108ee9':'#f50'}"> {{requestAfter.status}} </span>
                        <span class=" mr-4" :style="{color:requestAfter.status==200?'#108ee9':'#f50'}">提示({{requestAfter.code}})：{{requestAfter.message}} </span>
                       </div>
                    </div>
                    <div class="respdata">
                      <CodeEditor v-model:value="requestAfter.result" readonly :mode="modeValue" />
                  </div>
                </div>
           </div>
         </div>
      </a-card>
      <!--表单-->
      <AddForm @register="registerModal"  @success="handleData"/>
      <GroupForm @register="registerGroupModal"  @success="handleData"/>
      <FieldModal @register="registerFieldModal" />
  </div>
  </template>
  <script lang="ts">
   import { defineComponent, reactive ,ref,nextTick,onMounted,computed} from 'vue';
   import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
   import dayjs from 'dayjs';
   import useLoading from '@/hooks/loading';
   import { Message,Button } from '@arco-design/web-vue';
   import {Icon} from '@/components/Icon';
   import { cloneDeep } from 'lodash-es';
   //复制
   import { useClipboard } from '@vueuse/core';
    //数据
    import { columns} from './data';
    //api
    import { getList,del,getGroup,getDBField,getToken} from '@/api/developer/devapi';
    import { getTypeinfo } from '@/api/developer/devapitype';
    //table
    import { Pagination } from '@/types/global';
    import { useModal } from '/@/components/Modal';
    import AddForm from './AddForm.vue';
    import GroupForm from './GroupForm.vue';
    import FieldModal from './FieldModal.vue';
    import { CodeEditor, MODE } from '/@/components/CodeEditor';
    //请求
    import { defHttp } from '@/utils/http';
    import axios from 'axios';
    import md5 from 'md5'
    import { useUserStore } from '@/store';
    export default defineComponent({
      name:"devapi",
      components: {
        AddForm,Icon,GroupForm, CodeEditor,FieldModal,
        ButtonGroup:Button.Group
      },
      setup() {
        const userInfo = useUserStore();
        //JSON编辑器
        const selectedKeys=ref<number []>([])
        const modeValue = ref<MODE>(MODE.JSON);
        const { copy } = useClipboard();
        const [registerModal, { openModal }] = useModal();
        const [registerGroupModal, { openModal:openGroup }] = useModal();
        const [registerFieldModal, { openModal:openField }] = useModal();
        const searchData=ref({
          cid:0,
          title:"",
          url:"",
        })
        const groupList=ref([])
        //接口1
        const requestData_base={id:0,title:"请选择请求接口",url:"",method:"get",param:'{"title":"示例参数"}',des:"",tablename:"",useFrom:"pc"}
        const requestData=ref()
        requestData.value=cloneDeep(requestData_base)
        //接口2
        const requestAfter_base={step:"none",result:"",laoding:"waiting",status:200,message:"",code:0}
        const requestAfter=ref()
        requestAfter.value=cloneDeep(requestAfter_base)
        //分页
        const basePagination: Pagination = {
          current: 1,
          pageSize: 10,
        };
        const pagination = reactive({
          ...basePagination,
          showTotal:true,
          showPageSize:true,
        });
        const { loading, setLoading } = useLoading(true);
        const renderData = ref([]);
        const initGetGroup=async()=>{
          const deptdata = await getGroup();
          const parntList_df : any=[{id: 0,name: "全部分组",pid: 0}];
          if(deptdata){
            groupList.value=parntList_df.concat(deptdata)
          }else{
            groupList.value=parntList_df
          }
          nextTick(()=>{
            fetchData()
          })
        }
        //组件挂载完成后执行的函数
        const onelineCardRef = ref(null);
        const cardboxWidth= ref(1200)
        onMounted(()=>{
          initGetGroup()
          cardboxWidth.value= onelineCardRef.value ? onelineCardRef.value["$el"]["offsetWidth"]:1200
          window.onresize = () => {
            cardboxWidth.value= onelineCardRef.value ? onelineCardRef.value["$el"]["offsetWidth"]:1100
          }

        })
        const fetchData = async () => {
            setLoading(true);
            try {
              const data= await getList({page:pagination.current,pageSize:pagination.pageSize,...searchData.value});
              renderData.value = data.items;
              pagination.current = data.page;
              pagination.total = data.total;
            } catch (err) {
              // you can report use errorHandler or other
            } finally {
              setLoading(false);
            }
          };
          //分页
          const handlePaageChange = (page:any) => {
            pagination.current=page
            fetchData();
          }
          //分页总数
          const handlePaageSizeChange = (pageSize:any) => {
            pagination.pageSize=pageSize
            fetchData();
          }
        //添加菜单
        const createRule=()=>{
          openModal(true, {
            isUpdate: false,
            record:null
          });
        }
        //编辑数据
        const handleEdit=async(record:any)=>{
          openModal(true, {
            isUpdate: true,
            record:record
          });
        }
        //更新数据
        const handleData=async()=>{
          fetchData();
        }
        //删除数据
        const handleDel=async(record:any)=>{
          try {
              Message.loading({content:"删除中",id:"upStatus"})
            const res= await del({ids:[record.id]});
            if(res){
              fetchData();
              Message.success({content:"删除成功",id:"upStatus"})
            }
          }catch (error) {
            Message.clear("top")
          } 
        }
        //管理分组
        const handleGroup=()=>{
          openGroup(true, {
            isUpdate: false,
            record:null
          });
        }
        //点击行数据时触发
        const typeInfo=ref({name:"",rooturl:"",verifyEncrypt:"",isself:0})
        const handleRowClick=async(record:any)=>{
          handleSelect(record)
          selectedKeys.value=[record.id]
          //获取接口类型数据
          typeInfo.value=await getTypeinfo({id:record.type_id})
        }
         //选择使用
        const handleSelect=(record: Recordable)=>{
          requestAfter.value={step:"none",result:"",laoding:"waiting",status:200,message:"",code:0}
          let gerurl=cloneDeep(record.url)
          requestData.value.url=""
          if(record.apicode_type==2){
            gerurl=cloneDeep(`${gerurl}?apiID=${record.id}`)
          }
          requestData.value={id:record.id,title:record.title,url:gerurl,method:record.method,param:record.param,des:record.des,tablename:record.tablename,useFrom:record.useFrom,istoken:record.istoken}
        }
        //复制
        const copyText=async(text:string)=>{
          await copy(text);
          Message.success({content:"复制成功",id:"copysuccess"});
        }
        //立即请求
        const handleQuest=async()=>{
          if(!requestData.value.url){
            Message.warning('请选择测试接口！');
            return;
          }
          requestAfter.value.laoding="processing"
          if(typeInfo.value.isself==1){//本端接口
            const gerresult =await  reqhttp()
            if(gerresult){
              requestAfter.value.result=gerresult.data.data
              requestAfter.value.status=gerresult.status
              requestAfter.value.message=gerresult.data.message
              requestAfter.value.code=gerresult.data.code
              if(gerresult.data.code==0){
                requestAfter.value.laoding="success"
              }else{
                requestAfter.value.laoding="error"
              }
            }
          }else if(typeInfo.value.isself==0){//外部接口
            const gerresults =await otherHttp()
            if(gerresults){
              requestAfter.value.result=gerresults["data"].data
              requestAfter.value.status=gerresults["status"]
              requestAfter.value.message=gerresults["data"].message
              requestAfter.value.code=gerresults["data"].code
              if(gerresults["data"].code==0){
                requestAfter.value.laoding="success"
              }else{
                requestAfter.value.laoding="error"
              }
            }
          }else{
            Message.warning({content:`接口类型无法识别${requestData.value.useFrom}`,id:"wm"});
            requestAfter.value.laoding="waiting"
          }
        }
        //外部端接口
        async function otherHttp(){
          var params={}
          if(requestData.value.param){
            params=JSON.parse(requestData.value.param)
          }
         console.log("",typeInfo.value)
           //接口验证
          const timestamp: number = Date.parse(new Date().toString())/1000;
          let baseRootUrl = import.meta.env.VITE_APP_ENV=="production"? typeInfo.value.rooturl: window?.globalConfig.Root_wxurl_dev;//前缀
          //获取token
          let tokendata=""
         if(requestData.value.istoken==1){//需要token
          const resdata=await getToken({baseURL:baseRootUrl,url:typeInfo.value["login_url"],params:{user_id:typeInfo.value["user_id"]}})
          if(resdata.code==0){
            tokendata=resdata.data
          }
         }
          if(requestData.value.method=="get"){
              return axios.get(baseRootUrl+requestData.value.url, { params: params,headers: {'verify-time': timestamp.toString(),"verify-encrypt":md5(typeInfo.value.verifyEncrypt+timestamp),"Authorization":tokendata,"Businessid":userInfo.$state?.businessID+""} }).catch(err => {
                  requestAfter.value.laoding="error"
                  requestAfter.value.message=err.message
                  requestAfter.value.status=err.response.status
                  requestAfter.value.result=err.response.data.message
              });
            }else if(requestData.value.method=="post"){
              return axios.post(baseRootUrl+requestData.value.url, params,{headers: {'verify-time': timestamp.toString(),"verify-encrypt":md5(typeInfo.value.verifyEncrypt+timestamp),"Authorization":tokendata,"Businessid":userInfo.$state?.businessID+""}}).catch(err => {
                  requestAfter.value.laoding="error"
                  requestAfter.value.message=err.message
                  requestAfter.value.status=err.response.status
                  requestAfter.value.result=err.response.data.message
              });
            }else if(requestData.value.method=="delete"){
              return axios.delete(baseRootUrl+requestData.value.url,{ data: params,headers: {'verify-time': timestamp.toString(),"verify-encrypt":md5(typeInfo.value.verifyEncrypt+timestamp),"Authorization":tokendata,"Businessid":userInfo.$state?.businessID+""} }).catch(err => {
                  requestAfter.value.laoding="error"
                  requestAfter.value.message=err.message
                  requestAfter.value.status=err.response.status
                  requestAfter.value.result=err.response.data.message
              });;
            }else{
              return false
            }
        }
        //后台端接口
        function reqhttp(){
          var params={}
          if(requestData.value.param){
            params=JSON.parse(requestData.value.param)
          }
          var url_str=requestData.value.url.split("/")
          if(url_str[0]=="business"){
            requestData.value.url=requestData.value.url.split("business")[1]
          }else if(url_str.length>1&&url_str[1]=="business"){
            requestData.value.url=requestData.value.url.split("/business")[1]
          }
          console.log(requestData.value.url)
          if(requestData.value.method=="get"){
              return defHttp.get({ url: requestData.value.url, params:params}, { isReturnNativeResponse: true }).catch(err => {
                  requestAfter.value.laoding="error"
                  requestAfter.value.message=err.message
                  requestAfter.value.status=err.response.status
                  requestAfter.value.result=err.response.data.message
              });
            }else if(requestData.value.method=="post"){
              return defHttp.post({ url: requestData.value.url, params:params}, { isReturnNativeResponse: true}).catch(err => {
                  requestAfter.value.laoding="error"
                  requestAfter.value.message=err.message
                  requestAfter.value.status=err.response.status
                  requestAfter.value.result=err.response.data.message
              });;
            }else if(requestData.value.method=="delete"){
              return defHttp.delete({ url: requestData.value.url, params:params}, { isReturnNativeResponse: true}).catch(err => {
                  requestAfter.value.laoding="error"
                  requestAfter.value.message=err.message
                  requestAfter.value.status=err.response.status
                  requestAfter.value.result=err.response.data.message
              });;
            }else{
              return false
            }
        }
        //查看字段
        const showField=async(tablename:string)=>{
          if(!tablename){
            Message.error({content:"请选择查看的接口/接口不存在数据表",id:"upStatus"})
            return
          }
          try {
            Message.loading({content:"获取字段数据中",id:"upStatus"})
            const res= await getDBField({tablename:tablename});
            if(res){
              openField(true, {
                isUpdate: true,
                record:res
              });
              Message.success({content:"获取字段成功",id:"upStatus"})
            }
          }catch (error) {
            Message.clear("top")
          } 
        }
        return {
          columns,dayjs,
          loading,pagination,renderData,
          handlePaageChange,handlePaageSizeChange,
          createRule,handleEdit,handleDel,
          registerModal,handleData,
          registerFieldModal,
          searchData,groupList,
          registerGroupModal,handleGroup,
          //接口
          requestData,requestAfter,handleRowClick,
          copyText,handleQuest,
           //JSON编辑器
           modeValue,
           showField,
           userInfo,
           cardboxWidth, onelineCardRef,
           selectedKeys,
        }
      }
    });
  </script>
  <style lang="less" scoped>
    .container {
      padding: 0 20px 20px 20px;
      height: 100%;
    }
    .devapi{
      display: flex;
      width: 100%;
      .left{
        flex:1;
      }
      .right{
        width: 370px;
        padding-left: 10px;
        .items-center{
          align-items: center;
          .text-label{
            font-size: 1.125rem;
           line-height: 1.75rem;
          }
          .text-title{
  
          }
        }
        .handlebox{
            .url{
              a{
                color: rgb(var(--primary-6));
                cursor: pointer;
              }
            }
        }
        .parambox{
          border: #e5e7eb 1px solid;
          height: 90px;
          overflow: auto;
          margin-top: 5px;
        }
        .doEvant{
          padding-top: 5px;
        }
        //请求结果
        .requtback{
          padding-top: 10px;
          .text-label{
            font-size: 1.125rem;
           line-height: 1.75rem;
          }
          .field_item{
            display: flex;
            margin: 10px auto;
            .label{
              width: auto;
              font-weight: 600;
            }
            .text{
              flex: 1;
              text-align: left;
            }
          }
          .mr-4{
            margin-right: 1rem;
          }
          .respdata{
            border: #e5e7eb 1px solid;
            height: 420px;
            overflow: auto;
          }
        }
      }
    }
    .showapides{
      width: 450px;
      min-height: 220px;
      .text{
        width: 100%;
        white-space: pre-wrap;
        word-wrap: break-word;
      }
    }
    
  .tablebox{
    min-height: 496px;
      //分类标题背景色
      :deep(.arco-table-th){
        background-color: var(--color-neutral-3);
      }
      :deep(.arco-table-tr-checked .arco-table-td){
        color: rgb(var(--primary-6));
      }
  }
    //说明
  .tigbox{
    .title{
      font-size: 16px;
      font-weight: 600;
    }
    .item{
      display: flex;
      margin-top: 10px;
      .label{
        color: var(--color-neutral-10);
      }
      .text{
        flex:1;
        color: 	var(--color-neutral-6);
      }
    }
  }
  </style>