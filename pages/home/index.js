// pages/home/index.js
var { API, YUDAO } = getApp();
var INFO = wx.getSystemInfoSync();

var TOP = 0;
var PAGE = 1;
var IS_UP = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    datas: [],
    LOADING: true,
    SCROLL_TOP: 0,
    HEADER_OPACITY: 0,
    MENU_ANIMATION: {},
    HEIGHT: INFO.screenHeight,
    STATUS_HEIGHT: INFO.statusBarHeight,
    CAN_LOAD_MORE: true,
    SHOW_MENU: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var loadDairy = () => {
      // 开始加载数据
      API.loadDiary().then(datas => {
        PAGE = 1;
        setTimeout(() => this.setData({
          datas,
          LOADING: false
        }), 500);
      }).catch(err => {
        // 错误拉
        console.log('ERR', err)
      });
    }

    YUDAO.loadDairy = () => loadDairy();
    loadDairy();

    // 菜单动画
    var show_animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    });
    var hide_animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease'
    });
    show_animation.bottom(0).opacity(1).step();
    this.SHOW_ANIMATION = show_animation.export();
    hide_animation.bottom(-100).opacity(0).step();
    this.HIDE_ANIMATION = hide_animation.export();
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '遇岛日记',
      path: '/pages/init/loading?from=home'
    }
  },

  /**
   * 滚动事件
   */
  scrollHandler: function (e) {
    var { scrollTop } = e.detail;
    // 计算透明度
    var HEADER_OPACITY = parseFloat(scrollTop / 200).toFixed(2);
    if (HEADER_OPACITY > 1) HEADER_OPACITY = 1;
    if (HEADER_OPACITY < 0.1) HEADER_OPACITY = 0;

    this.setData({
      HEADER_OPACITY,
    });
    // 判断是不是向上
    var is_up = true;
    if (scrollTop < TOP) is_up = false;
    TOP = scrollTop;
    if (IS_UP === is_up) return;
    IS_UP = is_up;

    this.setData({
      MENU_ANIMATION: (HEADER_OPACITY === 0) ? this.SHOW_ANIMATION : (!is_up ? this.SHOW_ANIMATION : this.HIDE_ANIMATION)
    });
  },
  // 加载更多
  loadMoreHandler: function () {
    if (!this.data.CAN_LOAD_MORE) return;
    this.setData({
      LOADING: true
    });
    API.loadDiary(PAGE + 1).then(datas => {
      setTimeout(() => this.setData({
        LOADING: false,
        datas: this.data.datas.concat(datas),
        CAN_LOAD_MORE: datas.length > 0
      }), 500);
      PAGE += 1;
    }).catch(err => {})
  },
  // 返回顶部
  toTophandler: function () {
    this.setData({
      SCROLL_TOP: 0
    })
  },
  // 显示菜单
  showMenuHandler: function () {
    this.setData({
      SHOW_MENU: true
    });
  },
  hideMenuHandler: function () {
    this.setData({
      SHOW_MENU: false
    })
  },

  /**
   * 菜单点击事件
   */
  menuActionHandler: function (e) {
    var { route } = e.currentTarget.dataset;
    wx.navigateTo({
      url: '/pages/' + route + '/index',
    })
  },
  /**
   * 点击卡片事件
   */
  viewDetailHandler: function (e) {
    console.log(e);
    var { link } = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/detail/index?link=' + link,
    })
  }
})