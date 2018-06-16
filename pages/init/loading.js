// pages/init/loading.js
var weToast = require('../../libs/weToast/weToast.js');
var TOAST;
var { md5, API } = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    LOADING: true,
    IS_LOGIN: false,
    INPUT_USER: '',
    INPUT_PASS: '',
    USER_NAME: '',
    AVATAR_URL: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    TOAST = new weToast(this);

    this.setData({
      INPUT_USER: wx.getStorageSync('_LOGIN_USER'),
      INPUT_PASS: wx.getStorageSync('_LOGIN_PASS')
    })

    // 获取初始化参数
    switch (options.msg) {
      case 'expired':
        TOAST.warning('认证过期！请重新登陆！');
        break;
      case 'logout':
        TOAST.info('用户注销成功！');
        break;
      default:
        break;
    }

    API.getUserInfo().then(info => {
      setTimeout(() => this.setData({
        LOADING: false,
        IS_LOGIN: true,
        USER_NAME: info.userName,
        AVATAR_URL: info.avatarUrl
      }), 500);
      // 跳转主页
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/home/index',
        })
      }, 1000);
    }).catch(err => {
      setTimeout(() => this.setData({
        LOADING: false,
        IS_LOGIN: false
      }), 500);
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },
  // 输入账号
  inputUserHandler: function (e) {
    this.setData({
      INPUT_USER: e.detail.value
    });
  },
  // 输入密码
  inputPassHandler: function (e) {
    this.setData({
      INPUT_PASS: e.detail.value
    });
  },
  // 登录操作
  loginHandler: function () {
    var { INPUT_USER, INPUT_PASS } = this.data;
    // 判断是否输入了
    if (!INPUT_USER) return TOAST.warning('请输入登录账号！');
    if (!INPUT_PASS) return TOAST.warning('请输入登录密码！');
    // 加载UI
    wx.showLoading({
      title: '',
      mask: true
    });
    // 加密密码
    var PWD = md5(INPUT_PASS);
    // 登录请求
    API.login(INPUT_USER, PWD).then(info => {
      wx.hideLoading();
      TOAST.success('登录成功！');
      // 本地存储用户账号密码
      wx.setStorageSync('_LOGIN_USER', INPUT_USER);
      wx.setStorageSync('_LOGIN_PASS', INPUT_PASS);
      this.setData({
        LOADING: false,
        IS_LOGIN: true,
        USER_NAME: info.userName,
        AVATAR_URL: info.avatarUrl
      });
      // 跳转
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/home/index',
        });
      }, 1000);
    }).catch(err => {
      wx.hideLoading();
      TOAST.error(err);
    })
  },
  // 注册说明
  regHandler: function () {
    wx.navigateTo({
      url: '/pages/init/reg',
    })
  }
})