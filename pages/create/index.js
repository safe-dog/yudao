// pages/create/index.js
var INFO = wx.getSystemInfoSync();
var TAGS = [
  {
    id: '1480686584130',
    name: '默认标签'
  }, {
    id: '1480686584131',
    name: '感悟与体会'
  }, {
    id: '1480686584132',
    name: '感情'
  }, {
    id: '1480686584133',
    name: '生活'
  }, {
    id: '1480686584134',
    name: '工作'
  }, {
    id: '1480686584135',
    name: '开心'
  }, {
    id: '1480686584136',
    name: '有趣'
  }, {
    id: '1480686584137',
    name: '尴尬'
  }, {
    id: '1480686584138',
    name: '无聊'
  }, {
    id: '1480686584139',
    name: '悲伤'
  }, {
    id: '1480686584140',
    name: '郁闷'
  }, {
    id: '1480686584141',
    name: '纠结'
  }
];
var PRIVERS = [
  {
    id: '0',
    name: '完全公开'
  }, {
    id: '1',
    name: '自己可见'
  }, {
    id: '2',
    name: '匿名公开'
  }
];
var TOAST;
var weToast = require('../../libs/weToast/weToast.js');
var { API, YUDAO } = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    WIDTH: INFO.screenWidth,
    STATUS_HEIGHT: INFO.statusBarHeight,
    tags: TAGS,
    current_tag: TAGS[0],
    PRIVERS,
    CURRENT_PRIVER: PRIVERS[0],
    TITLE: '',
    CONTENT: '',
    content_focus: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    TOAST = new weToast(this);
    this.setData({
      TITLE: wx.getStorageSync('CREATE_TITLE'),
      CONTENT: wx.getStorageSync('CREATE_CONTENT'),
      current_tag: TAGS[parseInt(wx.getStorageSync('CREATE_TAG'))] || TAGS[0],
      CURRENT_PRIVER: PRIVERS[parseInt(wx.getStorageSync('CREATE_PRIVER'))] || PRIVERS[0]
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
  // 后退
  goBackHandler: function () {
    wx.navigateBack({});
  },
  // 选择标签
  selectTagHandler: function (e) {
    var { value } = e.detail;
    var id = parseInt(value);
    this.setData({
      current_tag: TAGS[id]
    });
    wx.setStorageSync('CREATE_TAG', id);
  },
  //选择权限
  selectPriverHandler: function (e) {
    var id = parseInt(e.detail.value);
    this.setData({
      CURRENT_PRIVER: PRIVERS[id]
    });
    wx.setStorageSync('CREATE_PRIVER', id)
  },
  /**
   * 发布操作
   */
  submitHandler: function () {
    var { TITLE, CONTENT, CURRENT_PRIVER, current_tag } = this.data;
    if (!CONTENT) return TOAST.warning('写点什么再发布吧！');
    // 权限
    var permission = CURRENT_PRIVER.id;
    var tag = current_tag.id;
    // 开始发布
    wx.showLoading({
      title: '发布日记中..',
      mask: true
    });
    API.addDairy({
      title: TITLE,
      content: CONTENT,
      tag, permission
    }).then(ret => {
      wx.hideLoading();
      TOAST.success('日记发布成功！');
      // 刷新主页数据
      YUDAO.loadDairy();
      // 清空缓存
      wx.setStorageSync('CREATE_TITLE', '');
      wx.setStorageSync('CREATE_CONTENT', '');
      // 返回主页
      setTimeout(() => wx.navigateBack({}), 1000);
    }).catch(err => {
      wx.hideLoading();
      TOAST.error('日记发布失败！')
      console.warn(err);
      setTimeout(() => {
        API.gotoLogin();
      }, 1000);
    });
  },
  // 输入内容
  inputContentHandler: function (e) {
    var { value } = e.detail;
    this.setData({
      CONTENT: value
    });
    wx.setStorageSync('CREATE_CONTENT', value);
  },
  // 输入标题
  inputTitleHandler: function (e) {
    var { value } = e.detail;
    this.setData({
      TITLE: value
    });
    wx.setStorageSync('CREATE_TITLE', value);
  },
  /**
   * 上传图片
   */
  uploadImage: function () {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        wx.showLoading({
          title: '上传图片中..',
          mask: true
        });
        var filePath = res.tempFilePaths[0];
        API.uploadFile(filePath).then(img_url => {
          // 插入图片
          var CONTENT = this.data.CONTENT + '\n\n![](' + img_url + ')\n\n';
          this.setData({
            CONTENT,
            content_focus: true
          });
          // 存储缓存
          wx.setStorageSync('CREATE_CONTENT', CONTENT);
          wx.hideLoading();
        })
      },
    })
  }
})