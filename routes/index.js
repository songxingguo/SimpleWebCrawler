const router = require('koa-router')()
var http = require('http');
var cheerio = require('cheerio');

/* GET home page. */
router.get('/', async (ctx, next) => {
    await ctx.render('index', {
        title: '简单nodejs爬虫'
    })
});

router.get('/getJobs', async (req, res, next) => {
    var infos = [];
    var url = 'http://tz.cqut.edu.cn/bmtz.htm';
    http.get(url+page,function(res){  //通过get方法获取对应地址中的页面信息
        var chunks = [];
        var size = 0;
        res.on('data',function(chunk){   //监听事件 传输
            chunks.push(chunk);
            size += chunk.length;
        });
        res.on('end',function(){  //数据传输完
            var data = Buffer.concat(chunks,size);
            var html = data.toString();
            //    console.log(html);
            var $ = cheerio.load(html); //cheerio模块开始处理 DOM处理
            $("#tzlb>li").each(function(){   //对页面岗位栏信息进行处理  每个岗位对应一个 li  ,各标识符到页面进行分析得出
                var info = {};
                info.title = $(this).find(".record .title .head").text(); //通知名称
                console.log(info.title);  //控制台输出岗位名
                infos.push(info);
            });
        });
    });

    ctx.response.body = infos;
});

router.get('/json', async (ctx, next) => {
    //url 获取信息的页面部分地址
    var url = 'http://tz.cqut.edu.cn/bmtz.htm';
    var infos = [];

    const promise = function(url){
        return new Promise((resovle,reject)=>{
            http.get(url,function(res){  //通过get方法获取对应地址中的页面信息
                var chunks = [];
                var size = 0;
                res.on('data',function(chunk){   //监听事件 传输

                });
                res.on('end',function(){  //数据传输完
                    resovle(chunks)
                });
            });
        })
    };

    await promise(url).then(function (chunks) {
        var data = Buffer.concat(chunks,size);
        var html = data.toString();
        //    console.log(html);
        var $ = cheerio.load(html); //cheerio模块开始处理 DOM处理
        $("#tzlb>li").each(function(){   //对页面岗位栏信息进行处理  每个岗位对应一个 li  ,各标识符到页面进行分析得出
            var info = {};
            info.title = $(this).find(".record .title .head").text(); //通知名称
            console.log(info.title);  //控制台输出岗位名
            infos.push(info);
        });
    }).then(function () {
        chunks.push(chunk);
        size += chunk.length;
    });

    ctx.response.type = 'text/plain';
    ctx.response.body = infos;
})

module.exports = router;
