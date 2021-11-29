// 全局挂载引入http相关请求拦截插件
import http from './libs/request'
import './.env.js'

// post类型对象参数转为get类型url参数
import queryParams from './libs/function/queryParams.js'
// 路由封装(与http无关，屏蔽)
// import route from './libs/function/route.js'
// 时间格式化(与http无关，屏蔽)
// import timeFormat from './libs/function/timeFormat.js'
// 时间戳格式化,返回多久之前(与http无关，屏蔽)
// import timeFrom from './libs/function/timeFrom.js'
// 颜色渐变相关,colorGradient-颜色渐变,hexToRgb-十六进制颜色转rgb颜色,rgbToHex-rgb转十六进制(与http无关，屏蔽)
// import colorGradient from './libs/function/colorGradient.js'
// 生成全局唯一guid字符串(与http无关，屏蔽)
// import guid from './libs/function/guid.js'
// 主题相关颜色,info|success|warning|primary|default|error,此颜色已在uview.scss中定义,但是为js中也能使用,故也定义一份(与http无关，屏蔽)
// import color from './libs/function/color.js'
// 根据type获取图标名称(与http无关，屏蔽)
// import type2icon from './libs/function/type2icon.js'
// 打乱数组的顺序(与http无关，屏蔽)
// import randomArray from './libs/function/randomArray.js'
// 对象和数组的深度克隆(与http无关，屏蔽)
// import deepClone from './libs/function/deepClone.js'
// 对象深度拷贝(与http无关，屏蔽)
// import deepMerge from './libs/function/deepMerge.js'
// 添加单位(与http无关，屏蔽)
// import addUnit from './libs/function/addUnit.js'

// 规则检验(与http无关，屏蔽)
// import test from './libs/function/test.js'
// 随机数(与http无关，屏蔽)
// import random from './libs/function/random.js'
// 去除空格(与http无关，屏蔽)
// import trim from './libs/function/trim.js'
// toast提示，对uni.showToast的封装
import toast from './libs/function/toast.js'
// 获取父组件参数(与http无关，屏蔽)
// import getParent from './libs/function/getParent.js'
// 获取整个父组件(与http无关，屏蔽)
// import $parent from './libs/function/$parent.js'
// 获取sys()和os()工具方法
// 获取设备信息，挂载到$u的sys()(system的缩写)属性中，
// 同时把安卓和ios平台的名称"ios"和"android"挂到$u.os()中，方便取用(与http无关，屏蔽)
// import {sys, os} from './libs/function/sys.js'
// 防抖方法(与http无关，屏蔽)
// import debounce from './libs/function/debounce.js'
// 节流方法(与http无关，屏蔽)
// import throttle from './libs/function/throttle.js'


// 配置信息(与http无关，屏蔽)
// import config from './libs/config/config.js'
// 各个需要fixed的地方的z-index配置文件(与http无关，屏蔽)
// import zIndex from './libs/config/zIndex.js'

const $szy = {
	queryParams: queryParams,
	// route: route,(与http无关，屏蔽)
	// timeFormat: timeFormat,(与http无关，屏蔽)
	// date: timeFormat, // 另名date(与http无关，屏蔽)
	// timeFrom,(与http无关，屏蔽)
	// colorGradient: colorGradient.colorGradient,(与http无关，屏蔽)
	// colorToRgba: colorGradient.colorToRgba,(与http无关，屏蔽)
	// guid,(与http无关，屏蔽)
	// color,(与http无关，屏蔽)
	// sys,(与http无关，屏蔽)
	// os,(与http无关，屏蔽)
	// type2icon,(与http无关，屏蔽)
	// randomArray,(与http无关，屏蔽)
	// wranning,(与http无关，屏蔽)
	get: http.get,
	post: http.post,
	put: http.put,
	'delete': http.delete,
	// hexToRgb: colorGradient.hexToRgb,(与http无关，屏蔽)
	// rgbToHex: colorGradient.rgbToHex,(与http无关，屏蔽)
	// test,(与http无关，屏蔽)
	// random,(与http无关，屏蔽)
	// deepClone,(与http无关，屏蔽)
	// deepMerge,(与http无关，屏蔽)
	// getParent,(与http无关，屏蔽)
	// $parent,(与http无关，屏蔽)
	// addUnit,(与http无关，屏蔽)
	// trim,(与http无关，屏蔽)
	// type: ['primary', 'success', 'error', 'warning', 'info'],(与http无关，屏蔽)
	http,
	toast,
	// config, // uView配置信息相关，比如版本号(与http无关，屏蔽)
	// zIndex,(与http无关，屏蔽)
	// debounce,(与http无关，屏蔽)
	// throttle,(与http无关，屏蔽)
}

// $szy挂载到uni对象上
uni.$szy = $szy

const install = Vue => {
	// Vue.mixin(mixin) (与http无关，屏蔽)
	// if (Vue.prototype.openShare) {(与http无关，屏蔽)
		// Vue.mixin(mpShare);
	// }
	// Vue.mixin(vuexStore);
	// 时间格式化，同时两个名称，date和timeFormat
	// Vue.filter('timeFormat', (timestamp, format) => {
	// 	return timeFormat(timestamp, format)
	// })
	// Vue.filter('date', (timestamp, format) => {
	// 	return timeFormat(timestamp, format)
	// })
	// // 将多久以前的方法，注入到全局过滤器
	// Vue.filter('timeFrom', (timestamp, format) => {
	// 	return timeFrom(timestamp, format)
	// })
	Vue.prototype.$szy = $szy
}

export default {
	install
}