import { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
const { Header, Footer, Sider, Content } = Layout;
import Link from 'umi/link';
import MenuUnfoldOutlined from '@ant-design/icons';

// 引入子菜单组件
const SubMenu = Menu.SubMenu;

export default class BasicLayout extends Component {
  render() {
    return (
      <Layout>
        <Sider width={256} style={{ minHeight: '100vh' }}>
          <div style={{ height: '32px', background: 'rgba(255,255,255,.2)', margin: '16px'}}></div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Link to="/">
                <Icon type="pie-chart" />
                <span>知识图谱查询</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/showstock">
                <MenuUnfoldOutlined />
                <span>股权解析</span>
              </Link>
            </Menu.Item>
          </Menu>
        </Sider>
        
        <Layout >
          <Header style={{ background: '#fff', textAlign: 'center', padding: 0 }}>ngc7293's 金融知识提取系统</Header>
          <Content style={{ margin: '24px 16px 0' , width:'100%'}}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 ,width:'100%'}}>
              {this.props.children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
    )
  }
}