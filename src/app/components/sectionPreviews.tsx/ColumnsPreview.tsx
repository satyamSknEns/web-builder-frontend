import { JSX } from "react";
import Column2Section from "./Columns/Column2Section";
import Column3Section from "./Columns/Column3Section";
import Column4Section from "./Columns/Column4Section";

const columnsMap: Record<string, JSX.Element> = {
  "2 Columns": <Column2Section />,
  "3 Columns": <Column3Section />,
  "4 Columns": <Column4Section />
};

const ColumnsPreview = ({ heading }: { heading: string }) => {
  return (
    columnsMap[heading] || (
      <p className="text-gray-400">Invalid Column Preview</p>
    )
  );
};

export default ColumnsPreview;
