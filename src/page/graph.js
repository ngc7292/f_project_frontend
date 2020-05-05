import G6 from '@antv/g6';
import {Card } from 'antd';
import React from 'react';
import Search from 'antd/lib/input/Search';
import { Row, Col } from 'antd';

export default class graphClass extends React.Component {
    constructor() {
        super();
        this.ref = React.createRef();
    }

    componentDidMount() {
        this.renderG6()
    };

    renderG6 = () => {

        const graph = new G6.Graph({
            container: 'graph',
            width : this.ref.current.clientWidth,
            height : this.ref.current.clientHight || 500,
            layout: {
              type: 'force',
            },
            defaultNode: {
              size: 15,
              color: '#5B8FF9',
              style: {
                lineWidth: 2,
                fill: '#C6E5FF',
              },
            },
            defaultEdge: {
              size: 1,
              color: '#e2e2e2',
            },
          });
        
        fetch('https://gw.alipayobjects.com/os/antvdemo/assets/data/relations.json')
          .then(res => res.json())
          .then(data => {
            graph.data({
              nodes: data.nodes,
              edges: data.edges.map(function(edge, i) {
                edge.id = 'edge' + i;
                return Object.assign({}, edge);
              }),
            });
            graph.render();
        
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
          });
        
        function refreshDragedNodePosition(e) {
          const model = e.item.get('model');
          model.fx = e.x;
          model.fy = e.y;
        }
        
    };

    render(){
        return (
            <Card>
                <Search></Search>
                <div id="graph" ref={this.ref}></div>
            </Card>
        );
    };
  }
