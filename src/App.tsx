import { Layout, Menu } from "antd";

import InputPanel from "./components/InputPanel";
import ContentDiff from "./components/ContentDiff";

import "./app-styles.css";
import "./common-styles.css";

const App = () => {
  const { Footer } = Layout;

  return (
    <Layout>
      <Menu mode="horizontal">
        <Menu.Item>JSON Diff</Menu.Item>
        <Menu.Item>Text Diff</Menu.Item>
      </Menu>
      <InputPanel />
      <ContentDiff />
      <Footer style={{ textAlign: "center" }}>Footer</Footer>
    </Layout>
  );
};

export default App;
