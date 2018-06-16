var INFO = wx.getSystemInfoSync();
var { API } = getApp();
var TOAST;
var weToast = require('../../libs/weToast/weToast.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    AVATAR_URL: '',
    USER_NAME: '',
    STATUS_HEIGHT: INFO.statusBarHeight,
    IS_CHECK_IN: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    TOAST = new weToast(this);
    this.setData({
      AVATAR_URL: API.AVATAR_URL,
      USER_NAME: API.USER_NAME
    });

    // 检查是否已经签到
    API.isCheckIn().then(() => {
      this.setData({
        IS_CHECK_IN: true
      })
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
  goBackHandler: function () {
    wx.navigateBack({});
  },
  // 注销登陆
  logoutHandler: function () {
    wx.showModal({
      title: '注销登陆',
      content: '注销当前登陆账号吗？存储的登陆信息也一并清除！',
      success: ret => {
        if (!ret.confirm) return;
        wx.showLoading({
          title: '注销中..',
          mask: true
        });
        API.logout().then(() => {
          setTimeout(() => wx.reLaunch({
            url: '/pages/init/loading?msg=logout',
          }), 1000);
        });
      }
    })
  },
  // 签到
  checkInHandler: function () {
    if (this.data.IS_CHECK_IN) return TOAST.warning('今日已签到！');
    // 开始签到
    wx.showLoading({
      title: '签到中..',
      mask: true
    });
    API.checkIn().then(() => {
      wx.hideLoading();
      TOAST.success('签到成功！');
      this.setData({
        IS_CHECK_IN: true
      });
    }).catch(err => {
      wx.hideLoading();
      TOAST.warning('签到失败！');
      setTimeout(() => API.gotoLogin(), 1000);
    })
  },

  // 用户信息
  userInfoHandler: function () {},
  // 关于
  aboutHandler: function () {
    wx.navigateTo({
      url: '/pages/setting/about',
    })
  }
})