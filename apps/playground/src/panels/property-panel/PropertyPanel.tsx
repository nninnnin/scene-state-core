import { version as coreVersion } from "@ssc/core";
import useSelectedEntity from "./hooks/useSelectedEntity";

const PropertyPanel = () => {
  const { selectedEntity } = useSelectedEntity();

  return (
    <div id="navigation-bar" className="flex flex-col">
      <div>
        <div className="bg-gray-100 p-3 ">
          core: {coreVersion()}
        </div>

        <div className="p-3 bg-gray-200">
          Active: {selectedEntity?.name}
        </div>
      </div>
    </div>
  );
};

export default PropertyPanel;
