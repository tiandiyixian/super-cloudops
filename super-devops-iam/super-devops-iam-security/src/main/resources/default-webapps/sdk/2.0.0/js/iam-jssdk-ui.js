/**
 * IAM WebSDK UI v2.0.0 | (c) 2017 ~ 2050 wl4g Foundation, Inc.
 * Copyright 2017-2032 <wangsir@gmail.com, 983708408@qq.com>, Inc. x
 * Licensed under Apache2.0 (https://github.com/wl4g/super-devops/blob/master/LICENSE)
 */

!(function(window, document){
	// 创建UI
	window.IAM.UI = {
		/**
		 * Init IAM JSSDK UI.
		 * 
		 * @param renderId Render target object element id.
		 **/
		initUI: function(renderObj, iamServerBaseUri){
			if(!renderObj || renderObj == undefined){
				throw Error("IAM JSSDK UI (renderObj) is required!");
			}
			if(!iamServerBaseUri || iamServerBaseUri == undefined || iamServerBaseUri.trim().length<=0){
				console.warn("Init 'iamServerBaseUri' not configure, already used default!");
				iamServerBaseUri = null; // Init
			}

			console.debug("Initializing IAM JSSDK UI...");
			var loginForm = $('<div class="login-form"><div class="login-form-header"><span class="login-link active"id="login_link_account"data-panel="login_account_panel">账号登录</span><span class="login-line"></span><!--<span class="login-link"id="login_link_phone"data-panel="login_phone_panel">手机登录</span>--><span class="login-line"></span><span class="login-link"id="login_link_scan"data-panel="login_scan_panel">扫码登录</span></div><div class="login-form-tip"id="err_tip"></div><div class="login-form-body"><!--密码登录--><div class="login-form-panel active"id="login_account_panel"><form><div class="login-form-item"><i class="icon-user"></i><input class="inp"id="user_name"name="username"placeholder="请输入账号"maxlength="20"></div><div class="login-form-item"><i class="icon-pass"></i><input class="inp"id="password"name="password"type="password"placeholder="请输入密码"maxlength="35"autocapitalize="off"autocomplete="off"></div><div class="login-form-item"id="captcha_panel"><!--拖动验证--></div><input class="btn"id="iam_submit"type="button"value="登录"></form></div><!--手机登录--><div class="login-form-panel"id="login_phone_panel"><select class="select-area"><option value="+086">中国大陆+086</option><option value="+852">中国香港+852</option><option value="+853">中国澳门+853</option><option value="+084">越南+084</option><option value="+092">巴基斯坦+092</option><option value="+065">新加坡+065</option><option value="+358">法国+358</option><option value="+066">泰国+066</option></select><div class="login-form-item"><i class="icon-phone"></i><input id="user_phone"class="inp"name="phone"placeholder="请输入手机号"maxlength="11"><p class="err-info phone-err">请输入正确的手机号</p></div><div class="login-form-item login-form-item-number"><i class="icon-codeNumber"></i><input id="codeNumber"class="inp"type="text"placeholder="请输入短信动态码"name="codeNumber"maxlength=6><button class="btn-code"type="button"id="code-get">获取</button><p class="err-info pass-err">请输入短信验证码</p></div><input class="btn"id="phone_submit"type="button"value="登录"></div><!--微信登录--><div class="login-form-panel"id="login_scan_panel"><div class="box-qrcode"><div id="qrcode_show"style="height:255px;"></div></div><div class="qrcode-text">打开<span class="bold">微信"扫一扫"</span>扫描二维码</div></div></div></div>');
			loginForm.appendTo($(renderObj));

			// 绑定UI Tab事件
			initUITab();

			// 绑定IAM SDK事件
			initUISDK(iamServerBaseUri);
		}
	}
})(window, document);

function changeTab(showId, hideId) {
    $("#" + showId).show();
    $("#" + showId + "_1").css({
        "color": "#0b86f3",
        "font-weight": "bold"
    });
    $("#" + hideId + "_1").css({
        "color": "white",
        "font-weight": "100"
    });
    $("#" + hideId).hide();
}

// 绑定UI Tab事件
function initUITab() {
	$(".login-link").click(function(){
	    var that = this;
	    $(".login-link").each(function(ele, obj){
	        var panel = $(that).attr("data-panel");
	        var _panel = $(obj).attr("data-panel");
	        if (panel != _panel){
	            $("#"+_panel).hide();
	            $(obj).removeClass('active');
	        } else {
	            $("#"+_panel).show();
	            $(obj).addClass('active');
	        }
	    });
	});
    $('.code-close').click(function () {
        $('.code-write').hide();
    });
    $(".select-area").change(function(){
        var selectVal = $(this).children('option:selected').val();
        if (selectVal != "+086") {
            alert("目前此功能仅对中国大陆用户开放！敬请谅解");
            $(this).children('option')[0].selected = true;
        }
    });
}

// 绑定IAM SDK事件
function initUISDK(iamServerBaseUri) {
	Common.Util.printSafeWarn("This browser function is for developers only. Please do not paste and execute any content here, which may cause your account to be attacked and bring you loss!");
	window.IAM.Core.configure({
		deploy: {
    		//baseUri: "http://localhost:14040/iam-server", // Using auto iamBaseUri
   			baseUri: iamServerBaseUri,
   			defaultTwoDomain: "iam", // IAM后端服务部署二级域名，当iamBaseUri为空时，会自动与location.hostnamee拼接一个IAM后端地址.
 			deaultContextPath: "/iam-server" // IAMServerd的context-path
 		},
 		// 初始相关配置(Event)
 		init: {
 			onPostCheck: function(res) {
 				// 因SNS授权（如:WeChat）只能刷新页面，因此授权错误消息只能从IAM服务加载
				var url = IAM.Core.getIamBaseUri() +"/login/errread";	
				$.ajax({
					url: url,
					xhrFields: { withCredentials: true }, // Send cookies when support cross-domain request.
					success: function (res) {
						//console.log(res);
						var errmsg = res.data["errorTipsInfo"];
						if (errmsg != null && errmsg.length > 0) {
							$("#err_tip").text(errmsg).show().delay(8000).hide(100);
						}
					}
				});
 			},
 			onError: function(req, status, errmsg){
				console.error("初始化失败... "+ errmsg);
			}
 		},
		// 定义验证码显示面板配置
		captcha: {
			use: "VerifyWithJigsawGraph", // default by 'VerifyWithGifGraph'
			panel: document.getElementById("captcha_panel"), // Jigsaw验证码时必须
			img: document.getElementById("codeimg"), // 验证码显示 img对象（仅jpeg/gif时需要）
			input: document.getElementById("captcha_input"), // 验证码input对象（仅jpeg/gif时需要）
			onSuccess: function(verifiedToken) {
				console.debug("Captcha verify successful. verifiedToken is "+ verifiedToken);
			},
			onError: function(errmsg) { // 如:申请过于频繁
				console.warn(errmsg);
			}
		},
		// 登录认证配置
		account: {
			submitBtn: document.getElementById("iam_submit"), // 登录提交触发对象
			principal: document.getElementById("user_name"), // 必填，获取填写的登录用户名
			credential: document.getElementById("password"), // 获取登录账号密码，账号登录时必填
			onBeforeSubmit: function (principal, plainPasswd, captcha) { // 提交之前
				//console.log("准备提交登录....");
				return true;
			},
			onSuccess: function (principal, redirectUrl) {
				//console.log("登录成功!");
				return true; // 返回false会阻止自动调整
			},
			onError: function (errmsg) {
				console.error("登录失败. " + errmsg);
				$("#err_tip").text(errmsg).show().delay(5000).hide(100);
			}
		},
		sms: { // SMS认证配置
			submitBtn: document.getElementById("phone_submit"), // 登录提交触发对象
			sendSmsBtn: document.getElementById("code-get"), // 发送SMS验证码对象
			mobileArea: $(".select-area"), // 手机号区域select对象
			mobile: document.getElementById("user_phone"), // 手机号input对象
			smsCode: document.getElementById("codeNumber"), // SMS验证码input对象
			onBeforeSubmit: function (mobileNum, smsCode) {
				//console.log("准备提交登录....");
				return true;
			},
			onSuccess: function(resp){
				$('.err-tip').text('');
				$('.code-write').hide();
			},
			onError: function(errmsg){
				console.error(errmsg);
				$("#err_tip").text(errmsg).show().delay(8000).hide(100);
			}
		},
		// SNS授权配置
		sns: {
			// 定义必须的请求参数
			required: {
				getWhich: function () { // 执行操作类型，必须：当使用登录功能时值填"login",当使用绑定功能时值填"bind"
					return "login";
				},
				//refreshUrl: "" // SNS回调后重定向刷新的URL，可选，which=login时可空
			},
			// 定义内嵌授权页面配置
			qrcodePanel: {
				src: document.getElementById("qrcode_show"),
				width: "250",
				height: "260"
			},
			// 定义新开的TAB授权页的配置
			pagePanel: {
				"width": "800px",
				"height": "500px",
				"left": "250px",
				"top": "100px"
			},
			// 定义支持的社交网络服务商配置
			provider: {
				// "qq": { // 服务商名(需与后台对应, 可选：qq/wechat/sina/github/google/dingtalk/twitter/facebook等)
				// 	panelType: "pagePanel", // 使用新开TAB页的方式渲染授权页面
				// 	src: document.getElementById("qq") // 绑定QQ授权点击事件源
				// },
				"wechat": { // 服务商名(需与后台对应, 可选：qq/wechat/sina/github/google/dingtalk/twitter/facebook等)
					panelType: "qrcodePanel", // 使用内嵌的方式渲染扫码授权页面
					src: document.getElementById("login_link_scan") // 绑定Wechat授权点击事件源
				}
			},
			// 点击SNS服务商授权请求之前回调事件
			onBefore: function (provider, panelType) {
				if (provider == 'wechat') { // 只有微信等扫码登录时，才切换tab
					changeTab('login_scan_panel', 'login_scan_pass');
				}
				// 执行后续逻辑，返回false会阻止继续
				return true;
			}
		}
	}).bindForAccountAuthenticator().bindForSMSAuthenticator().bindForSNSAuthenticator().bindForCaptchaVerifier();
}

// 监听panelType为pagePanel类型的SNS授权回调
$(function () {
	window.onmessage = function (e) {
		if(e.data) {
			window.location.href = JSON.parse(e.data).refresh_url;
		}
	}
});
 