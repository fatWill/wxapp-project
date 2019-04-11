# wxapp-project
wxapp-project是一个简单的小程序工程化工具。

---

>目前已经支持:

> ✔︎ less转化为wxss

---

> 准备更新支持:
> 
> ➟ 快速创建小程序模版文件
>
> ➟ 自动压缩项目内png、jpg、jpeg文件
> 
> ...



# 安装&使用
```
npm i -g wxapp-project
```

- 尝试在小程序根目录跑通`wxp run`

- 查看更多帮助信息请使用`wxp -h`


# 详细使用说明

- ### `wxp init`

	将会在当前目前下创建.wxp.json配置文件
	
	```
	{
	    "less2wxss": true,
	    "minifyImages": false,
	    "ignore": [
	        {
	            "value": "benxian",
	            "type": "folder"
	        }
	    ]
	}
	```
	
	- `less2wxss` 配置是否开启less转化成wxss的功能 默认为`true`
	- `minifyImages ` 配置是否开启压缩图片的功能 默认为`false`
	- `ignore ` 忽略监听文件
	   - `type` 类型，如`folder` `file` `glob`等
	   - `value` 路径或取值，如`node_modules`
	
	其中`ignore`详细的使用方式和微信小程序`project.config.json`中的`ignore`忽略方法如出一辙，[点击此处查看](https://developers.weixin.qq.com/miniprogram/dev/devtools/projectconfig.html?search-key=ignore)。（__注意__，less的忽略只是不打包成wxss。如a.less import b.less，b.less文件被忽略，那么b.less的保存还是会监听到并且会追溯到a的更新打包，只是b.less不打包成wxss）。
	

- ### `wxp run`
	
	wxapp-project的核心，以小程序目录为根目录，运行`wxp run`命令，将会以项目运行目录为根目录进行监听编译。

- ### `wxp new`
	快速创建小程序工程（待更新）
	过后我也会放几个样例模版供大家开发。


# bug&tip
* 欢迎在issue中提出



