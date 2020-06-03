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

const div_css = {
  display:"inline-block"
}
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
    onDidMount: () => {
      dispatch({
        type: `${namespace}/queryInitInfo`,
      });
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
        this.props.onDidMount();
        console.log(this.props)
        this.width = 750*2;
        this.hight = this.ref.current.clientHight || 630;
        this.graph_2 = this.initG6_c_s();
        this.graph_2.render();
    };

    componentWillReceiveProps () {
        console.log(this.props);
        this.updateG6_c_s();
    }

    initG6_c_s() {
      const graph = new G6.Graph({
        container: 'graph_2',
        width : this.width,
        height : this.hight || 500,
        layout: {
          type: 'dagre',
          nodesepFunc: d => {
            return 1;
          },
          ranksep: 40,
          controlPoints: true
        },
        defaultNode: {
          type: 'rect',
        },
        defaultEdge: {
          type: 'polyline',
          style: {
            radius: 30,
            offset: 45,
            endArrow: true,
            lineWidth: 2,
            stroke: '#C2C8D5',
          },
        },
        modes: {
          default: [
            {
              type: 'collapse-expand',
              onChange: function onChange(item, collapsed) {
                const data = item.get('model').data;
                data.collapsed = collapsed;
                return true;
              },
            },
            'drag-canvas',
            'zoom-canvas',
            'click-select'
          ]
        },
      });

      return graph;
    };

    updateG6_c_s() {
      this.graph_2.changeData({
        nodes: this.props.company_hold.nodes.map(function(node) {
          node.id = String(node.id);
          node.label = node.name;
          node.type = 'rect';
          if(node.flag == 1) {
            node.size=[100,50];
          }
          else {
            node.size = [70,30];
            node.label = fittingString(node.name,30,10);
          }
          // node.label = fittingString(node.name,node.size,10);
          return Object.assign({}, node);
        }),
        edges: this.props.company_hold.edges.map(function(edge) {
          var temp = edge.source;
          edge.source = String(edge.target);
          edge.target = String(temp);
          return Object.assign({}, edge);
        }),
      })
    };

    render(){
        return (
            <Card>
                <Search defaultValue="如：平安银行" onSearch={value => this.props.onSearch(value)}/>
                <div>
                  <div id="graph" ref={this.ref} style={div_css}></div>
                  <div id="graph_2" ref={this.ref} style={div_css}></div>
                </div>
            </Card>
        );
    };
  }