/**
 * Created by daewood on 2017/5/8.
 * 创建数据库连接
 * 该模块只会被加载一次
 */

module.exports = {

    // debug 为 true 时，用于本地调试
    debug: false,
    imgZip : true, // 上传图片是否压缩(如果为false则本地不需要安装gm)
    session_secret: 'D8xGQ5i7F6Rr8VupJf154zoxoJ5L', // 务必修改
    auth_cookie_name: 'taxmallcms',
    encrypt_key : 'dora',
//    数据库配置
    URL: 'mongodb://127.0.0.1:27017/inchain',
    DB: 'inchain',
    HOST: process.env.MONGODB_HOST || '',
    PORT: process.env.MONGODB_PORT || 27017,
    USERNAME: process.env.MONGODB_USER || '',
    PASSWORD: process.env.MONGODB_PWD || '',

// inchain rpc server
    rpc_user: 'user',
    rpc_port: 8632,
    rpc_password: 'neSrQqSJjraBYWWIlraF',
    rpc_host: 'localhost',

//    站点基础信息配置
    SITETITLE : '印链浏览器', // 站点名称
    SITEDOMAIN : 'http://ins.vpool.cn', // 站点域名
    SITEICP : '渝ICP备14004001号-1', // 站点备案号
    SITEVERSION : 'v0.0.1', // 静态资源版本戳
    SYSTEMMAIL : 'daewood@qq.com', // 管理员个人邮箱
    UPDATEFOLDER : process.cwd()+'/public/upload', // 默认上传文件夹本地路径
    TEMPSTATICFOLDER : process.cwd()+'/public/themes/', // 模板静态文件路径
    DATAOPERATION : process.cwd()+'/models/db/bat', //数据库操作脚本目录
    //DATABACKFORDER : 'F:/data/mongodata/', // windows下服务端数据备份目录
    DATABACKFORDER : '/opt/mongodb/mongodata/', // linux服务端数据备份目录
    MONGODBEVNPATH : '/opt/mongodb/bin/', // LINUXmongodb环境变量(win server下不用管)
    //MONGODBEVNPATH : '', // windows下配置
    //SYSTEMTEMPFORDER : process.cwd()+'/views/web/temp/', // 系统模板安装目录
    SYSTEMTEMPFORDER : process.cwd()+'/public/upload/', // 系统模板安装目录
    DORACMSAPI : 'http://api.html-js.cn', // 系统服务提供商
    CMSDISCRIPTION : '印链浏览器,印链区块浏览器,INS浏览器,印股浏览器。',
    SITEKEYWORDS : '印链浏览器，印链区块浏览器,INS浏览器,印股浏览器，印链，印股',
    SITEBASICKEYWORDS : '印链浏览器，印链区块浏览器,INS浏览器,印股浏览器', // 基础关键词

//    本地缓存设置
    redis_host: process.env.REDIS_HOST || '127.0.0.1',
    redis_port: process.env.REDIS_PORT || 6379,
    redis_psd : '',
    redis_db: 0,

//    邮件相关设置
    site_email : 'taxmall@163.com',
    site_email_psd : 'taxmall2016',
    email_findPsd : 'findPsd',
    email_reg_active : 'reg_active',
    email_notice_contentMsg : 'notice_contentMsg',
    email_notice_contentBug : 'notice_contentBug',
    email_notice_user_contentMsg : 'notice_user_contentMsg',
    email_notice_user_reg : 'notice_user_reg',
    email_notice_user_verify : 'notice_user_verify',


//    信息提示相关
    system_illegal_param : '非法参数',
    system_noPower : '对不起，您无权执行该操作！',
    system_atLeast_one : '请选择至少一项后再执行删除操作！',
    system_batch_delete_not_allowed : '对不起，该模块不允许批量删除！',

};



