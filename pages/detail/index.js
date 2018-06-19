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
      // 解析附言html
      var { fuyans } = data.info;
      var self = this;
      fuyans.map(function (fy, index) {
        console.log('parse:', fy, index);
        WxParse.wxParse('fy[' + index+']', 'html', fy.html, self, 5);
      });
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
  },
  // 删除
  delHandler: function () {
    var { INFO } = this.data;
    console.log(INFO.delToken);
    wx.showModal({
      title: '删除日记',
      content: '确定删了这篇日记吗？多多考虑噢！',
      success: ret => {
        if (!ret.confirm) return;
        // 开始删除
        wx.showLoading({
          title: '删除日记中',
          mask: true
        });
        API.delDairy(INFO.id, INFO.delToken).then(() => {
          wx.hideLoading();
          TOAST.success('日记删除成功！');
          // 刷新日记列表
          YUDAO.loadDairy();
          YUDAO.loadMyDairy && YUDAO.loadMyDairy();
          // 返回
          setTimeout(() => wx.navigateBack({}), 1000);
        }).catch(err => {
          TOAST.error('日记删除失败！');
          console.warn(err);
        });
      }
    })
  }
})