### 开发流程

##### 打包sass和es6
```bash
gulp [filename]
```

##### 开发实时打包
```bash
python -m SimpleHTTPServer
gulp watch-[filename]
```
`note:`
  - 支持es6语法，入口需要写在项目js目录下entry中，生成对应编译文件位dist/js/*.bundle.js

##### 统计脚本
```html
<script type="text/javascript">var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");document.write(unescape("%3Cspan id='cnzz_stat_icon_1264400656'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s13.cnzz.com/z_stat.php%3Fid%3D1264400656%26show%3Dpic' type='text/javascript'%3E%3C/script%3E"));</script>
```
