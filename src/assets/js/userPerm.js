// 用户权限
export default [
  {
    id: 30,
    roleName: '主管1',
    roleDesc: '技术负责人',
    children: [
      {
        id: 101,
        authName: '商品管理',
        path: 'goods',
        children: [
          {
            id: 104,
            authName: '商品列表',
            path: 'goods',
            children: [
              {
                id: 116,
                authName: '商品修改',
                path: 'goods'
              }
            ]
          },
          {
            id: 115,
            authName: '分类参数',
            path: 'params',
            children: [
              {
                id: 142,
                authName: '获取参数列表',
                path: 'categories'
              },
              {
                id: 143,
                authName: '创建商品参数',
                path: 'categories'
              },
              {
                id: 144,
                authName: '删除商品参数',
                path: 'categories'
              }
            ]
          },
          {
            id: 121,
            authName: '商品分类',
            path: 'categories',
            children: [
              {
                id: 122,
                authName: '添加分类',
                path: 'categories'
              },
              {
                id: 123,
                authName: '删除分类',
                path: 'categories'
              },
              {
                id: 149,
                authName: '获取分类详情',
                path: 'categories'
              }
            ]
          }
        ]
      },
      {
        id: 102,
        authName: '订单管理',
        path: 'orders',
        children: [
          {
            id: 107,
            authName: '订单列表',
            path: 'orders',
            children: [
              {
                id: 109,
                authName: '添加订单',
                path: 'orders'
              }
            ]
          }
        ]
      },
      {
        id: 103,
        authName: '权限管理',
        path: 'rights',
        children: [
          {
            id: 111,
            authName: '角色列表',
            path: 'roles',
            children: [
              {
                id: 129,
                authName: '添加角色',
                path: 'roles'
              },
              {
                id: 130,
                authName: '删除角色',
                path: 'roles'
              },
              {
                id: 134,
                authName: '角色授权',
                path: 'roles'
              },
              {
                id: 135,
                authName: '取消角色授权',
                path: 'roles'
              },
              {
                id: 138,
                authName: '获取角色列表',
                path: 'roles'
              },
              {
                id: 139,
                authName: '获取角色详情',
                path: 'roles'
              },
              {
                id: 140,
                authName: '更新角色信息',
                path: 'roles'
              },
              {
                id: 141,
                authName: '更新角色权限',
                path: 'roles'
              }
            ]
          },
          {
            id: 112,
            authName: '权限列表',
            path: 'rights',
            children: [
              {
                id: 147,
                authName: '查看权限',
                path: 'rights'
              }
            ]
          }
        ]
      },
      {
        id: 125,
        authName: '用户管理',
        path: 'users',
        children: [
          {
            id: 110,
            authName: '用户列表',
            path: 'users',
            children: [
              {
                id: 131,
                authName: '添加用户',
                path: 'users'
              },
              {
                id: 132,
                authName: '删除用户',
                path: 'users'
              },
              {
                id: 133,
                authName: '更新用户',
                path: 'users'
              },
              {
                id: 136,
                authName: '获取用户详情',
                path: 'users'
              },
              {
                id: 137,
                authName: '分配用户角色',
                path: 'users'
              }
            ]
          }
        ]
      },
      {
        id: 145,
        authName: '数据统计',
        path: 'reports',
        children: [
          {
            id: 146,
            authName: '数据报表',
            path: 'reports',
            children: [
              {
                id: 148,
                authName: '查看数据',
                path: 'reports'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 31,
    roleName: '测试角色',
    roleDesc: '测试角色描述',
    children: [
      {
        id: 101,
        authName: '商品管理',
        path: 'goods',
        children: [
          {
            id: 104,
            authName: '商品列表',
            path: 'goods',
            children: [
              {
                id: 116,
                authName: '商品修改',
                path: 'goods'
              }
            ]
          },
          {
            id: 115,
            authName: '分类参数',
            path: 'params',
            children: [
              {
                id: 142,
                authName: '获取参数列表',
                path: 'categories'
              },
              {
                id: 143,
                authName: '创建商品参数',
                path: 'categories'
              },
              {
                id: 144,
                authName: '删除商品参数',
                path: 'categories'
              }
            ]
          },
          {
            id: 121,
            authName: '商品分类',
            path: 'categories',
            children: [
              {
                id: 122,
                authName: '添加分类',
                path: 'categories'
              },
              {
                id: 123,
                authName: '删除分类',
                path: 'categories'
              },
              {
                id: 149,
                authName: '获取分类详情',
                path: 'categories'
              }
            ]
          }
        ]
      },
      {
        id: 102,
        authName: '订单管理',
        path: 'orders',
        children: [
          {
            id: 107,
            authName: '订单列表',
            path: 'orders',
            children: [
              {
                id: 109,
                authName: '添加订单',
                path: 'orders'
              }
            ]
          }
        ]
      },
      {
        id: 103,
        authName: '权限管理',
        path: 'rights',
        children: [
          {
            id: 111,
            authName: '角色列表',
            path: 'roles',
            children: [
              {
                id: 129,
                authName: '添加角色',
                path: 'roles'
              },
              {
                id: 130,
                authName: '删除角色',
                path: 'roles'
              },
              {
                id: 134,
                authName: '角色授权',
                path: 'roles'
              },
              {
                id: 135,
                authName: '取消角色授权',
                path: 'roles'
              },
              {
                id: 138,
                authName: '获取角色列表',
                path: 'roles'
              },
              {
                id: 139,
                authName: '获取角色详情',
                path: 'roles'
              },
              {
                id: 140,
                authName: '更新角色信息',
                path: 'roles'
              },
              {
                id: 141,
                authName: '更新角色权限',
                path: 'roles'
              }
            ]
          },
          {
            id: 112,
            authName: '权限列表',
            path: 'rights',
            children: [
              {
                id: 147,
                authName: '查看权限',
                path: 'rights'
              }
            ]
          }
        ]
      },
      {
        id: 125,
        authName: '用户管理',
        path: 'users',
        children: [
          {
            id: 110,
            authName: '用户列表',
            path: 'users',
            children: [
              {
                id: 131,
                authName: '添加用户',
                path: 'users'
              },
              {
                id: 132,
                authName: '删除用户',
                path: 'users'
              },
              {
                id: 133,
                authName: '更新用户',
                path: 'users'
              },
              {
                id: 136,
                authName: '获取用户详情',
                path: 'users'
              },
              {
                id: 137,
                authName: '分配用户角色',
                path: 'users'
              }
            ]
          }
        ]
      },
      {
        id: 145,
        authName: '数据统计',
        path: 'reports',
        children: [
          {
            id: 146,
            authName: '数据报表',
            path: 'reports',
            children: [
              {
                id: 148,
                authName: '查看数据',
                path: 'reports'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 34,
    roleName: '测试角色2',
    roleDesc: '测试描述12',
    children: [
      {
        id: 101,
        authName: '商品管理',
        path: 'goods',
        children: [
          {
            id: 104,
            authName: '商品列表',
            path: 'goods',
            children: [
              {
                id: 116,
                authName: '商品修改',
                path: 'goods'
              }
            ]
          },
          {
            id: 115,
            authName: '分类参数',
            path: 'params',
            children: [
              {
                id: 142,
                authName: '获取参数列表',
                path: 'categories'
              },
              {
                id: 143,
                authName: '创建商品参数',
                path: 'categories'
              },
              {
                id: 144,
                authName: '删除商品参数',
                path: 'categories'
              }
            ]
          },
          {
            id: 121,
            authName: '商品分类',
            path: 'categories',
            children: [
              {
                id: 122,
                authName: '添加分类',
                path: 'categories'
              },
              {
                id: 123,
                authName: '删除分类',
                path: 'categories'
              },
              {
                id: 149,
                authName: '获取分类详情',
                path: 'categories'
              }
            ]
          }
        ]
      },
      {
        id: 102,
        authName: '订单管理',
        path: 'orders',
        children: [
          {
            id: 107,
            authName: '订单列表',
            path: 'orders',
            children: [
              {
                id: 109,
                authName: '添加订单',
                path: 'orders'
              }
            ]
          }
        ]
      },
      {
        id: 103,
        authName: '权限管理',
        path: 'rights',
        children: [
          {
            id: 111,
            authName: '角色列表',
            path: 'roles',
            children: [
              {
                id: 129,
                authName: '添加角色',
                path: 'roles'
              },
              {
                id: 130,
                authName: '删除角色',
                path: 'roles'
              },
              {
                id: 134,
                authName: '角色授权',
                path: 'roles'
              },
              {
                id: 135,
                authName: '取消角色授权',
                path: 'roles'
              },
              {
                id: 138,
                authName: '获取角色列表',
                path: 'roles'
              },
              {
                id: 139,
                authName: '获取角色详情',
                path: 'roles'
              },
              {
                id: 140,
                authName: '更新角色信息',
                path: 'roles'
              },
              {
                id: 141,
                authName: '更新角色权限',
                path: 'roles'
              }
            ]
          },
          {
            id: 112,
            authName: '权限列表',
            path: 'rights',
            children: [
              {
                id: 147,
                authName: '查看权限',
                path: 'rights'
              }
            ]
          }
        ]
      },
      {
        id: 125,
        authName: '用户管理',
        path: 'users',
        children: [
          {
            id: 110,
            authName: '用户列表',
            path: 'users',
            children: [
              {
                id: 131,
                authName: '添加用户',
                path: 'users'
              },
              {
                id: 132,
                authName: '删除用户',
                path: 'users'
              },
              {
                id: 133,
                authName: '更新用户',
                path: 'users'
              },
              {
                id: 136,
                authName: '获取用户详情',
                path: 'users'
              },
              {
                id: 137,
                authName: '分配用户角色',
                path: 'users'
              }
            ]
          }
        ]
      },
      {
        id: 145,
        authName: '数据统计',
        path: 'reports',
        children: [
          {
            id: 146,
            authName: '数据报表',
            path: 'reports',
            children: [
              {
                id: 148,
                authName: '查看数据',
                path: 'reports'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 39,
    roleName: '大发送到',
    roleDesc: '阿斯蒂芬',
    children: [
      {
        id: 101,
        authName: '商品管理',
        path: 'goods',
        children: [
          {
            id: 104,
            authName: '商品列表',
            path: 'goods',
            children: [
              {
                id: 116,
                authName: '商品修改',
                path: 'goods'
              }
            ]
          },
          {
            id: 115,
            authName: '分类参数',
            path: 'params',
            children: [
              {
                id: 142,
                authName: '获取参数列表',
                path: 'categories'
              },
              {
                id: 143,
                authName: '创建商品参数',
                path: 'categories'
              },
              {
                id: 144,
                authName: '删除商品参数',
                path: 'categories'
              }
            ]
          },
          {
            id: 121,
            authName: '商品分类',
            path: 'categories',
            children: [
              {
                id: 122,
                authName: '添加分类',
                path: 'categories'
              },
              {
                id: 123,
                authName: '删除分类',
                path: 'categories'
              },
              {
                id: 149,
                authName: '获取分类详情',
                path: 'categories'
              }
            ]
          }
        ]
      },
      {
        id: 102,
        authName: '订单管理',
        path: 'orders',
        children: [
          {
            id: 107,
            authName: '订单列表',
            path: 'orders',
            children: [
              {
                id: 109,
                authName: '添加订单',
                path: 'orders'
              }
            ]
          }
        ]
      },
      {
        id: 103,
        authName: '权限管理',
        path: 'rights',
        children: [
          {
            id: 111,
            authName: '角色列表',
            path: 'roles',
            children: [
              {
                id: 129,
                authName: '添加角色',
                path: 'roles'
              },
              {
                id: 130,
                authName: '删除角色',
                path: 'roles'
              },
              {
                id: 134,
                authName: '角色授权',
                path: 'roles'
              },
              {
                id: 135,
                authName: '取消角色授权',
                path: 'roles'
              },
              {
                id: 138,
                authName: '获取角色列表',
                path: 'roles'
              },
              {
                id: 139,
                authName: '获取角色详情',
                path: 'roles'
              },
              {
                id: 140,
                authName: '更新角色信息',
                path: 'roles'
              },
              {
                id: 141,
                authName: '更新角色权限',
                path: 'roles'
              }
            ]
          },
          {
            id: 112,
            authName: '权限列表',
            path: 'rights',
            children: [
              {
                id: 147,
                authName: '查看权限',
                path: 'rights'
              }
            ]
          }
        ]
      },
      {
        id: 125,
        authName: '用户管理',
        path: 'users',
        children: [
          {
            id: 110,
            authName: '用户列表',
            path: 'users',
            children: [
              {
                id: 131,
                authName: '添加用户',
                path: 'users'
              },
              {
                id: 132,
                authName: '删除用户',
                path: 'users'
              },
              {
                id: 133,
                authName: '更新用户',
                path: 'users'
              },
              {
                id: 136,
                authName: '获取用户详情',
                path: 'users'
              },
              {
                id: 137,
                authName: '分配用户角色',
                path: 'users'
              }
            ]
          }
        ]
      },
      {
        id: 145,
        authName: '数据统计',
        path: 'reports',
        children: [
          {
            id: 146,
            authName: '数据报表',
            path: 'reports',
            children: [
              {
                id: 148,
                authName: '查看数据',
                path: 'reports'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 40,
    roleName: 'test',
    roleDesc: 'test',
    children: [
      {
        id: 101,
        authName: '商品管理',
        path: 'goods',
        children: [
          {
            id: 104,
            authName: '商品列表',
            path: 'goods',
            children: [
              {
                id: 116,
                authName: '商品修改',
                path: 'goods'
              }
            ]
          },
          {
            id: 115,
            authName: '分类参数',
            path: 'params',
            children: [
              {
                id: 142,
                authName: '获取参数列表',
                path: 'categories'
              },
              {
                id: 143,
                authName: '创建商品参数',
                path: 'categories'
              },
              {
                id: 144,
                authName: '删除商品参数',
                path: 'categories'
              }
            ]
          },
          {
            id: 121,
            authName: '商品分类',
            path: 'categories',
            children: [
              {
                id: 122,
                authName: '添加分类',
                path: 'categories'
              },
              {
                id: 123,
                authName: '删除分类',
                path: 'categories'
              },
              {
                id: 149,
                authName: '获取分类详情',
                path: 'categories'
              }
            ]
          }
        ]
      },
      {
        id: 102,
        authName: '订单管理',
        path: 'orders',
        children: [
          {
            id: 107,
            authName: '订单列表',
            path: 'orders',
            children: [
              {
                id: 109,
                authName: '添加订单',
                path: 'orders'
              }
            ]
          }
        ]
      },
      {
        id: 103,
        authName: '权限管理',
        path: 'rights',
        children: [
          {
            id: 111,
            authName: '角色列表',
            path: 'roles',
            children: [
              {
                id: 129,
                authName: '添加角色',
                path: 'roles'
              },
              {
                id: 130,
                authName: '删除角色',
                path: 'roles'
              },
              {
                id: 134,
                authName: '角色授权',
                path: 'roles'
              },
              {
                id: 135,
                authName: '取消角色授权',
                path: 'roles'
              },
              {
                id: 138,
                authName: '获取角色列表',
                path: 'roles'
              },
              {
                id: 139,
                authName: '获取角色详情',
                path: 'roles'
              },
              {
                id: 140,
                authName: '更新角色信息',
                path: 'roles'
              },
              {
                id: 141,
                authName: '更新角色权限',
                path: 'roles'
              }
            ]
          },
          {
            id: 112,
            authName: '权限列表',
            path: 'rights',
            children: [
              {
                id: 147,
                authName: '查看权限',
                path: 'rights'
              }
            ]
          }
        ]
      },
      {
        id: 125,
        authName: '用户管理',
        path: 'users',
        children: [
          {
            id: 110,
            authName: '用户列表',
            path: 'users',
            children: [
              {
                id: 131,
                authName: '添加用户',
                path: 'users'
              },
              {
                id: 132,
                authName: '删除用户',
                path: 'users'
              },
              {
                id: 133,
                authName: '更新用户',
                path: 'users'
              },
              {
                id: 136,
                authName: '获取用户详情',
                path: 'users'
              },
              {
                id: 137,
                authName: '分配用户角色',
                path: 'users'
              }
            ]
          }
        ]
      },
      {
        id: 145,
        authName: '数据统计',
        path: 'reports',
        children: [
          {
            id: 146,
            authName: '数据报表',
            path: 'reports',
            children: [
              {
                id: 148,
                authName: '查看数据',
                path: 'reports'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 41,
    roleName: 'dsdf',
    roleDesc: 'sf ',
    children: [
      {
        id: 101,
        authName: '商品管理',
        path: 'goods',
        children: [
          {
            id: 104,
            authName: '商品列表',
            path: 'goods',
            children: [
              {
                id: 116,
                authName: '商品修改',
                path: 'goods'
              }
            ]
          },
          {
            id: 115,
            authName: '分类参数',
            path: 'params',
            children: [
              {
                id: 142,
                authName: '获取参数列表',
                path: 'categories'
              },
              {
                id: 143,
                authName: '创建商品参数',
                path: 'categories'
              },
              {
                id: 144,
                authName: '删除商品参数',
                path: 'categories'
              }
            ]
          },
          {
            id: 121,
            authName: '商品分类',
            path: 'categories',
            children: [
              {
                id: 122,
                authName: '添加分类',
                path: 'categories'
              },
              {
                id: 123,
                authName: '删除分类',
                path: 'categories'
              },
              {
                id: 149,
                authName: '获取分类详情',
                path: 'categories'
              }
            ]
          }
        ]
      },
      {
        id: 102,
        authName: '订单管理',
        path: 'orders',
        children: [
          {
            id: 107,
            authName: '订单列表',
            path: 'orders',
            children: [
              {
                id: 109,
                authName: '添加订单',
                path: 'orders'
              }
            ]
          }
        ]
      },
      {
        id: 103,
        authName: '权限管理',
        path: 'rights',
        children: [
          {
            id: 111,
            authName: '角色列表',
            path: 'roles',
            children: [
              {
                id: 129,
                authName: '添加角色',
                path: 'roles'
              },
              {
                id: 130,
                authName: '删除角色',
                path: 'roles'
              },
              {
                id: 134,
                authName: '角色授权',
                path: 'roles'
              },
              {
                id: 135,
                authName: '取消角色授权',
                path: 'roles'
              },
              {
                id: 138,
                authName: '获取角色列表',
                path: 'roles'
              },
              {
                id: 139,
                authName: '获取角色详情',
                path: 'roles'
              },
              {
                id: 140,
                authName: '更新角色信息',
                path: 'roles'
              },
              {
                id: 141,
                authName: '更新角色权限',
                path: 'roles'
              }
            ]
          },
          {
            id: 112,
            authName: '权限列表',
            path: 'rights',
            children: [
              {
                id: 147,
                authName: '查看权限',
                path: 'rights'
              }
            ]
          }
        ]
      },
      {
        id: 125,
        authName: '用户管理',
        path: 'users',
        children: [
          {
            id: 110,
            authName: '用户列表',
            path: 'users',
            children: [
              {
                id: 131,
                authName: '添加用户',
                path: 'users'
              },
              {
                id: 132,
                authName: '删除用户',
                path: 'users'
              },
              {
                id: 133,
                authName: '更新用户',
                path: 'users'
              },
              {
                id: 136,
                authName: '获取用户详情',
                path: 'users'
              },
              {
                id: 137,
                authName: '分配用户角色',
                path: 'users'
              }
            ]
          }
        ]
      },
      {
        id: 145,
        authName: '数据统计',
        path: 'reports',
        children: [
          {
            id: 146,
            authName: '数据报表',
            path: 'reports',
            children: [
              {
                id: 148,
                authName: '查看数据',
                path: 'reports'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 42,
    roleName: '去瞧瞧',
    roleDesc: '钱钱钱',
    children: [
      {
        id: 101,
        authName: '商品管理',
        path: 'goods',
        children: [
          {
            id: 115,
            authName: '分类参数',
            path: 'params',
            children: [
              {
                id: 142,
                authName: '获取参数列表',
                path: 'categories'
              },
              {
                id: 143,
                authName: '创建商品参数',
                path: 'categories'
              },
              {
                id: 144,
                authName: '删除商品参数',
                path: 'categories'
              }
            ]
          },
          {
            id: 121,
            authName: '商品分类',
            path: 'categories',
            children: [
              {
                id: 122,
                authName: '添加分类',
                path: 'categories'
              },
              {
                id: 123,
                authName: '删除分类',
                path: 'categories'
              },
              {
                id: 149,
                authName: '获取分类详情',
                path: 'categories'
              }
            ]
          },
          {
            id: 104,
            authName: '商品列表',
            path: 'goods',
            children: [
              {
                id: 116,
                authName: '商品修改',
                path: 'goods'
              },
              {
                id: 151,
                authName: '更新商品属性',
                path: 'goods'
              },
              {
                id: 152,
                authName: '更新商品状态',
                path: 'goods'
              }
            ]
          }
        ]
      },
      {
        id: 102,
        authName: '订单管理',
        path: 'orders',
        children: [
          {
            id: 107,
            authName: '订单列表',
            path: 'orders',
            children: [
              {
                id: 109,
                authName: '添加订单',
                path: 'orders'
              }
            ]
          }
        ]
      },
      {
        id: 103,
        authName: '权限管理',
        path: 'rights',
        children: [
          {
            id: 111,
            authName: '角色列表',
            path: 'roles',
            children: [
              {
                id: 129,
                authName: '添加角色',
                path: 'roles'
              },
              {
                id: 130,
                authName: '删除角色',
                path: 'roles'
              },
              {
                id: 134,
                authName: '角色授权',
                path: 'roles'
              },
              {
                id: 135,
                authName: '取消角色授权',
                path: 'roles'
              },
              {
                id: 138,
                authName: '获取角色列表',
                path: 'roles'
              },
              {
                id: 139,
                authName: '获取角色详情',
                path: 'roles'
              },
              {
                id: 140,
                authName: '更新角色信息',
                path: 'roles'
              },
              {
                id: 141,
                authName: '更新角色权限',
                path: 'roles'
              }
            ]
          },
          {
            id: 112,
            authName: '权限列表',
            path: 'rights',
            children: [
              {
                id: 147,
                authName: '查看权限',
                path: 'rights'
              }
            ]
          }
        ]
      },
      {
        id: 125,
        authName: '用户管理',
        path: 'users',
        children: [
          {
            id: 110,
            authName: '用户列表',
            path: 'users',
            children: [
              {
                id: 131,
                authName: '添加用户',
                path: 'users'
              },
              {
                id: 132,
                authName: '删除用户',
                path: 'users'
              },
              {
                id: 133,
                authName: '更新用户',
                path: 'users'
              },
              {
                id: 136,
                authName: '获取用户详情',
                path: 'users'
              },
              {
                id: 137,
                authName: '分配用户角色',
                path: 'users'
              }
            ]
          }
        ]
      },
      {
        id: 145,
        authName: '数据统计',
        path: 'reports',
        children: [
          {
            id: 146,
            authName: '数据报表',
            path: 'reports',
            children: [
              {
                id: 148,
                authName: '查看数据',
                path: 'reports'
              }
            ]
          }
        ]
      }
    ]
  }
]