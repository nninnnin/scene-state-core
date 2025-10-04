import { version as coreVersion } from "@ssc/core";
const PropertyPanel = () => {
  return (
    <div id="navigation-bar" className="flex flex-col">
      <div>
        <div className="bg-gray-100 p-3 ">
          core: {coreVersion()}
        </div>

        <div className="p-3 bg-gray-200">Active:</div>
      </div>
    </div>
  );
};

export default PropertyPanel;
