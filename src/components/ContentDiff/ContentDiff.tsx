import { useEffect, useState } from "react";
import { Layout, Radio, RadioChangeEvent } from "antd";

import { ContentDiffProps } from "./ContentDiff.models";
import "./styles.css";
import { All, Head, Tail } from "../Icons";

const { Content } = Layout;

const DISPLAY_TYPE = {
  UNIFIED: 0,
  SPLIT: 1
};

const BLOCK_LENGTH = 3;

const ContentDiff = ({ diffResults, isFile }: ContentDiffProps) => {
  const [lineGroup, setLineGroup] = useState([]);
  const [displayType, setDisplayType] = useState<number>(DISPLAY_TYPE.SPLIT);
  const [isSplit, setIsSplit] = useState<boolean>(
    displayType === DISPLAY_TYPE.SPLIT
  );

  useEffect(() => {
    parseResults(diffResults);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diffResults]);

  useEffect(() => {
    setIsSplit(displayType === DISPLAY_TYPE.SPLIT);
  }, [displayType]);

  const onChangeDisplayType = (e: RadioChangeEvent) => {
    setDisplayType(e.target.value as number);
  };

  const parseResults = (newArr: any) => {
    if (typeof (newArr || diffResults) === "string") return;
    const initLineGroup = (newArr || diffResults).map(
      (item: any, index: any, originArr: any) => {
        let added, removed, value, count;
        if (isFile) {
          added = item[0] === "+";
          removed = item[0] === "-";
          value = item.slice(1);
          count = 1;
        } else {
          added = item.added;
          removed = item.removed;
          value = item.value;
          count = item.count;
        }
        const strArr = value?.split("\n").filter((item: any) => item) || [];
        const type = (added && "+") || (removed && "-") || " ";
        let head, hidden, tail;
        if (type !== " ") {
          hidden = [];
          tail = [];
          head = strArr;
        } else {
          const strLength = strArr.length;
          if (strLength <= BLOCK_LENGTH * 2) {
            hidden = [];
            tail = [];
            head = strArr;
          } else {
            head = strArr.slice(0, BLOCK_LENGTH);
            hidden = strArr.slice(BLOCK_LENGTH, strLength - BLOCK_LENGTH);
            tail = strArr.slice(strLength - BLOCK_LENGTH);
          }
        }
        return {
          type,
          count,
          content: {
            hidden,
            head,
            tail
          }
        };
      }
    );
    let lStartNum = 1;
    let rStartNum = 1;
    initLineGroup.forEach((item: any) => {
      const { type, count } = item;
      item.leftPos = lStartNum;
      item.rightPos = rStartNum;
      lStartNum += type === "+" ? 0 : count;
      rStartNum += type === "-" ? 0 : count;
    });
    setLineGroup(initLineGroup);
  };

  const renderSplitContent = () => {
    const length = lineGroup.length;
    const contentList = [];
    for (let i = 0; i < length; i++) {
      const targetBlock = lineGroup[i];
      const {
        type,
        content: { hidden }
      }: any = targetBlock;
      if (type === " ") {
        contentList.push(
          <div key={i}>
            {parseSplitCode(targetBlock)}
            {(hidden.length && parseHiddenBtn(hidden, i)) || null}
            {parseSplitCode(targetBlock, false)}
          </div>
        );
      } else if (type === "-") {
        const nextTarget: any = lineGroup[i + 1] || { content: {} };
        const nextIsPlus = nextTarget.type === "+";
        contentList.push(
          <div key={i}>
            {parseCombinePart(targetBlock, nextIsPlus ? nextTarget : {})}
          </div>
        );
        nextIsPlus ? (i = i + 1) : void 0;
      } else if (type === "+") {
        contentList.push(
          <div key={i}>{parseCombinePart({}, targetBlock)}</div>
        );
      }
    }
    return <div>{contentList}</div>;
  };

  const renderUnifiedContent = () => {
    return lineGroup.map((item: any, index: any) => {
      const {
        type,
        content: { hidden }
      } = item;
      const isNormal = type === " ";
      return (
        <div key={index}>
          {renderDiffLine(item)}
          {(hidden.length && isNormal && parseHiddenBtn(hidden, index)) || null}
          {renderDiffLine(item, false)}
        </div>
      );
    });
  };

  const parsLineBlock = (type: any, index: any) => {
    const copyOfLG: any = lineGroup.slice();
    const targetGroup = copyOfLG[index];
    const { head, tail, hidden } = targetGroup.content;
    if (type === "head") {
      targetGroup.content.head = head.concat(hidden.slice(0, BLOCK_LENGTH));
      targetGroup.content.hidden = hidden.slice(BLOCK_LENGTH);
    } else if (type === "tail") {
      const hiddenLength = hidden.length;
      targetGroup.content.tail = hidden
        .slice(hiddenLength - BLOCK_LENGTH)
        .concat(tail);
      targetGroup.content.hidden = hidden.slice(0, hiddenLength - BLOCK_LENGTH);
    } else {
      targetGroup.content.head = head.concat(hidden);
      targetGroup.content.hidden = [];
    }
    copyOfLG[index] = targetGroup;
    setLineGroup(copyOfLG);
  };

  const parseHiddenBtn = (hidden: any, index: any) => {
    const isSingle = hidden.length < BLOCK_LENGTH * 2;
    return (
      <div key="collapse" className="collapsible-wrapper">
        <div className={`colLeft ${isSplit ? "splitWidth" : ""}`}>
          {isSingle ? (
            <div className="arrow" onClick={() => parsLineBlock("all", index)}>
              <All />
            </div>
          ) : (
            <>
              <div
                className="arrow"
                onClick={() => parsLineBlock("head", index)}
              >
                <Head />
              </div>
              <div
                className="arrow"
                onClick={() => parsLineBlock("tail", index)}
              >
                <Tail />
              </div>
            </>
          )}
        </div>
        <div className={`collRight, ${isSplit ? "collRightSplit" : ""}`}>
          <div
            className={`colRContent ${isSingle ? "" : "cRHeight"}`}
          >{`Collapsed: ${hidden.length} lines`}</div>
        </div>
      </div>
    );
  };

  const parseCombinePart = (leftPart = {}, rightPart = {}) => {
    const {
      type: lType,
      content: lContent,
      leftPos: lLeftPos
    }: // rightPos: lRightPos
    any = leftPart;
    const {
      type: rType,
      content: rContent,
      // leftPos: rLeftPos,
      rightPos: rRightPos
    }: any = rightPart;
    const leftArr = lContent?.head || [];
    const rightArr = rContent?.head || [];
    const lClass = lType === "+" ? "add" : "removed";
    const rClass = rType === "+" ? "add" : "removed";
    return (
      <>
        <div className="iBlock lBorder">
          {leftArr.map((item: any, index: any) => {
            return (
              <div className={`prBlock ${lClass}`} key={index}>
                {parseLineNumPadding(lLeftPos + index)}
                {parsePaddingContent("-  " + item)}
              </div>
            );
          })}
        </div>
        <div className={`iBlock ${leftArr.length ? "" : "rBorder"}`}>
          {rightArr.map((item: any, index: any) => {
            return (
              <div className={`prBlock ${rClass}`} key={index}>
                {parseLineNumPadding(rRightPos + index)}
                {parsePaddingContent("+  " + item)}
              </div>
            );
          })}
        </div>
      </>
    );
  };

  const parseSplitCode = (targetBlock: any, isHead = true) => {
    const {
      content: { head, hidden, tail },
      leftPos,
      rightPos
    } = targetBlock;
    return (isHead ? head : tail).map((item: any, index: any) => {
      const shift = isHead ? 0 : head.length + hidden.length;
      return (
        <div key={(isHead ? "h-" : "t-") + index}>
          <div className="iBlock lBorder">
            {parseLineNumPadding(leftPos + shift + index)}
            {parsePaddingContent("    " + item)}
          </div>
          <div className="iBlock">
            {parseLineNumPadding(rightPos + shift + index)}
            {parsePaddingContent("    " + item)}
          </div>
        </div>
      );
    });
  };

  const renderDiffLine = (item: any, isHead = true) => {
    const {
      type,
      content: { head, tail, hidden },
      leftPos,
      rightPos
    } = item;
    const isNormal = type === " ";
    const cls = `normal ${type === "+" ? "add" : ""} ${
      type === "-" ? "removed" : ""
    }`;
    const space = "     ";
    return (isHead ? head : tail).map((sitem: any, sindex: any) => {
      let posMark = "";
      if (isNormal) {
        const shift = isHead ? 0 : head.length + hidden.length;
        posMark =
          (space + (leftPos + shift + sindex)).slice(-5) +
          (space + (rightPos + shift + sindex)).slice(-5);
      } else {
        posMark =
          type === "-"
            ? parseLineNum(leftPos + sindex) + space
            : space + parseLineNum(rightPos + sindex);
      }
      return (
        <div key={(isHead ? "h-" : "t-") + sindex} className={cls}>
          <pre className="pre line">{posMark}</pre>
          <div className="outerPre">
            <div className="splitCon">
              <div className="spanWidth">{" " + type + " "}</div>
              {parsePaddingContent(sitem)}
            </div>
          </div>
        </div>
      );
    });
  };

  const parseLineNum = (lineNum: number) => {
    return ("     " + lineNum).slice(-5);
  };

  const parseLineNumPadding = (origin: any) => {
    const item = ("     " + origin).slice(-5);
    return <div className="splitLN">{item}</div>;
  };

  const parsePaddingContent = (item: any) => {
    return <div className="splitCon">{item}</div>;
  };

  return (
    <>
      <div className="radioGroup">
        <Radio.Group
          value={displayType}
          size="small"
          onChange={(e: RadioChangeEvent) => onChangeDisplayType(e)}
        >
          <Radio.Button value={DISPLAY_TYPE.SPLIT}>Split</Radio.Button>
          <Radio.Button value={DISPLAY_TYPE.UNIFIED}>Unified</Radio.Button>
        </Radio.Group>
      </div>

      <Content className="content">
        <div className="color">
          {isSplit ? renderSplitContent() : renderUnifiedContent()}
        </div>
      </Content>
    </>
  );
};

export default ContentDiff;
