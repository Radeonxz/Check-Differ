import { Layout, Menu } from "antd";

import ContentDiff from "./components/ContentDiff";

const App = () => {
  const { Footer } = Layout;

  return (
    <Layout>
      <Menu>
        <Menu.Item>JSON Diff</Menu.Item>
        <Menu.Item>Text Diff</Menu.Item>
      </Menu>
      <ContentDiff />
      <Footer style={{ textAlign: "center" }}>Footer</Footer>
    </Layout>
  );
};

export default App;
