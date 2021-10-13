import { Button, Select, Input, Form } from "antd";

import "./styles.css";

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
  return (
    <div className="wrapper">
      <div className="inputWrapper">
        <FormItem {...layout} label="Left" className="input">
          <TextArea
          // defaultValue={value1}
          // onChange={this.changInput.bind(null, 0)}
          />
        </FormItem>
        <FormItem {...layout} label="Right" className="input">
          <TextArea
          // defaultValue={value2}
          // onChange={this.changInput.bind(null, 1)}
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
        <Button type="primary">Compare</Button>
      </div>
      {/* {this.isDirectPatch ? <div className={s.preWrap}>{typeof diffArr === 'string' ? diffArr : ''}</div> : this.isWordType ? this.getCharDiff() : <ContentDiff isFile={this.isFile} diffArr={diffArr}/>} */}
    </div>
  );
};

export default InputPanel;
