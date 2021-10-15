import { useState } from "react";
import { Layout, Menu } from "antd";

import InputPanel from "./components/InputPanel";
import ContentDiff from "./components/ContentDiff";
import Footer from "./components/Footer";

import "./app-styles.css";
import "./common-styles.css";

import { content1 } from "./tests/content1";
import { content2 } from "./tests/content2";

const jsDiff = require("diff");

const MENU_TAB = {
  LINES: "0",
  CONTENT: "1"
};

const App = () => {
  const [menuTab, setMenuTab] = useState<string>(MENU_TAB.LINES);

  const onClickChangeMenuTab = (e: any) => {
    setMenuTab(e.key);
  };

  const RenderContent = () => {
    const results = jsDiff.diffJson(content1, content2);
    return <ContentDiff diffResults={results} isFile={false} />;
  };

  return (
    <Layout>
      <Menu
        mode="horizontal"
        onClick={(e: any) => onClickChangeMenuTab(e)}
        defaultSelectedKeys={[menuTab]}
      >
        <Menu.Item key={MENU_TAB.LINES}>Text Diff</Menu.Item>
        <Menu.Item key={MENU_TAB.CONTENT}>JSON Diff</Menu.Item>
      </Menu>
      {menuTab === MENU_TAB.LINES && <InputPanel />}
      {menuTab === MENU_TAB.CONTENT && <RenderContent />}
      <Footer />
    </Layout>
  );
};

export default App;
