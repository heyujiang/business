// const domain="https://ent.goflys.cn";//您的域名//独立部署需要填写Go服务api接口域名(部署在Go目录下可以留空)
// const domain="http://127.0.0.1:1995";//您的域名//独立部署需要填写Go服务api接口域名(部署在Go目录下可以留空)
// const localhost="http://127.0.0.1:1995";//访问本地的域名和端口，如果您改变Go服务端口，请自行修改
const domain="http://121.43.52.190";//您的域名//独立部署需要填写Go服务api接口域名(部署在Go目录下可以留空)
const localhost="http://121.43.52.190";//访问本地的域名和端口，如果您改变Go服务端口，请自行修改
window.globalConfig = {
	Main_url:`${domain}`,//域名
	Root_url:`${domain}`,//Api服务器域名
	Upload_url:`${domain}`,//Api服务器域名
	Upload_url_dev:`${localhost}`,//Api服务器域名-开发环境
    Root_url_dev:`${localhost}`,//Api服务器域名-开发环境
    Root_wxurl_dev:`${localhost}`,//接口测试-微信小程序-开发环境
    Upinfile_url:`${domain}`,//业务专用上传附件
    Upinfile_url_dev:`${localhost}`,//业务专用上传附件-开发环境
	AppTitle:"京杭能源开发管理后台",
	// AppTitle:"-",
    AppVersion:"1.1.0",
    Company:"",
    Address:"中国·杭州",
    Team:"工程事业部提供支持",
    loginTitle:"登录京杭能源开发管理后台",
    // loginTitle:"登录",
    loginSubTitle:"",
    Copyright:"开发工程事业部",
    MaxSizeImage:5,//最大上传图片大小,单位M
	MaxSizeVideo:150,//最大上传视频大小,单位M
};
