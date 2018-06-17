// pages/detail/index.js
var INFO = wx.getSystemInfoSync();
var { API, YUDAO } = getApp();
var WxParse = require('../../libs/wxParse/wxParse.js');
var TOAST;
var weToast = require('../../libs/weToast/weToast.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    INFO: {},
    LOADING: true,
    STATUS_HEIGHT: INFO.statusBarHeight,
    FROM_MY: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var { link, isMe } = options;
    if (isMe === 'yes') this.setData({
      FROM_MY: true
    });
    this.LINK = link;
    TOAST = new weToast(this);

    API.getDetail(link).then(data => {
      this.setData({
        LOADING: false,
        INFO: data.info
      });
      // 解析html
      var article = data.html;
      WxParse.wxParse('article', 'html', article, this, 5);
    }).catch(err => {
      TOAST.error('加载日记失败！')
      setTimeout(() => wx.navigateBack({}), 1000);
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

  /**
   * 喜欢/取消喜欢
   */
  toggleLikeHandler: function () {
    var { INFO } = this.data;
    API.setLike(INFO.id);
    this.setData({
      INFO: Object.assign(INFO, {
        isLiked: !INFO.isLiked
      })
    });
  }
})