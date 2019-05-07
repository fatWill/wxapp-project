![https://github.com/fatWill/wxapp-project](images/wxp.jpeg)


# wxapp-project
wxapp-project是一个小程序前端工程构建流的工具。


>增加了小程序的demo文件和程序的架构设计，在template/下，供大家一起学习交流。


---

>目前已经支持:
>
> ✔︎ less转化为wxss
> 
> ✔︎ 支持px转化rpx（不编译px请用大写PX表示）
> 
> ✔︎ 支持打包压缩，文件内联base64转换
> 
> ✔︎ 可以配置忽略文件、某些设置的开关等
> 
> ✔︎ 增加增量编译，已编译过的文件不会再次编译
> 
> ✔︎ 自动压缩项目内png、jpg、jpeg、svg、gif文件
> 
> ✔︎ 腾讯云快速上传储存桶支持(cos对象存储)
> 
> ✔︎ 快速创建小程序模版文件

---

> 更新预告:
> 
> ➟ 阿里云快速上传储存桶支持(oss对象存储)
> 
> ...


# 安装&使用
```
npm i -g wxapp-project
```

- 尝试在小程序根目录跑通`wxp run`

- 查看更多帮助信息请使用`wxp -h`


# 使用说明

* ### `wxp init`

	将会在当前目录下创建.wxp.json配置文件（*注：必须要在每个小程序下面的根目录创建此文件）
	
	```
	{
		'less2wxss': true,
		'minifyImage': true,
		'px2rpx': true,
		'rpxUnit': 1,
		'inlineUrl': true,
		'minifyWxss': false,
		'ignore': [{
			'type': 'folder',
			'value': 'node_modules',
		}],
		'os': ''
	}
	```
	
	- `less2wxss` 是否开启less转化成wxss的功能 默认为`true`
	- `minifyImages` 是否开启压缩图片的功能 默认为`true`
	- `px2rpx` 是否开启px转化成rpx 默认为`false`
	- `rpxUnit` `px`转化成`rpx`的倍数 默认为`1`
	- `inlineUrl` 是否将less中内联的文件转化成base64 默认为`false `
	- `minifyWxss` 是否开启转化打包后的wxss进行压缩 默认为`false`
	- `ignore` 忽略监听文件
	   - `type` 类型，如`folder` `file` `glob`等
	   - `value` 路径或取值，如`node_modules`
	- `template` 模版文件（用于快速创建小程序模版，详细用法如下）
      - `type` 类型，值为`page|component|project|js|wxml|less|json`
      - `path` 路径，如 `page/example`
	- `os` 对象存储的类型，可填写的值有`tx` 默认为`空`
	- `osfiles` 你选定需要对象存储的文件
		- `type` 类型，如`folder` `file` `glob`等
	   - `value` 路径或取值，如`node_modules`
	
	
	*如果`os`类型填的是`tx`，那么需要配置的必填项为
	- `secretId` `secretKey` `bucket` `region` 详见[腾讯云对象存储](https://cloud.tencent.com/document/product/436/8629#.E5.BF.AB.E9.80.9F.E5.85.A5.E9.97.A8)
	
	
	其中`ignore`与`osfiles`的详细的使用方式和微信小程序`project.config.json`中的`ignore`忽略方法如出一辙，[点击此处查看](https://developers.weixin.qq.com/miniprogram/dev/devtools/projectconfig.html?search-key=ignore)。（__注意__，less的忽略只是不打包成wxss。如a.less import b.less，b.less文件被忽略，那么b.less的保存还是会监听到并且会追溯到a的更新打包，只是b.less不打包成wxss），图片的监听忽略是不压缩
	
---
	

* ### `wxp run`
	
	wxapp-project的核心，以小程序目录为根目录，运行`wxp run`命令，将会以项目运行目录为根目录进行监听编译。

---

>有时候你需要能够快速创建某些自定义项目的文件(比如自定义快速创建wxml less js)
>
>比如你需要快速创建一个page文件，里面有自定义的通用方法和模版等，示例文件路径如下
>
> ```
> ├── page
>   ├── page.wxml                                     
>   ├── page.less                                       
>   ├── page.js                                  
>   ├── page.json
> ├── app.json
> ├──...     
> ```
>
>然后在.wxp.json中配置如下
>
> ```
> "template": {
>   "test": {                                    
>     "type": "page",                                      
>     "path": "page"    //基于项目目录的相对路径                              
>   }
> },
> ```
>
>那么你就可以通过命令行快速创建对应template name的文件
>
>命令行示例 `wxp create test -n filename` // 其中filename 为你创建的文件名， test为上面配置的key值
>
>详细介绍请看如下

* ### `wxp new <type>`

	快速创建`wxp项目`中的小程序工程，`type`值有`demo|page|component|project|js|wxml|less|json`
	- `-n --name` 参数必填 文件/文件夹名
	
	> 示例 `wxp new page -n filename`
	
	[点击此处](https://developers.weixin.qq.com/s/T7Hxu8m17q8W)可以查看`demo`的小程序模版代码片段
	
---
		
* ### `wxp create <key>`

	快速创建`自己配置项目`中的小程序工程，`key`值为你template配置中的key，workflow会找出相对应的的路径进行创建
	- `-n --name` 参数必填 文件/文件夹名
	
	> 示例 `wxp create test -n filename`
		
---

# bug&tip
* 欢迎在issue中提出
* 如果想要交流可以邮872016576@qq.com


