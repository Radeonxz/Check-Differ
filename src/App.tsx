import { Layout, Menu } from "antd";

import InputPanel from "./components/InputPanel";
import Footer from "./components/Footer";

import "./app-styles.css";
import "./common-styles.css";

const App = () => {
  return (
    <Layout>
      <Menu mode="horizontal">
        {/* <Menu.Item>JSON Diff</Menu.Item> */}
        <Menu.Item>Text Diff</Menu.Item>
      </Menu>
      <InputPanel />
      <Footer />
    </Layout>
  );
};

export default App;
