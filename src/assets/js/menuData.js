export default [
  {
    path: '/home',
    name: 'home',
    label: '首页',
    icon: 'el-icon-s-home'
  },
  {
    name: 'Building',
    label: '楼宇智控',
    icon: 'iconfont icon-louyu',
    children: [
      {
        path: '/equipment',
        name: 'equipment',
        label: '设备平面',
        icon: 'iconfont icon-shebeiguanli2'
      },

      {
        path: '/energy',
        name: 'energy',
        label: '能源管理',
        icon: 'iconfont icon-zu2327'
      },

      {
        path: '/stairs',
        name: 'stairs',
        label: '梯控管理',
        icon: 'iconfont icon-dianti'
      },
      {
        path: '/configEle',
        name: 'configEle',
        label: '高压配电',
        icon: 'iconfont icon-dian'
      }
    ]
  },
  {
    name: 'Safety',
    label: '安全中心',
    icon: 'iconfont icon-anquan',
    children: [
      {
        path: '/video',
        name: 'video',
        label: '视频监控',
        icon: 'iconfont icon-shipinjiankong'
      },
      {
        path: '/door',
        name: 'door',
        label: '门禁管理',
        icon: 'iconfont icon-menjin'
      },
      {
        path: '/alarm',
        name: 'alarm',
        label: '入侵报警',
        icon: 'iconfont icon-zhujiruqinfangyu'
      },
      {
        path: '/fire',
        name: 'fire',
        label: '火灾报警',
        icon: 'iconfont icon-huo'
      },
      {
        path: '/parking',
        name: 'parking',
        label: '停车管理',
        icon: 'iconfont icon-tingchechang'
      }
    ]
  },
  {
    label: '系统管理',
    name: 'tools',
    icon: 'el-icon-s-tools',
    children: [
      {
        path: '/user',
        name: 'user',
        label: '用户管理',
        icon: 'el-icon-user-solid'
      },
      {
        path: '/authorit',
        name: 'authorit',
        label: '权限管理',
        icon: 'iconfont icon-xitongquanxian'
      }
    ]
  }
]
