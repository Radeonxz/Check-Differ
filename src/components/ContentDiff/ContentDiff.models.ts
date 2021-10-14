export interface ContentDiffProps {
  diffResults: Array<ContentDiffItemProps>;
  isFile: boolean;
}

export interface ContentDiffItemProps {
  count: number;
  value: string;
  added?: boolean;
  removed?: boolean;
}

export interface ContentProps {
  head: [string];
  hidden: [string];
  tail: [string];
  count: number;
  leftPos: number;
  rightPos: number;
}
