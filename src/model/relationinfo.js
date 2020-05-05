import request from '../util/request.js';  // request 是 demo 项目脚手架中提供的一个做 http 请求的方法，是对于 fetch 的封装，返回 Promise

const delay = (millisecond) => {
  return new Promise((resolve) => {
    setTimeout(resolve, millisecond);
  });
};

export default {
  namespace: 'relationinfo',
  state: {
      c_p: {
        nodes:[],
        edges:[]
      },
      c_s: {
        nodes:[],
        edges:[]
      },
      remain_nodes: [],
      status:true
  },
  effects: {
    *queryInitInfo(_, sagaEffects) {
      const { call, put } = sagaEffects;
      const init_url = "http://127.0.0.1:5000/api/company/平安银行";

      const answer = yield call(request, init_url);

      yield put({ type: 'updateNewData', payload: answer });

    },
    *askNewQuestion({ payload:name }, sagaEffects){
      const {call, put} = sagaEffects;
      const checkUrl = "http://127.0.0.1:5000/api/company/"+name;

      const answer = yield call(request, checkUrl);
      yield put({ type: 'updateNewData', payload: answer });
    }
  },
  reducers: {
    updateNewData(state, { payload: newData }){
      //console.log(JSON.parse(newData));
      var data = JSON.parse(newData);
      console.log(data);
      return {
        ...data
      };
    }
  },
};