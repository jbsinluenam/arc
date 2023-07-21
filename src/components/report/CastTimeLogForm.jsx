// react imports
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateCastTimeLog } from "~/redux/features/ProductionReportSlice";
import Image from "next/image";

// components
import Button from "~/components/Button";
import TimeInputField from "~/components/TimeInputField";
import Delete from "~/assets/icons/Delete.svg";

// import edit and delete modals
import AccordionCrudModalAdd from "~/components/report/AccordionCrudModalAdd";
// import AccordionCrudModalDelete from "~/components/report/AccordionCrudModalDelete";
import ConfirmationModal from "~/components/global/ConfirmationModal";

// helper
import { ISOToTimeString } from "~/helper/timeInputParser";

// CastTimeLog component form
const CastTimeLogForm = ({ productionInfo }) => {
  // to show or hide the add modal
  const [showAddModal, setShowAddModal] = useState(false);

  // to show or hide the delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // selected index
  const [selectedIndex, setSelectedIndex] = useState(undefined);

  const dispatch = useDispatch();
  const castTimeLogInfo = useSelector(
    (state) => state.productionReport.data.castTimeLog
  );

  // ================================> Form event functions
  function addClickHandler() {
    setSelectedIndex(undefined);
    setShowAddModal(true);
  }

  function rowClickHandler(event, idx) {
    event.preventDefault();
    // delete condition
    if (event.target.className.includes("icon-delete-row")) {
      setSelectedIndex(idx);
      setShowDeleteModal(true);
    } else {
      // edit condition
      setSelectedIndex(idx);
      setShowAddModal(true);
    }
  }

  // ================================> Modal event functions

  function hideAddModal() {
    console.log("hide modal hit");
    setSelectedIndex(undefined);
    setShowAddModal(false);
  }

  // on modal close set selected index to undefined

  function deleteConfirmationHandler() {
    const updatedRows = castTimeLogInfo.filter((item, i) => i !== selectedIndex);
    dispatch(updateCastTimeLog(updatedRows));
    setSelectedIndex(undefined);
    setShowDeleteModal(false);
  }

  return (
    <>
      {showAddModal && (
        <AccordionCrudModalAdd
          type="castTimeLog"
          modalWidth={90}
          hideAddModal={hideAddModal}
          selectedIndex={selectedIndex}
          productionInfo={productionInfo}
        />
      )}

      {showDeleteModal && (
        <ConfirmationModal
          heading="Delete Confirmation"
          message="Are you sure you want to delete?"
          cancelHandler={() => setShowDeleteModal(false)}
          actionHandler={(selectedIndex) => deleteConfirmationHandler(selectedIndex)}
        />
      )}

      {
        <div>
          <div className="flow-root">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-primary-base text-base text-bold text-contrast-dark">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="pb-3.5 pl-4 pr-3 text-left sm:pl-0"
                      >
                        No.
                      </th>
                      <th
                        scope="col"
                        className="px-3 pb-3.5 text-left "
                      >
                        Cast
                      </th>
                      <th
                        scope="col"
                        className="px-3 pb-3.5 text-left "
                      >
                        Character
                      </th>
                      <th
                        scope="col"
                        className="px-3 pb-3.5 text-left "
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-3 pb-3.5 text-left "
                      >
                        Work Schedule
                      </th>
                      <th
                        scope="col"
                        className="px-3 pb-3.5 text-left "
                      >
                        Meals
                      </th>
                      <th
                        scope="col"
                        className="relative min-w-[60px] pb-3.5 pl-3 pr-4 sm:pr-0"
                      >
                        <span className="sr-only">Delete</span>
                      </th>
                    </tr>
                  </thead>
                  {castTimeLogInfo?.length > 0 && (
                    <tbody className="divide-y divide-gray-200 text-base">
                      {castTimeLogInfo.map((row, idx) => (
                        <tr key={idx} onClick={(e) => rowClickHandler(e, idx)}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3  font-medium sm:pl-0">
                            {idx + 1}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4  text-contrast-dark">
                            {row.cast}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4  text-contrast-dark">
                            {row.character}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4  text-contrast-dark">
                            {row.status}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4  text-contrast-dark">
                            <div className="flex gap-1">
                              <TimeInputField
                                label="MU Report"
                                isReadyOnly={true}
                                value={ISOToTimeString(
                                  row.workSchedule.muReport
                                )}
                              />
                              <TimeInputField
                                label="On Set"
                                isReadyOnly={true}
                                value={ISOToTimeString(row.workSchedule.onSet)}
                              />
                              <TimeInputField
                                label="Set Wrap"
                                isReadyOnly={true}
                                value={ISOToTimeString(
                                  row.workSchedule.setWrap
                                )}
                              />
                              <TimeInputField
                                label="Set Dismiss"
                                isReadyOnly={true}
                                value={ISOToTimeString(
                                  row.workSchedule.setDismiss
                                )}
                              />
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4  text-contrast-dark">
                            {/* {row.meals} */}
                            <div className="flex gap-1">
                              <TimeInputField
                                label="Lunch In"
                                isReadyOnly={true}
                                value={ISOToTimeString(row.meals.lunchIn)}
                              />
                              <TimeInputField
                                label="Lunch Out"
                                isReadyOnly={true}
                                value={ISOToTimeString(row.meals.lunchOut)}
                              />
                              <TimeInputField
                                label="Second Meal In"
                                isReadyOnly={true}
                                value={ISOToTimeString(row.meals.secondMealIn)}
                              />
                              <TimeInputField
                                label="Second Meal Out"
                                isReadyOnly={true}
                                value={ISOToTimeString(row.meals.secondMealOut)}
                              />
                            </div>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right  font-medium sm:pr-0">
                            <Image
                              className={`icon-delete-row hover:cursor-pointer`}
                              src={Delete}
                              alt="Delete icon"
                            />
                            <span className="sr-only">
                              Delete Cast Number {idx + 1}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  )}
                </table>
                {/* Else show empty message with button */}
                {castTimeLogInfo?.length == 0 && (
                  <div className="mt-4 flex flex-col items-center gap-4 border-primary-base pt-4">
                    <div>
                      <p className=" text-contrast-dark">
                        No cast time log found.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Button to Create New Line */}
            <div className="mt-2 flex justify-end gap-4 border-primary-light pt-4">
              <Button
                onClick={addClickHandler}
                buttonType="Secondary"
                className="px-4 py-[15px]"
              >
                <div className="text-center border-primary-light text-sm font-bold">Create New Line</div>
              </Button>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default CastTimeLogForm;
