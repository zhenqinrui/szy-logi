import setting from './setting' // 用户设置（具体代码在附录）
import authority from './authority' // localStorage用户信息保存（具体代码在附录）
// import { redirectLogin } from '@/utils/router' // 重定向登陆，登陆后返回等逻辑（代码略）

/**
 * @description: 静默登录
 */
export async function loginSlience() {
  await login(false)
}

/**
 * @description: 强制登录
 */
export async function loginForce() {
  authority.clear()
  await login(true)
}

/**
 * @description: 登陆封装
 */
export async function login(isForce) {
  // 通过wx.login获取code发给后台
  const user = await codeLogin(isForce)
  // 返回id表示静默登陆成功
  if (user.userId) {
	  uni.showToast({
	  	title:'已登录',
		icon:'none'
	  })
	  // 掌通这边是没有这个返回
     return user
  }
  // 判断是否有获取用户信息权限，没有的重定向登陆
  await validateSetting()
  // 有getUserInfo权限,无需授权直接使用getUserInfo登陆
  return getUserInfo(user)
}

/**
 * @description: 通过code登录
 * 用户登陆过：后台可以获取openid或者unionId直接查询到用户信息，实现静默登陆
 * 用户第一次：需要重定向授权页面，点击getUserInfo的按钮授权登陆
 */
export async function codeLogin(force) { // force：是否强制登陆
  // 获取缓存中的用户信息，有id表示已经登陆过
  const cacheUser = authority.get() || {}
  console.log('zqr', 'cacheUser:' + JSON.stringify(cacheUser))
  if (!force && cacheUser.userId) {
	  return cacheUser
  }
  // isValid：后台code换的session_key是否过期，过期的话不可以解处加密字符串中的用户信息，需要重新登陆
  const isValid = await validateSession() 
  console.log('zqr', 'force:' + force + ',valid:' + isValid)
  if (force || !isValid) {
	  console.log('zqr', 'login..')
    let prevCodeLogin = new Promise((resolve, reject) => {
      wx.login({
        async success({ code }) {
          try {
            // 将code发送给后台，后台可以获取到openid，session_key等
			var param = {
				jsCode: code,
				wxAppType: 'APPLET_SIGN'
			}
            const res = await uni.$szy.loginApi.getWxToken(param)
			// 这边返回的具体信息要看服务器，每个业务不一样，有的就没有用户信息
            // code获取后台返回的用户信息（登陆过返回完整用户信息，没有登陆过返回token，token用户后台关联当前用户的session_key）
			const user = {}
			user.token = res.token
			user.openId = res.openId
			user.unionId = res.unionId
            authority.set(user)
            return resolve(user)
          } catch (e) {
            reject(e)
          }
        },
        fail(e) {
          reject(e)
        }
      })
    })
    return prevCodeLogin
  }
  return cacheUser
}

/**
 * @description: 检查sessionKey是否过期，过期的话需要重新wx.login获取code登陆
 */
export function validateSession() {
  return new Promise(resolve => {
    wx.checkSession({
      success() {
        resolve(1)
      },
      fail() {
        resolve(0)
      }
    })
  })
}

/**
 * @description: 检查是否有权限获取用户信息，有的话直接可以直接使用wx.getUserInfo
 */
async function validateSetting() {
  const hasSetting = await setting.has('userInfo')
  if (!hasSetting) {
    // 没有权限的话，清空保存用户信息，重定向登陆
    authority.clear()
    // redirectLogin()
  }
  return hasSetting || handleError(new Error('没有获取UserInfo权限'))
}

/**
 * @description: getUserInfo 获取加密字符串，传给后台解密出用户信息
 */
export function getUserInfo(param) {
  return new Promise(resolve => {
    wx.getUserInfo({
      lang: 'zh_CN',
      async success(res) {
        const { encryptedData, iv } = res
        const user = await toDecode({
          encrypted_data: encryptedData,
          iv,
		  param
        })
        resolve(user)
      }
    })
  })
}

/**
 * @description: 解密用户信息或者手机号(encrypted_data, iv)
 * encrypted_data, iv：有获取用户信息权限可以通过getUserInfo获取，否则通过授权按钮获取
 */
export async function toDecode({ encrypted_data, iv, param}) {
  // 此方法header中默认携带了code登陆返回的token，后台通过token查到session_key，然后解密出用户信息
 var loginParam = {
 	openId: param.openId,
 	appId: 'APPLET_SIGN',
 	unionId: param.unionId
 }
 var bindParam = {
 	wxToken: param.token,
 	encryptedData: encrypted_data,
 	iv: iv,
 	appId: 'APPLET_SIGN'
 }
 var param = {
 	loginParam: loginParam,
 	bindParam: bindParam,
 }
 const res = await uni.$szy.loginApi.login(param.loginParam)
 //res:返回
 /**
  * {"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZUeXBlIjoiQVBQTEVUIiwiaXNPcGVyYXRpb24iOmZhbHNlLCJpc3MiOiJzenkiLCJzZXNzaW9uSWQiOiJGNUEzMUY2NEU5MjQ0NzFEQkQxQjQ1MDY2MTQ4MzZDMCIsInVzZXJJZCI6IjlkZGQ0YmZlOGIwY2M1MzI2ZTNjIiwidGVybWluYWxUeXBlIjoiQVBQTEVUIiwiYXBwVHlwZSI6IkFQUF9UWVBFX1RFQUNIRVIiLCJhcHBJZCI6IkFQUExFVF9TSUdOIiwiaWQiOiJCODNCMDI0RDYzODE0MTg2ODdEQTcxMUYxQkY3MTNFQSIsInVzZXJUeXBlIjoidGVhY2hlciIsImV4cCI6MTYzNzk1MDQ4NywidG9rZW5UeXBlIjoxLCJpYXQiOjE2Mzc5MjE2ODd9.KpRYDnQ7xcWl6Kk6vN7Is23j7-hJwecthynl__ZFako","refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZXZUeXBlIjoiQVBQTEVUIiwiaXNPcGVyYXRpb24iOmZhbHNlLCJpc3MiOiJzenkiLCJzZXNzaW9uSWQiOiJGNUEzMUY2NEU5MjQ0NzFEQkQxQjQ1MDY2MTQ4MzZDMCIsInVzZXJJZCI6IjlkZGQ0YmZlOGIwY2M1MzI2ZTNjIiwidGVybWluYWxUeXBlIjoiQVBQTEVUIiwiYXBwVHlwZSI6IkFQUF9UWVBFX1RFQUNIRVIiLCJhcHBJZCI6IkFQUExFVF9TSUdOIiwiaWQiOiJFODU4OTBFNjk1RjE0MzgwQkFFQ0YyRDMwQjU1M0Q2NiIsInVzZXJUeXBlIjoidGVhY2hlciIsImV4cCI6MTYzODAwODA4NywidG9rZW5UeXBlIjoyLCJpYXQiOjE2Mzc5MjE2ODd9.WfHsG_E4Rl1BG9Ls6BFFHS02113qkTrBGhRRKN49UGg","sessionId":"F5A31F64E924471DBD1B4506614836C0","userId":"9ddd4bfe8b0cc5326e3c","ttl":1637950486,"loginIndex":null,"bindStatus":1,"userType":2,"accountId":null}
  */
 const user = {}
 user.userId = res.userId
  if (user) {
    user.token = res.accessToken
    authority.set(user)
	uni.showToast({
		title:'登录成功',
		icon:'none',
	})
	console.log('zqr', '登录成功')
    return user
  } else {
    return Promise.reject(new Error('登录decode失败'))
  }
}

export default login
