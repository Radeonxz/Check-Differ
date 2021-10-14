import { useEffect, useState } from "react";
import { Button, Select, Input, Form } from "antd";

import ContentDiff from "../ContentDiff";
import "./styles.css";

const jsDiff = require("diff");
const FormItem = Form.Item;
const { TextArea } = Input;

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
};

const SeleLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 10 }
};

const InputPanel = () => {
  const [leftValue, setLeftValue] = useState<string>("abc");
  const [rightValue, setRightValue] = useState<string>("ab");
  const [method, setMethod] = useState<string>("");
  const [diffResults, setDiffResults] = useState([]);

  useEffect(() => {
    checkDiff();
  }, []);

  const onChangeInput = (
    type: string,
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (type === "left") setLeftValue(e.target.value);
    if (type === "right") setRightValue(e.target.value);
  };

  const checkDiff = () => {
    const results = jsDiff["diffLines"](leftValue, rightValue);
    setDiffResults(results);
  };

  return (
    <div className="wrapper">
      <div className="inputWrapper">
        <FormItem {...layout} label="Left" className="input">
          <TextArea
            style={{ height: 350 }}
            defaultValue={leftValue}
            onChange={(e) => onChangeInput("left", e)}
          />
        </FormItem>
        <FormItem {...layout} label="Right" className="input">
          <TextArea
            style={{ height: 350 }}
            defaultValue={rightValue}
            onChange={(e) => onChangeInput("right", e)}
          />
        </FormItem>
      </div>
      <div className="funWrapper">
        <FormItem {...SeleLayout} label="Methods">
          <Select
            // defaultValue={method}
            style={{ width: 220 }}
            // onChange={this.handleSelectChange}
          >
            {/* {diffMethod.map((item, index) => {
                                return <Select.Option key={index} value={item}>{item}</Select.Option>
                            })} */}
          </Select>
        </FormItem>
        <Button type="primary" onClick={checkDiff}>
          Compare
        </Button>
      </div>
      <ContentDiff diffResults={diffResults} isFile={false} />
      {/* {this.isDirectPatch ? <div className={s.preWrap}>{typeof diffArr === 'string' ? diffArr : ''}</div> : this.isWordType ? this.getCharDiff() : <ContentDiff isFile={this.isFile} diffArr={diffArr}/>} */}
    </div>
  );
};

export default InputPanel;
