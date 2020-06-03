import G6 from '@antv/g6';
import {Card,Input,Select,Row, Col } from 'antd';
import React,{ Component } from 'react';
import { connect } from 'dva';
import insertCss from 'insert-css';

const { Search } = Input;

const namespace = 'relationinfo';


insertCss(`
  .g6-tooltip {
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    font-size: 12px;
    color: #545454;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 10px 8px;
    box-shadow: rgb(174, 174, 174) 0px 0px 10px;
  }
`);

const calcStrLen = str => {
  let len = 0;
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128) {
      len++;
    } else {
      len += 2;
    }
  }
  return len;
};

const fittingString = (str, maxWidth, fontSize) => {
  const fontWidth = fontSize * 1.3; // 字号+边距
  maxWidth = maxWidth * 2; // 需要根据自己项目调整
  const width = calcStrLen(str) * fontWidth;
  const ellipsis = '…';
  if (width > maxWidth) {
    const actualLen = Math.floor((maxWidth - 10) / fontWidth);
    const result = str.substring(0, actualLen) + ellipsis;
    return result;
  }
  return str;
};

const mapStateToProps = (state) => {
  const data = state[namespace];
  console.log(data.c_p);
  return {
    company_person:{...data.c_p},
    company_hold:{...data.c_s}
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onDidMount: (props) => {
      console.log(location);
      if (props.match.params['id']){
        dispatch({
          type: `${namespace}/askNewQuestion`,
          payload: props.match.params['id'],
        })
      } else{
        dispatch({
          type: `${namespace}/queryInitInfo`,
        });
      }
    },
    onSearch: (name) =>{
      dispatch({
        type: `${namespace}/askNewQuestion`,
        payload: name,
      })
    }
  };
};

@connect(mapStateToProps, mapDispatchToProps)
export default class ShowInfo extends Component {
    constructor() {
        super();
        this.ref = React.createRef();
        // this.graph = this.initG6();
    }

    componentDidMount() {
        this.props.onDidMount(this.props);
        console.log(this)
        this.width = this.ref.current.clientWidth;
        this.hight = this.ref.current.clientHight || 630;
        this.graph_1 = this.initG6_c_p();
        this.graph_1.render();
    };

    componentWillReceiveProps () {
        console.log(this.props);
        this.updateG6_c_p();
    }

    initG6_c_p() {
      const graph = new G6.Graph({
        container: 'graph',
        width : this.ref.current.clientWidth,
        height : this.hight || 500,
        layout: {
          type: 'force',
          preventOverlap: true,
          linkDistance: edge => {
            if (edge.source.flag = 2 && edge.target.flag == 1) return 160;
            else return 50;
          },
          edgeStrength: d=> {
            if(d.source.flag == 2 && d.target.flag == 1) return 0.7;
            else return 0.3;
          },
          nodeStrength: d=> {
            if(d.flag == 1) return -50;
            if(d.flag == 2) return -30;
            else return -10;
          },
          // nodeSpacing: d=> {
          //   if(d.flag == 1) return 50;
          //   else if(d.flag == 2) return 30;
          //   else return 5;
          // }
        },
        defaultNode: {
          type: 'circle',
          size: 40,
          color: '#5B8FF9',
          style: {
            lineWidth: 1,
            fill: '#C6E5FF',
          },
        },
        defaultEdge: {
          size: 2,
          color: '#e2e2e2',
        },
        modes: {
          default: [
            'drag-node',
            {
              type: 'tooltip',
              formatText: function formatText(model) {
                if(model.props.c_name){
                  var text = '公司名称: ' + model.props.c_name + '<br/>';
                  text += '公司地址: ' + model.props.c_addr + '<br/>';
                  text += '公司英文名称: ' + model.props.c_e_name + '<br/>';
                  text += '公司股票标号: ' + model.props.c_id + '<br/>';
                  text += '公司网址: ' + model.props.c_net_addr + '<br/>';
                  text += '公司上市时间: ' + model.props.c_up_date + '<br/>';
                  text += '公司类型: ' + model.props.c_type;
                } else {
                  var text = "高管名称： " + model.props.p_name;
                }
                return text;
              },
              offset: 30
            },
            {
              type: 'edge-tooltip',
              formatText: function formatText(model) {
                var text = '开始时间: ' + model.value.s_start_time +"<br/>";
                text += "结束时间： " + model.value.s_end_time + "<br/>";
                text += "职位： " + model.value.s_type;
                return text;
              },
              offset: 30
            },
          ],
        },
        renderer: 'svg'
      });

      graph.on('node:dragstart', function(e) {
        graph.layout();
        refreshDragedNodePosition(e);
      });
      graph.on('node:drag', function(e) {
        refreshDragedNodePosition(e);
      });
      graph.on('node:dragend', function(e) {
        e.item.get('model').fx = null;
        e.item.get('model').fy = null;
      });
  
      function refreshDragedNodePosition(e) {
        const model = e.item.get('model');
        model.fx = e.x;
        model.fy = e.y;
      }

      return graph;
    }


    updateG6_c_p() {
      this.graph_1.changeData({
        nodes: this.props.company_person.nodes.map(function(node) {
          node.id = String(node.id);
          node.label = node.name;
          if(node.flag == 1) node.size=100;
          else if (node.flag == 2) node.size = 50;
          else node.size = 30;

          node.label = fittingString(node.name,node.size,10);

          if(node.type == 2){
            node.color = "#eb2728";
            node.style = {
              lineWidth: 1,
              fill: '#F16667',
            }
          } else if(node.type == 3){
            node.color = "#f36924";
            node.style = {
              lineWidth: 1,
              fill: '#F79767',
            }
          }
          return Object.assign({}, node);
        }),
        edges: this.props.company_person.edges.map(function(edge) {
          edge.source = String(edge.source);
          edge.target = String(edge.target);
          return Object.assign({}, edge);
        }),
      })
    };

    render(){
        return (
            <Card>
                <Search defaultValue="如：平安银行" onSearch={value => this.props.onSearch(value)}/>
                <div>
                  <div id="graph" ref={this.ref}></div>
                </div>
            </Card>
        );
    };
  }