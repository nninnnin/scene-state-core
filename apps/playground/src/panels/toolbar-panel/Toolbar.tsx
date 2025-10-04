import clsx from "clsx";
import { AddEntityCommand } from "@ssc/core";
import { useCommand } from "@ssc/react";

const Toolbar = () => {
  const { dispatch } = useCommand();

  const handleAddEntityClick = () => {
    const random = Math.random() * 100;

    const entityId = "my-id" + random;
    const entityName = "Justin" + random;

    dispatch(
      new AddEntityCommand(entityId, entityName),
    );
  };

  return (
    <div
      id="button-container"
      className="bg-gray-100 p-5"
    >
      <button
        className={clsx(
          "bg-amber-200 p-3 px-2 rounded-xl",
        )}
        onClick={handleAddEntityClick}
      >
        엔티티 추가
      </button>
    </div>
  );
};

export default Toolbar;
