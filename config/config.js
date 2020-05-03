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
        component: './graph',
      },
      {
        path: '/helloworld',
        component: './puzzlecards'
      },
      { 
        path: '/puzzlecards', 
        component: './puzzlecards' 
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

