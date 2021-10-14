import { Layout } from "antd";

import "./styles.css";

const Footer = () => {
  const { Footer } = Layout;

  return (
    <Footer className="footer">
      &#169; 2021 - {new Date().getFullYear()} Check Differ, Xz
    </Footer>
  );
};

export default Footer;
