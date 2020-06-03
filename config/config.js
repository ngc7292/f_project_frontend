export default {
  plugins: [
    ['umi-plugin-react', {
      antd: true,
      dva: true
    }],
  ],
  routes: [{
    path: '/',
    component: '../layout',
    routes: [
      {
        path: '/',
        component: './showinfo',
      },
      {
        path: '/showinfo/:id',
        component: './showinfo',
      },
      {
        path: '/showstock',
        component: './showstock',
      },
    ]
  }],
  singular: true,
  proxy: {
    '/dev': {
      target: 'https://08ad1pao69.execute-api.us-east-1.amazonaws.com',
      changeOrigin: true,
    },
  },
};

