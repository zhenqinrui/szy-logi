const install = (Vue, vm) => {
	// 微信登陆
	let login = (params = {}, header = {}) => {
		return vm.$szy.post(process.uniEnv.xmUrl + '/userserver/weixin/applet/login/v1.0', params, header)
	}

	// 获取微信token、unionId等信息
	let getWxToken = (params = {}, header = {}) => {
		return vm.$szy.post(process.uniEnv.xmUrl + '/userserver/weixin/auth/token/v1.0', params, header)
	}
	
	// 将各个定义的接口名称，统一放进对象挂载到vm.$szy.parentsApi(因为vm就是this，也即this.$u.parentsApi)下
	vm.$szy.loginApi = {
		login,
		getWxToken
	};
}

export default {
	install
}