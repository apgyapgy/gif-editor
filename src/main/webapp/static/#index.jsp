<%@page contentType="text/html;charset=UTF-8" language="java" %>
<html>
  <head>
      <title>Gif Editor</title>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="/static/vendor/normalize.css/normalize.css"/>
      <link rel="stylesheet" href="/static/vendor/csshake/dist/csshake-horizontal.min.css"/>
      <link rel="stylesheet" href="/static/css/main.css"/>
      <script>
		// 友盟
		// ydlx
		// 2016-10-13
		var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");
		document.write(unescape("%3Cspan  style='display:none' id='cnzz_stat_icon_1260067336'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s11.cnzz.com/z_stat.php%3Fid%3D1260067336' type='text/javascript'%3E%3C/script%3E"));
		
		// 百度统计
		// ydlx
		// 2016-9-28
		var _hmt = _hmt || [];
		(function() {
	  		var hm = document.createElement("script");
	  		hm.src = "//hm.baidu.com/hm.js?37c68c083c2c85fe183a5e0224eb35a9";
	  		var s = document.getElementsByTagName("script")[0]; 
	  		s.parentNode.insertBefore(hm, s);
		})();
		//声明_czc对象:
		var _czc = _czc || [];
		//绑定siteid，请用您的siteid替换下方"XXXXXXXX"部分
		_czc.push(["_setAccount", "1260067336"]);
		 
		// growing io
		// ydlx
		// 2016-8-9
	    var _vds = _vds || [];
	    window._vds = _vds;
	      (function(){
	        _vds.push(['setAccountId', 'beb66a1ac816845f']);
	        (function() {
	          var vds = document.createElement('script');
	          vds.type='text/javascript';
	          vds.async = true;
	          vds.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'dn-growing.qbox.me/vds.js';
	          var s = document.getElementsByTagName('script')[0];
	          s.parentNode.insertBefore(vds, s);
	      })();
	    })();
	</script>
  </head>
  <body>
  <canvas style="position:fixed;left:0;top:0;"></canvas>
  <div id='main'></div>
  <!--<canvas style="position:fixed;left:0;top:0;width:100%;"></canvas>-->

  <script src="/static/vendor/react/dist/react.min.js"></script>
  <script src="/static/vendor/react-dom/dist/react-dom.min.js"></script>
  <script src="/static/index.js"></script>
  <script src="/static/jquery-1.10.2.min.js"></script>
  <script src="/static/background.js"></script>
  <script src="/static/count-Editor.js"></script>
  <iframe id="iframe" src="http://www.soogif.com/html/tool/editor.html#2250" width="0" height="0" frameborder></iframe>
  </body>
</html>
